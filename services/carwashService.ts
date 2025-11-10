import { prisma } from '../db/prisma';

export const fetchServices = async () => prisma.washService.findMany();
export const addService = async (data: any) => prisma.washService.create({ data });

export const saveWash = async (data: any) => {
  // Generate receipt number
  const receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  let discountAmount = 0;
  let promoCodeId = null;

  // Validate and apply promo code if provided
  if (data.promoCode) {
    const promoValidation = await checkPromoCode(data.promoCode);
    if (promoValidation.valid) {
      if (promoValidation.type === 'percentage') {
        discountAmount = (data.price * data.quantity) * (promoValidation.discount / 100);
      } else {
        discountAmount = promoValidation.discount || 0;
      }
      promoCodeId = promoValidation.id;

      // Increment usage count
      await prisma.promoCode.update({
        where: { code: data.promoCode },
        data: { usageCount: { increment: 1 } },
      });
    }
  }

  const baseTotal = data.price * data.quantity;
  const total = Math.max(0, baseTotal - discountAmount);

  const transaction = await prisma.washTransaction.create({
    data: {
      ...data,
      total,
      discount: discountAmount,
      promoCodeId,
      receiptNumber,
    },
  });

  // Award loyalty points if customer exists
  if (data.customerId) {
    const pointsEarned = Math.floor(baseTotal / 10); // 1 point per 10 KES spent (before discount)
    const customer = await prisma.customer.update({
      where: { id: data.customerId },
      data: {
        loyaltyPoints: {
          increment: pointsEarned,
        },
      },
    });

    // Update loyalty tier based on points
    let newTier = 'Bronze';
    if (customer.loyaltyPoints >= 1000) newTier = 'Gold';
    else if (customer.loyaltyPoints >= 500) newTier = 'Silver';

    if (newTier !== customer.loyaltyTier) {
      await prisma.customer.update({
        where: { id: data.customerId },
        data: { loyaltyTier: newTier },
      });
    }
  }

  return transaction;
};

export const fetchWashHistory = async () =>
  prisma.washTransaction.findMany({
    include: { service: true, customer: true },
    orderBy: { createdAt: 'desc' },
  });

export const fetchCustomers = async () =>
  prisma.customer.findMany({
    include: {
      transactions: {
        include: { service: true },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

export const addCustomer = async (data: any) => {
  const customer = await prisma.customer.create({ data });

  // Update referral if referredBy exists
  if (data.referredBy) {
    await prisma.customer.update({
      where: { id: data.referredBy },
      data: {
        referrals: {
          connect: { id: customer.id },
        },
      },
    });
  }

  return customer;
};


export const generateReports = async () => {
  const totalTransactions = await prisma.washTransaction.count();
  const totalRevenue = await prisma.washTransaction.aggregate({
    _sum: { total: true },
  });

  const servicePopularity = await prisma.washTransaction.groupBy({
    by: ['serviceId'],
    _count: { serviceId: true },
    _sum: { total: true },
  });

  const services = await prisma.washService.findMany();
  const serviceStats = servicePopularity.map(stat => {
    const service = services.find(s => s.id === stat.serviceId);
    return {
      serviceName: service?.name || 'Unknown',
      count: stat._count.serviceId,
      revenue: stat._sum.total || 0,
    };
  });

  const customerStats = await prisma.customer.findMany({
    include: {
      transactions: true,
    },
  });

  const topCustomers = customerStats
    .map(customer => ({
      name: customer.name,
      totalVisits: customer.transactions.length,
      totalSpent: customer.transactions.reduce((sum, tx) => sum + tx.total, 0),
      loyaltyTier: customer.loyaltyTier,
      loyaltyPoints: customer.loyaltyPoints,
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);

  // Additional analytics
  const revenueByMonth = await prisma.washTransaction.groupBy({
    by: ['createdAt'],
    _sum: { total: true },
    orderBy: { createdAt: 'asc' },
  });

  const paymentMethodStats = await prisma.washTransaction.groupBy({
    by: ['paymentMethod'],
    _count: { paymentMethod: true },
    _sum: { total: true },
  });

  const vehicleTypeStats = await prisma.washTransaction.groupBy({
    by: ['vehicleType'],
    _count: { vehicleType: true },
  });

  const promoUsageStats = await prisma.promoCode.findMany({
    include: {
      transactions: true,
    },
  });

  const allInventoryItems = await prisma.inventoryItem.findMany();
  const lowStockAlerts = allInventoryItems.filter((item) => item.quantity <= item.minStock);

  return {
    totalTransactions,
    totalRevenue: totalRevenue._sum.total || 0,
    serviceStats,
    topCustomers,
    revenueByMonth,
    paymentMethodStats,
    vehicleTypeStats,
    promoUsageStats,
    lowStockAlerts,
  };
};

// Inventory Management
export const fetchInventory = async () =>
  prisma.inventoryItem.findMany({
    include: { usages: true },
    orderBy: { createdAt: 'desc' },
  });

export const addInventory = async (data: any) => prisma.inventoryItem.create({ data });

export const modifyInventory = async (id: string, data: any) =>
  prisma.inventoryItem.update({
    where: { id },
    data,
  });

export const removeInventory = async (id: string) =>
  prisma.inventoryItem.delete({
    where: { id },
  });

export const addInventoryUsage = async (id: string, data: any) => {
  // Deduct from inventory
  await prisma.inventoryItem.update({
    where: { id },
    data: { quantity: { decrement: data.quantity } },
  });

  return prisma.inventoryUsage.create({
    data: { ...data, itemId: id },
  });
};

// Promo Codes
export const fetchPromoCodes = async () =>
  prisma.promoCode.findMany({
    orderBy: { createdAt: 'desc' },
  });

export const addPromoCode = async (data: any) => prisma.promoCode.create({ data });

export const modifyPromoCode = async (id: string, data: any) =>
  prisma.promoCode.update({
    where: { id },
    data,
  });

export const removePromoCode = async (id: string) =>
  prisma.promoCode.delete({
    where: { id },
  });

export const checkPromoCode = async (code: string) => {
  const promo = await prisma.promoCode.findUnique({
    where: { code },
  });

  if (!promo) return { valid: false, message: 'Promo code not found' };
  if (promo.expiry && new Date() > promo.expiry) return { valid: false, message: 'Promo code expired' };
  if (promo.usageLimit && promo.usageCount >= promo.usageLimit) return { valid: false, message: 'Promo code usage limit reached' };

  return { valid: true, discount: promo.discount, type: promo.type, id: promo.id };
};

// Staff Management
export const fetchStaff = async () =>
  prisma.staff.findMany({
    include: { shifts: true, audits: true },
    orderBy: { createdAt: 'desc' },
  });

export const addStaff = async (data: any) => prisma.staff.create({ data });

export const modifyStaff = async (id: string, data: any) =>
  prisma.staff.update({
    where: { id },
    data,
  });

export const authenticateStaff = async (data: any) => {
  const staff = await prisma.staff.findUnique({
    where: { email: data.email },
  });

  if (!staff || staff.password !== data.password) { // In production, use proper hashing
    return { success: false, message: 'Invalid credentials' };
  }

  // Log login
  await prisma.auditLog.create({
    data: {
      staffId: staff.id,
      action: 'login',
    },
  });

  return { success: true, staff };
};

export const beginShift = async (data: any) =>
  prisma.staffShift.create({
    data,
  });

export const finishShift = async (id: string) =>
  prisma.staffShift.update({
    where: { id },
    data: { endTime: new Date() },
  });

// Business Settings
export const fetchBusinessSettings = async () =>
  prisma.businessSettings.findUnique({
    where: { id: 'settings' },
  }) || {
    id: 'settings',
    name: 'Thee Bazaar Carwash',
    logo: null,
    taxRate: 0,
    currency: 'KES',
    receiptFooter: null,
  };

export const modifyBusinessSettings = async (data: any) =>
  prisma.businessSettings.upsert({
    where: { id: 'settings' },
    update: data,
    create: { id: 'settings', ...data },
  });

// Receipt Management
export const fetchReceipt = async (number: string) =>
  prisma.washTransaction.findUnique({
    where: { receiptNumber: number },
    include: { service: true, customer: true },
  });

export const sendReceiptEmail = async (number: string, email: string) => {
  // Placeholder for email sending logic
  // In production, integrate with email service like SendGrid
  console.log(`Sending receipt ${number} to ${email}`);
  return { success: true, message: 'Receipt sent' };
};

export const generateReceiptPDF = async (number: string) => {
  const transaction = await prisma.washTransaction.findUnique({
    where: { receiptNumber: number },
    include: { service: true, customer: true },
  });

  if (!transaction) throw new Error('Receipt not found');

  // In a real implementation, you'd use jsPDF or similar to generate PDF
  // For now, return HTML that can be converted to PDF
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 300px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2>Thee Bazaar Carwash</h2>
        <p>Receipt #${transaction.receiptNumber}</p>
      </div>
      <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 10px 0;">
        <p><strong>Service:</strong> ${transaction.service.name}</p>
        <p><strong>Customer:</strong> ${transaction.customer?.name || 'Walk-in'}</p>
        <p><strong>Vehicle:</strong> ${transaction.vehicleType || 'N/A'}</p>
        <p><strong>Quantity:</strong> ${transaction.quantity}</p>
        ${transaction.discount && transaction.discount > 0 ? `<p><strong>Discount:</strong> KES ${transaction.discount}</p>` : ''}
        <p><strong>Payment:</strong> ${transaction.paymentMethod}</p>
        <p><strong>Total:</strong> KES ${transaction.total}</p>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 12px;">
        <p>Thank you for your business!</p>
        <p>${new Date(transaction.createdAt).toLocaleString()}</p>
      </div>
    </div>
  `;

  return html;
};

// Service Management (moved to end to avoid redeclaration)
export const modifyService = async (id: string, data: any) =>
  prisma.washService.update({
    where: { id },
    data,
  });

export const removeService = async (id: string) =>
  prisma.washService.delete({
    where: { id },
  });