"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const carwashController_1 = require("../controllers/carwashController");
const hono_1 = require("hono");
const carwashController_2 = require("../controllers/carwashController");
const carwashRoutes = new hono_1.Hono();
carwashRoutes.get('/', carwashController_1.getDashboard); // Get dashboard data
carwashRoutes.get('/services', carwashController_2.getServices); // List available wash services
carwashRoutes.post('/services', carwashController_2.createService); // Add new wash service
carwashRoutes.post('/record', carwashController_2.recordWash); // Record a carwash transaction
carwashRoutes.get('/history', carwashController_2.getWashHistory); // Get wash history
carwashRoutes.get('/customers', carwashController_2.getCustomers); // List customers
carwashRoutes.post('/customers', carwashController_2.createCustomer); // Create new customer
carwashRoutes.put('/services/:id', carwashController_2.updateService); // Update service
carwashRoutes.delete('/services/:id', carwashController_2.deleteService); // Delete service
carwashRoutes.get('/reports', carwashController_2.getReports); // Get analytics reports
carwashRoutes.get('/inventory', carwashController_2.getInventory); // List inventory items
carwashRoutes.post('/inventory', carwashController_2.addInventoryItem); // Add inventory item
carwashRoutes.put('/inventory/:id', carwashController_2.updateInventory); // Update inventory
carwashRoutes.delete('/inventory/:id', carwashController_2.deleteInventory); // Delete inventory item
carwashRoutes.post('/inventory/:id/usage', carwashController_2.recordInventoryUsage); // Record usage
carwashRoutes.get('/promos', carwashController_2.getPromoCodes); // List promo codes
carwashRoutes.post('/promos', carwashController_2.createPromoCode); // Create promo code
carwashRoutes.put('/promos/:id', carwashController_2.updatePromoCode); // Update promo code
carwashRoutes.delete('/promos/:id', carwashController_2.deletePromoCode); // Delete promo code
carwashRoutes.post('/promos/validate', carwashController_2.validatePromoCode); // Validate promo code
carwashRoutes.get('/staff', carwashController_2.getStaff); // List staff
carwashRoutes.post('/staff', carwashController_2.createStaff); // Create staff
carwashRoutes.put('/staff/:id', carwashController_2.updateStaff); // Update staff
carwashRoutes.post('/staff/login', carwashController_2.staffLogin); // Staff login
carwashRoutes.post('/staff/shift', carwashController_2.startShift); // Start shift
carwashRoutes.put('/staff/shift/:id/end', carwashController_2.endShift); // End shift
carwashRoutes.get('/settings', carwashController_2.getBusinessSettings); // Get business settings
carwashRoutes.put('/settings', carwashController_2.updateBusinessSettings); // Update settings
carwashRoutes.get('/receipts/:number', carwashController_2.getReceipt); // Get receipt by number
carwashRoutes.get('/receipts/:number/pdf', carwashController_2.getReceiptPDF); // Get receipt PDF
carwashRoutes.post('/receipts/:number/email', carwashController_2.emailReceipt); // Email receipt
exports.default = carwashRoutes;
