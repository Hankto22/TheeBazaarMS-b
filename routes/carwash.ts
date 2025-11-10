import { Hono } from 'hono';
import {
  getServices,
  createService,
  recordWash,
  getWashHistory,
  getCustomers,
  createCustomer,
  updateService,
  deleteService,
  getReports,
  getInventory,
  addInventoryItem,
  updateInventory,
  deleteInventory,
  recordInventoryUsage,
  getPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  validatePromoCode,
  getStaff,
  createStaff,
  updateStaff,
  staffLogin,
  startShift,
  endShift,
  getBusinessSettings,
  updateBusinessSettings,
  getReceipt,
  getReceiptPDF,
  emailReceipt,
} from '../controllers/carwashController';

const carwashRoutes = new Hono();

carwashRoutes.get('/services', getServices);         // List available wash services
carwashRoutes.post('/services', createService);      // Add new wash service
carwashRoutes.post('/record', recordWash);           // Record a carwash transaction
carwashRoutes.get('/history', getWashHistory);       // Get wash history
carwashRoutes.get('/customers', getCustomers);       // List customers
carwashRoutes.post('/customers', createCustomer);    // Create new customer
carwashRoutes.put('/services/:id', updateService);   // Update service
carwashRoutes.delete('/services/:id', deleteService); // Delete service
carwashRoutes.get('/reports', getReports);           // Get analytics reports
carwashRoutes.get('/inventory', getInventory);       // List inventory items
carwashRoutes.post('/inventory', addInventoryItem);  // Add inventory item
carwashRoutes.put('/inventory/:id', updateInventory); // Update inventory
carwashRoutes.delete('/inventory/:id', deleteInventory); // Delete inventory item
carwashRoutes.post('/inventory/:id/usage', recordInventoryUsage); // Record usage
carwashRoutes.get('/promos', getPromoCodes);         // List promo codes
carwashRoutes.post('/promos', createPromoCode);      // Create promo code
carwashRoutes.put('/promos/:id', updatePromoCode);   // Update promo code
carwashRoutes.delete('/promos/:id', deletePromoCode); // Delete promo code
carwashRoutes.post('/promos/validate', validatePromoCode); // Validate promo code
carwashRoutes.get('/staff', getStaff);               // List staff
carwashRoutes.post('/staff', createStaff);           // Create staff
carwashRoutes.put('/staff/:id', updateStaff);        // Update staff
carwashRoutes.post('/staff/login', staffLogin);      // Staff login
carwashRoutes.post('/staff/shift', startShift);      // Start shift
carwashRoutes.put('/staff/shift/:id/end', endShift); // End shift
carwashRoutes.get('/settings', getBusinessSettings); // Get business settings
carwashRoutes.put('/settings', updateBusinessSettings); // Update settings
carwashRoutes.get('/receipts/:number', getReceipt);  // Get receipt by number
carwashRoutes.get('/receipts/:number/pdf', getReceiptPDF); // Get receipt PDF
carwashRoutes.post('/receipts/:number/email', emailReceipt); // Email receipt

export default carwashRoutes;