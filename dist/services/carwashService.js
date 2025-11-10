"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeService = exports.modifyService = exports.generateReceiptPDF = exports.sendReceiptEmail = exports.fetchReceipt = exports.modifyBusinessSettings = exports.fetchBusinessSettings = exports.finishShift = exports.beginShift = exports.authenticateStaff = exports.modifyStaff = exports.addStaff = exports.fetchStaff = exports.checkPromoCode = exports.removePromoCode = exports.modifyPromoCode = exports.addPromoCode = exports.fetchPromoCodes = exports.addInventoryUsage = exports.removeInventory = exports.modifyInventory = exports.addInventory = exports.fetchInventory = exports.generateReports = exports.addCustomer = exports.fetchCustomers = exports.fetchWashHistory = exports.saveWash = exports.addService = exports.fetchServices = void 0;
const prisma_1 = require("../db/prisma");
const fetchServices = async () => prisma_1.prisma.washService.findMany();
exports.fetchServices = fetchServices;
const addService = async (data) => prisma_1.prisma.washService.create({ data });
exports.addService = addService;
const saveWash = async (data) => {
    // Generate receipt number
    const receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    let discountAmount = 0;
    let promoCodeId = null;
    // Validate and apply promo code if provided
    if (data.promoCode) {
        const promoValidation = await (0, exports.checkPromoCode)(data.promoCode);
        if (promoValidation.valid) {
            if (promoValidation.type === 'percentage') {
                discountAmount = (data.price * data.quantity) * (promoValidation.discount / 100);
            }
            else {
                discountAmount = promoValidation.discount || 0;
            }
            promoCodeId = promoValidation.id;
            // Increment usage count
            await prisma_1.prisma.promoCode.update({
                where: { code: data.promoCode },
                data: { usageCount: { increment: 1 } },
            });
        }
    }
    const baseTotal = data.price * data.quantity;
    const total = Math.max(0, baseTotal - discountAmount);
    const transaction = await prisma_1.prisma.washTransaction.create({
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
        const customer = await prisma_1.prisma.customer.update({
            where: { id: data.customerId },
            data: {
                loyaltyPoints: {
                    increment: pointsEarned,
                },
            },
        });
        // Update loyalty tier based on points
        let newTier = 'Bronze';
        if (customer.loyaltyPoints >= 1000)
            newTier = 'Gold';
        else if (customer.loyaltyPoints >= 500)
            newTier = 'Silver';
        if (newTier !== customer.loyaltyTier) {
            await prisma_1.prisma.customer.update({
                where: { id: data.customerId },
                data: { loyaltyTier: newTier },
            });
        }
    }
    return transaction;
};
exports.saveWash = saveWash;
const fetchWashHistory = async () => prisma_1.prisma.washTransaction.findMany({
    include: { service: true, customer: true },
    orderBy: { createdAt: 'desc' },
});
exports.fetchWashHistory = fetchWashHistory;
const fetchCustomers = async () => prisma_1.prisma.customer.findMany({
    include: {
        transactions: {
            include: { service: true },
            orderBy: { createdAt: 'desc' },
        },
    },
    orderBy: { createdAt: 'desc' },
});
exports.fetchCustomers = fetchCustomers;
const addCustomer = async (data) => {
    const customer = await prisma_1.prisma.customer.create({ data });
    // Update referral if referredBy exists
    if (data.referredBy) {
        await prisma_1.prisma.customer.update({
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
exports.addCustomer = addCustomer;
const generateReports = async () => {
    const totalTransactions = await prisma_1.prisma.washTransaction.count();
    const totalRevenue = await prisma_1.prisma.washTransaction.aggregate({
        _sum: { total: true },
    });
    const servicePopularity = await prisma_1.prisma.washTransaction.groupBy({
        by: ['serviceId'],
        _count: { serviceId: true },
        _sum: { total: true },
    });
    const services = await prisma_1.prisma.washService.findMany();
    const serviceStats = servicePopularity.map(stat => {
        const service = services.find(s => s.id === stat.serviceId);
        return {
            serviceName: service?.name || 'Unknown',
            count: stat._count.serviceId,
            revenue: stat._sum.total || 0,
        };
    });
    const customerStats = await prisma_1.prisma.customer.findMany({
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
    const revenueByMonth = await prisma_1.prisma.washTransaction.groupBy({
        by: ['createdAt'],
        _sum: { total: true },
        orderBy: { createdAt: 'asc' },
    });
    const paymentMethodStats = await prisma_1.prisma.washTransaction.groupBy({
        by: ['paymentMethod'],
        _count: { paymentMethod: true },
        _sum: { total: true },
    });
    const vehicleTypeStats = await prisma_1.prisma.washTransaction.groupBy({
        by: ['vehicleType'],
        _count: { vehicleType: true },
    });
    const promoUsageStats = await prisma_1.prisma.promoCode.findMany({
        include: {
            transactions: true,
        },
    });
    const lowStockAlerts = await prisma_1.prisma.inventoryItem.findMany({
        where: {
            quantity: {
                lte: prisma_1.prisma.inventoryItem.fields.minStock,
            },
        },
    });
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
exports.generateReports = generateReports;
// Inventory Management
const fetchInventory = async () => prisma_1.prisma.inventoryItem.findMany({
    include: { usages: true },
    orderBy: { createdAt: 'desc' },
});
exports.fetchInventory = fetchInventory;
const addInventory = async (data) => prisma_1.prisma.inventoryItem.create({ data });
exports.addInventory = addInventory;
const modifyInventory = async (id, data) => prisma_1.prisma.inventoryItem.update({
    where: { id },
    data,
});
exports.modifyInventory = modifyInventory;
const removeInventory = async (id) => prisma_1.prisma.inventoryItem.delete({
    where: { id },
});
exports.removeInventory = removeInventory;
const addInventoryUsage = async (id, data) => {
    // Deduct from inventory
    await prisma_1.prisma.inventoryItem.update({
        where: { id },
        data: { quantity: { decrement: data.quantity } },
    });
    return prisma_1.prisma.inventoryUsage.create({
        data: { ...data, itemId: id },
    });
};
exports.addInventoryUsage = addInventoryUsage;
// Promo Codes
const fetchPromoCodes = async () => prisma_1.prisma.promoCode.findMany({
    orderBy: { createdAt: 'desc' },
});
exports.fetchPromoCodes = fetchPromoCodes;
const addPromoCode = async (data) => prisma_1.prisma.promoCode.create({ data });
exports.addPromoCode = addPromoCode;
const modifyPromoCode = async (id, data) => prisma_1.prisma.promoCode.update({
    where: { id },
    data,
});
exports.modifyPromoCode = modifyPromoCode;
const removePromoCode = async (id) => prisma_1.prisma.promoCode.delete({
    where: { id },
});
exports.removePromoCode = removePromoCode;
const checkPromoCode = async (code) => {
    const promo = await prisma_1.prisma.promoCode.findUnique({
        where: { code },
    });
    if (!promo)
        return { valid: false, message: 'Promo code not found' };
    if (promo.expiry && new Date() > promo.expiry)
        return { valid: false, message: 'Promo code expired' };
    if (promo.usageLimit && promo.usageCount >= promo.usageLimit)
        return { valid: false, message: 'Promo code usage limit reached' };
    return { valid: true, discount: promo.discount, type: promo.type, id: promo.id };
};
exports.checkPromoCode = checkPromoCode;
// Staff Management
const fetchStaff = async () => prisma_1.prisma.staff.findMany({
    include: { shifts: true, audits: true },
    orderBy: { createdAt: 'desc' },
});
exports.fetchStaff = fetchStaff;
const addStaff = async (data) => prisma_1.prisma.staff.create({ data });
exports.addStaff = addStaff;
const modifyStaff = async (id, data) => prisma_1.prisma.staff.update({
    where: { id },
    data,
});
exports.modifyStaff = modifyStaff;
const authenticateStaff = async (data) => {
    const staff = await prisma_1.prisma.staff.findUnique({
        where: { email: data.email },
    });
    if (!staff || staff.password !== data.password) { // In production, use proper hashing
        return { success: false, message: 'Invalid credentials' };
    }
    // Log login
    await prisma_1.prisma.auditLog.create({
        data: {
            staffId: staff.id,
            action: 'login',
        },
    });
    return { success: true, staff };
};
exports.authenticateStaff = authenticateStaff;
const beginShift = async (data) => prisma_1.prisma.staffShift.create({
    data,
});
exports.beginShift = beginShift;
const finishShift = async (id) => prisma_1.prisma.staffShift.update({
    where: { id },
    data: { endTime: new Date() },
});
exports.finishShift = finishShift;
// Business Settings
const fetchBusinessSettings = async () => prisma_1.prisma.businessSettings.findUnique({
    where: { id: 'settings' },
}) || {
    id: 'settings',
    name: 'Thee Bazaar Carwash',
    logo: null,
    taxRate: 0,
    currency: 'KES',
    receiptFooter: null,
};
exports.fetchBusinessSettings = fetchBusinessSettings;
const modifyBusinessSettings = async (data) => prisma_1.prisma.businessSettings.upsert({
    where: { id: 'settings' },
    update: data,
    create: { id: 'settings', ...data },
});
exports.modifyBusinessSettings = modifyBusinessSettings;
// Receipt Management
const fetchReceipt = async (number) => prisma_1.prisma.washTransaction.findUnique({
    where: { receiptNumber: number },
    include: { service: true, customer: true },
});
exports.fetchReceipt = fetchReceipt;
const sendReceiptEmail = async (number, email) => {
    // Placeholder for email sending logic
    // In production, integrate with email service like SendGrid
    console.log(`Sending receipt ${number} to ${email}`);
    return { success: true, message: 'Receipt sent' };
};
exports.sendReceiptEmail = sendReceiptEmail;
const generateReceiptPDF = async (number) => {
    const transaction = await prisma_1.prisma.washTransaction.findUnique({
        where: { receiptNumber: number },
        include: { service: true, customer: true },
    });
    if (!transaction)
        throw new Error('Receipt not found');
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
exports.generateReceiptPDF = generateReceiptPDF;
// Service Management (moved to end to avoid redeclaration)
const modifyService = async (id, data) => prisma_1.prisma.washService.update({
    where: { id },
    data,
});
exports.modifyService = modifyService;
const removeService = async (id) => prisma_1.prisma.washService.delete({
    where: { id },
});
exports.removeService = removeService;
