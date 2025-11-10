"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const carwashController_1 = require("../controllers/carwashController");
const carwashRoutes = new hono_1.Hono();
carwashRoutes.get('/services', carwashController_1.getServices); // List available wash services
carwashRoutes.post('/services', carwashController_1.createService); // Add new wash service
carwashRoutes.post('/record', carwashController_1.recordWash); // Record a carwash transaction
carwashRoutes.get('/history', carwashController_1.getWashHistory); // Get wash history
carwashRoutes.get('/customers', carwashController_1.getCustomers); // List customers
carwashRoutes.post('/customers', carwashController_1.createCustomer); // Create new customer
carwashRoutes.put('/services/:id', carwashController_1.updateService); // Update service
carwashRoutes.delete('/services/:id', carwashController_1.deleteService); // Delete service
carwashRoutes.get('/reports', carwashController_1.getReports); // Get analytics reports
carwashRoutes.get('/inventory', carwashController_1.getInventory); // List inventory items
carwashRoutes.post('/inventory', carwashController_1.addInventoryItem); // Add inventory item
carwashRoutes.put('/inventory/:id', carwashController_1.updateInventory); // Update inventory
carwashRoutes.delete('/inventory/:id', carwashController_1.deleteInventory); // Delete inventory item
carwashRoutes.post('/inventory/:id/usage', carwashController_1.recordInventoryUsage); // Record usage
carwashRoutes.get('/promos', carwashController_1.getPromoCodes); // List promo codes
carwashRoutes.post('/promos', carwashController_1.createPromoCode); // Create promo code
carwashRoutes.put('/promos/:id', carwashController_1.updatePromoCode); // Update promo code
carwashRoutes.delete('/promos/:id', carwashController_1.deletePromoCode); // Delete promo code
carwashRoutes.post('/promos/validate', carwashController_1.validatePromoCode); // Validate promo code
carwashRoutes.get('/staff', carwashController_1.getStaff); // List staff
carwashRoutes.post('/staff', carwashController_1.createStaff); // Create staff
carwashRoutes.put('/staff/:id', carwashController_1.updateStaff); // Update staff
carwashRoutes.post('/staff/login', carwashController_1.staffLogin); // Staff login
carwashRoutes.post('/staff/shift', carwashController_1.startShift); // Start shift
carwashRoutes.put('/staff/shift/:id/end', carwashController_1.endShift); // End shift
carwashRoutes.get('/settings', carwashController_1.getBusinessSettings); // Get business settings
carwashRoutes.put('/settings', carwashController_1.updateBusinessSettings); // Update settings
carwashRoutes.get('/receipts/:number', carwashController_1.getReceipt); // Get receipt by number
carwashRoutes.get('/receipts/:number/pdf', carwashController_1.getReceiptPDF); // Get receipt PDF
carwashRoutes.post('/receipts/:number/email', carwashController_1.emailReceipt); // Email receipt
exports.default = carwashRoutes;
