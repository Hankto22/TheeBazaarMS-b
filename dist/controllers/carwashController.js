"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceiptPDF = exports.emailReceipt = exports.getReceipt = exports.updateBusinessSettings = exports.getBusinessSettings = exports.endShift = exports.startShift = exports.staffLogin = exports.updateStaff = exports.createStaff = exports.getStaff = exports.validatePromoCode = exports.deletePromoCode = exports.updatePromoCode = exports.createPromoCode = exports.getPromoCodes = exports.recordInventoryUsage = exports.deleteInventory = exports.updateInventory = exports.addInventoryItem = exports.getInventory = exports.getReports = exports.deleteService = exports.updateService = exports.createCustomer = exports.getCustomers = exports.getWashHistory = exports.recordWash = exports.createService = exports.getServices = void 0;
const carwashService_1 = require("../services/carwashService");
const getServices = async (c) => c.json(await (0, carwashService_1.fetchServices)());
exports.getServices = getServices;
const createService = async (c) => {
    const body = await c.req.json();
    return c.json(await (0, carwashService_1.addService)(body), 201);
};
exports.createService = createService;
const recordWash = async (c) => {
    const body = await c.req.json();
    return c.json(await (0, carwashService_1.saveWash)(body), 201);
};
exports.recordWash = recordWash;
const getWashHistory = async (c) => c.json(await (0, carwashService_1.fetchWashHistory)());
exports.getWashHistory = getWashHistory;
const getCustomers = async (c) => c.json(await (0, carwashService_1.fetchCustomers)());
exports.getCustomers = getCustomers;
const createCustomer = async (c) => {
    const body = await c.req.json();
    return c.json(await (0, carwashService_1.addCustomer)(body), 201);
};
exports.createCustomer = createCustomer;
const updateService = async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    return c.json(await (0, carwashService_1.modifyService)(id, body));
};
exports.updateService = updateService;
const deleteService = async (c) => {
    const id = c.req.param('id');
    await (0, carwashService_1.removeService)(id);
    return new Response(null, { status: 204 });
};
exports.deleteService = deleteService;
const getReports = async (c) => c.json(await (0, carwashService_1.generateReports)());
exports.getReports = getReports;
const getInventory = async (c) => c.json(await (0, carwashService_1.fetchInventory)());
exports.getInventory = getInventory;
const addInventoryItem = async (c) => {
    const body = await c.req.json();
    return c.json(await (0, carwashService_1.addInventory)(body), 201);
};
exports.addInventoryItem = addInventoryItem;
const updateInventory = async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    return c.json(await (0, carwashService_1.modifyInventory)(id, body));
};
exports.updateInventory = updateInventory;
const deleteInventory = async (c) => {
    const id = c.req.param('id');
    await (0, carwashService_1.removeInventory)(id);
    return new Response(null, { status: 204 });
};
exports.deleteInventory = deleteInventory;
const recordInventoryUsage = async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    return c.json(await (0, carwashService_1.addInventoryUsage)(id, body), 201);
};
exports.recordInventoryUsage = recordInventoryUsage;
const getPromoCodes = async (c) => c.json(await (0, carwashService_1.fetchPromoCodes)());
exports.getPromoCodes = getPromoCodes;
const createPromoCode = async (c) => {
    const body = await c.req.json();
    return c.json(await (0, carwashService_1.addPromoCode)(body), 201);
};
exports.createPromoCode = createPromoCode;
const updatePromoCode = async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    return c.json(await (0, carwashService_1.modifyPromoCode)(id, body));
};
exports.updatePromoCode = updatePromoCode;
const deletePromoCode = async (c) => {
    const id = c.req.param('id');
    await (0, carwashService_1.removePromoCode)(id);
    return new Response(null, { status: 204 });
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
    const body = await c.req.json();
    return c.json(await (0, carwashService_1.addStaff)(body), 201);
};
exports.createStaff = createStaff;
const updateStaff = async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    return c.json(await (0, carwashService_1.modifyStaff)(id, body));
};
exports.updateStaff = updateStaff;
const staffLogin = async (c) => {
    const body = await c.req.json();
    return c.json(await (0, carwashService_1.authenticateStaff)(body));
};
exports.staffLogin = staffLogin;
const startShift = async (c) => {
    const body = await c.req.json();
    return c.json(await (0, carwashService_1.beginShift)(body), 201);
};
exports.startShift = startShift;
const endShift = async (c) => {
    const id = c.req.param('id');
    return c.json(await (0, carwashService_1.finishShift)(id));
};
exports.endShift = endShift;
const getBusinessSettings = async (c) => c.json(await (0, carwashService_1.fetchBusinessSettings)());
exports.getBusinessSettings = getBusinessSettings;
const updateBusinessSettings = async (c) => {
    const body = await c.req.json();
    return c.json(await (0, carwashService_1.modifyBusinessSettings)(body));
};
exports.updateBusinessSettings = updateBusinessSettings;
const getReceipt = async (c) => {
    const number = c.req.param('number');
    return c.json(await (0, carwashService_1.fetchReceipt)(number));
};
exports.getReceipt = getReceipt;
const emailReceipt = async (c) => {
    const number = c.req.param('number');
    const body = await c.req.json();
    return c.json(await (0, carwashService_1.sendReceiptEmail)(number, body.email));
};
exports.emailReceipt = emailReceipt;
const getReceiptPDF = async (c) => {
    const number = c.req.param('number');
    const html = await (0, carwashService_1.generateReceiptPDF)(number);
    return c.html(html);
};
exports.getReceiptPDF = getReceiptPDF;
