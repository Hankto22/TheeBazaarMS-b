"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceiptPDF = exports.emailReceipt = exports.getReceipt = exports.updateBusinessSettings = exports.getBusinessSettings = exports.endShift = exports.startShift = exports.staffLogin = exports.updateStaff = exports.createStaff = exports.getStaff = exports.validatePromoCode = exports.deletePromoCode = exports.updatePromoCode = exports.createPromoCode = exports.getPromoCodes = exports.recordInventoryUsage = exports.deleteInventory = exports.updateInventory = exports.addInventoryItem = exports.getInventory = exports.getReports = exports.deleteService = exports.updateService = exports.createCustomer = exports.getCustomers = exports.getWashHistory = exports.recordWash = exports.createService = exports.getServices = exports.getDashboard = void 0;
const carwashService_1 = require("../services/carwashService");
const getDashboard = async (c) => c.json(await (0, carwashService_1.fetchDashboardData)());
exports.getDashboard = getDashboard;
const getServices = async (c) => c.json(await (0, carwashService_1.fetchServices)());
exports.getServices = getServices;
const createService = async (c) => {
    try {
        const body = await c.req.json();
        return c.json(await (0, carwashService_1.addService)(body), 201);
    }
    catch (error) {
        console.error('Error creating service:', error);
        return c.json({ error: 'Failed to create service' }, 500);
    }
};
exports.createService = createService;
const recordWash = async (c) => {
    try {
        const body = await c.req.json();
        return c.json(await (0, carwashService_1.saveWash)(body), 201);
    }
    catch (error) {
        console.error('Error recording wash:', error);
        return c.json({ error: 'Failed to record wash transaction' }, 500);
    }
};
exports.recordWash = recordWash;
const getWashHistory = async (c) => c.json(await (0, carwashService_1.fetchWashHistory)());
exports.getWashHistory = getWashHistory;
const getCustomers = async (c) => c.json(await (0, carwashService_1.fetchCustomers)());
exports.getCustomers = getCustomers;
const createCustomer = async (c) => {
    try {
        const body = await c.req.json();
        return c.json(await (0, carwashService_1.addCustomer)(body), 201);
    }
    catch (error) {
        console.error('Error creating customer:', error);
        return c.json({ error: 'Failed to create customer' }, 500);
    }
};
exports.createCustomer = createCustomer;
const updateService = async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        return c.json(await (0, carwashService_1.modifyService)(id, body));
    }
    catch (error) {
        console.error('Error updating service:', error);
        return c.json({ error: 'Failed to update service' }, 500);
    }
};
exports.updateService = updateService;
const deleteService = async (c) => {
    try {
        const id = c.req.param('id');
        await (0, carwashService_1.removeService)(id);
        return new Response(null, { status: 204 });
    }
    catch (error) {
        console.error('Error deleting service:', error);
        return c.json({ error: 'Failed to delete service' }, 500);
    }
};
exports.deleteService = deleteService;
const getReports = async (c) => {
    try {
        return c.json(await (0, carwashService_1.generateReports)());
    }
    catch (error) {
        console.error('Error generating reports:', error);
        return c.json({ error: 'Failed to generate reports' }, 500);
    }
};
exports.getReports = getReports;
const getInventory = async (c) => c.json(await (0, carwashService_1.fetchInventory)());
exports.getInventory = getInventory;
const addInventoryItem = async (c) => {
    try {
        const body = await c.req.json();
        return c.json(await (0, carwashService_1.addInventory)(body), 201);
    }
    catch (error) {
        console.error('Error adding inventory item:', error);
        return c.json({ error: 'Failed to add inventory item' }, 500);
    }
};
exports.addInventoryItem = addInventoryItem;
const updateInventory = async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        return c.json(await (0, carwashService_1.modifyInventory)(id, body));
    }
    catch (error) {
        console.error('Error updating inventory:', error);
        return c.json({ error: 'Failed to update inventory' }, 500);
    }
};
exports.updateInventory = updateInventory;
const deleteInventory = async (c) => {
    try {
        const id = c.req.param('id');
        await (0, carwashService_1.removeInventory)(id);
        return new Response(null, { status: 204 });
    }
    catch (error) {
        console.error('Error deleting inventory:', error);
        return c.json({ error: 'Failed to delete inventory' }, 500);
    }
};
exports.deleteInventory = deleteInventory;
const recordInventoryUsage = async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        return c.json(await (0, carwashService_1.addInventoryUsage)(id, body), 201);
    }
    catch (error) {
        console.error('Error recording inventory usage:', error);
        return c.json({ error: 'Failed to record inventory usage' }, 500);
    }
};
exports.recordInventoryUsage = recordInventoryUsage;
const getPromoCodes = async (c) => c.json(await (0, carwashService_1.fetchPromoCodes)());
exports.getPromoCodes = getPromoCodes;
const createPromoCode = async (c) => {
    try {
        const body = await c.req.json();
        return c.json(await (0, carwashService_1.addPromoCode)(body), 201);
    }
    catch (error) {
        console.error('Error creating promo code:', error);
        return c.json({ error: 'Failed to create promo code' }, 500);
    }
};
exports.createPromoCode = createPromoCode;
const updatePromoCode = async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        return c.json(await (0, carwashService_1.modifyPromoCode)(id, body));
    }
    catch (error) {
        console.error('Error updating promo code:', error);
        return c.json({ error: 'Failed to update promo code' }, 500);
    }
};
exports.updatePromoCode = updatePromoCode;
const deletePromoCode = async (c) => {
    try {
        const id = c.req.param('id');
        await (0, carwashService_1.removePromoCode)(id);
        return new Response(null, { status: 204 });
    }
    catch (error) {
        console.error('Error deleting promo code:', error);
        return c.json({ error: 'Failed to delete promo code' }, 500);
    }
};
exports.deletePromoCode = deletePromoCode;
const validatePromoCode = async (c) => {
    const body = await c.req.json();
    return c.json(await (0, carwashService_1.checkPromoCode)(body.code));
};
exports.validatePromoCode = validatePromoCode;
const getStaff = async (c) => c.json(await (0, carwashService_1.fetchStaff)());
exports.getStaff = getStaff;
const createStaff = async (c) => {
    try {
        const body = await c.req.json();
        return c.json(await (0, carwashService_1.addStaff)(body), 201);
    }
    catch (error) {
        console.error('Error creating staff:', error);
        return c.json({ error: 'Failed to create staff' }, 500);
    }
};
exports.createStaff = createStaff;
const updateStaff = async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        return c.json(await (0, carwashService_1.modifyStaff)(id, body));
    }
    catch (error) {
        console.error('Error updating staff:', error);
        return c.json({ error: 'Failed to update staff' }, 500);
    }
};
exports.updateStaff = updateStaff;
const staffLogin = async (c) => {
    try {
        const body = await c.req.json();
        return c.json(await (0, carwashService_1.authenticateStaff)(body));
    }
    catch (error) {
        console.error('Error authenticating staff:', error);
        return c.json({ error: 'Failed to authenticate' }, 500);
    }
};
exports.staffLogin = staffLogin;
const startShift = async (c) => {
    try {
        const body = await c.req.json();
        return c.json(await (0, carwashService_1.beginShift)(body), 201);
    }
    catch (error) {
        console.error('Error starting shift:', error);
        return c.json({ error: 'Failed to start shift' }, 500);
    }
};
exports.startShift = startShift;
const endShift = async (c) => {
    try {
        const id = c.req.param('id');
        return c.json(await (0, carwashService_1.finishShift)(id));
    }
    catch (error) {
        console.error('Error ending shift:', error);
        return c.json({ error: 'Failed to end shift' }, 500);
    }
};
exports.endShift = endShift;
const getBusinessSettings = async (c) => c.json(await (0, carwashService_1.fetchBusinessSettings)());
exports.getBusinessSettings = getBusinessSettings;
const updateBusinessSettings = async (c) => {
    try {
        const body = await c.req.json();
        return c.json(await (0, carwashService_1.modifyBusinessSettings)(body));
    }
    catch (error) {
        console.error('Error updating business settings:', error);
        return c.json({ error: 'Failed to update business settings' }, 500);
    }
};
exports.updateBusinessSettings = updateBusinessSettings;
const getReceipt = async (c) => {
    try {
        const number = c.req.param('number');
        const receipt = await (0, carwashService_1.fetchReceipt)(number);
        if (!receipt) {
            return c.json({ error: 'Receipt not found' }, 404);
        }
        return c.json(receipt);
    }
    catch (error) {
        console.error('Error fetching receipt:', error);
        return c.json({ error: 'Failed to fetch receipt' }, 500);
    }
};
exports.getReceipt = getReceipt;
const emailReceipt = async (c) => {
    try {
        const number = c.req.param('number');
        const body = await c.req.json();
        return c.json(await (0, carwashService_1.sendReceiptEmail)(number, body.email));
    }
    catch (error) {
        console.error('Error emailing receipt:', error);
        return c.json({ error: 'Failed to email receipt' }, 500);
    }
};
exports.emailReceipt = emailReceipt;
const getReceiptPDF = async (c) => {
    try {
        const number = c.req.param('number');
        const html = await (0, carwashService_1.generateReceiptPDF)(number);
        return c.html(html);
    }
    catch (error) {
        console.error('Error generating receipt PDF:', error);
        return c.json({ error: 'Receipt not found' }, 404);
    }
};
exports.getReceiptPDF = getReceiptPDF;
