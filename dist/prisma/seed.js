"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting database seeding...');
    try {
        // Clear existing data to avoid conflicts
        await prisma.washTransaction.deleteMany();
        await prisma.promoCode.deleteMany();
        await prisma.inventoryUsage.deleteMany();
        await prisma.inventoryItem.deleteMany();
        await prisma.staffShift.deleteMany();
        await prisma.auditLog.deleteMany();
        await prisma.staff.deleteMany();
        await prisma.customer.deleteMany();
        await prisma.washService.deleteMany();
        await prisma.businessSettings.deleteMany();
        // Create sample services
        const services = [
            { name: 'Basic Exterior Wash', price: 300, duration: 30 },
            { name: 'Full Service Wash', price: 500, duration: 45 },
            { name: 'Deluxe Interior & Exterior', price: 800, duration: 60 },
            { name: 'Engine Wash', price: 200, duration: 20 },
            { name: 'Wax & Polish', price: 400, duration: 40 },
        ];
        for (const service of services) {
            await prisma.washService.create({
                data: service,
            });
        }
        // Create sample customers
        const customers = [
            { name: 'John Doe', phone: '+254712345678', email: 'john@example.com', referralCode: 'JOHN2025' },
            { name: 'Jane Smith', phone: '+254798765432', email: 'jane@example.com', referralCode: 'JANE2025' },
            { name: 'Bob Johnson', phone: '+254711111111', referralCode: 'BOB2025' },
            { name: 'Alice Brown', phone: '+254722222222', email: 'alice@example.com', referralCode: 'ALICE2025' },
            { name: 'Charlie Wilson', phone: '+254733333333', referralCode: 'CHARLIE2025' },
        ];
        for (const customer of customers) {
            await prisma.customer.create({
                data: customer,
            });
        }
        // Create sample inventory items
        const inventoryItems = [
            { name: 'Car Shampoo', quantity: 50, minStock: 10, unit: 'liters', supplier: 'CleanCorp Ltd', costPrice: 500 },
            { name: 'Microfiber Cloths', quantity: 200, minStock: 20, unit: 'pieces', supplier: 'Textile Supplies', costPrice: 50 },
            { name: 'Tire Shine', quantity: 30, minStock: 5, unit: 'bottles', supplier: 'AutoCare Pro', costPrice: 300 },
            { name: 'Interior Cleaner', quantity: 25, minStock: 5, unit: 'cans', supplier: 'SparkleChem', costPrice: 400 },
            { name: 'Vacuum Bags', quantity: 100, minStock: 15, unit: 'pieces', supplier: 'HomeDepot', costPrice: 20 },
        ];
        for (const item of inventoryItems) {
            await prisma.inventoryItem.create({
                data: item,
            });
        }
        // Create sample promo codes
        const promoCodes = [
            { code: 'WELCOME20', discount: 20, type: 'percentage', expiry: new Date('2025-12-31') },
            { code: 'FIRSTTIME', discount: 100, type: 'fixed', usageLimit: 50 },
            { code: 'LOYALTY50', discount: 50, type: 'percentage', usageLimit: 100 },
            { code: 'SUMMER2025', discount: 15, type: 'percentage', expiry: new Date('2025-08-31') },
        ];
        for (const promo of promoCodes) {
            await prisma.promoCode.create({
                data: promo,
            });
        }
        // Create sample staff
        const staffMembers = [
            { name: 'Admin User', email: 'admin@theebazaar.com', role: 'admin', password: 'admin123' }, // In production, hash passwords
            { name: 'Cashier One', email: 'cashier1@theebazaar.com', role: 'cashier', password: 'cashier123' },
            { name: 'Attendant One', email: 'attendant1@theebazaar.com', role: 'attendant', password: 'attendant123' },
            { name: 'Attendant Two', email: 'attendant2@theebazaar.com', role: 'attendant', password: 'attendant123' },
        ];
        for (const staff of staffMembers) {
            await prisma.staff.create({
                data: staff,
            });
        }
        // Create business settings
        await prisma.businessSettings.create({
            data: {
                id: 'settings',
                name: 'Thee Bazaar Carwash',
                logo: '/TheeBazaar Logo.jpg',
                taxRate: 0,
                currency: 'KES',
                receiptFooter: 'Thank you for choosing Thee Bazaar Carwash!',
            },
        });
        console.log('Database seeded successfully!');
    }
    catch (error) {
        console.error('Error during seeding:', error);
        throw error;
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
