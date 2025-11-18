import { Context } from 'hono';
import {
  fetchDashboardData,
  fetchServices,
  addService,
  saveWash,
  fetchWashHistory,
  fetchCustomers,
  addCustomer,
  generateReports,
  fetchInventory,
  addInventory,
  modifyInventory,
  removeInventory,
  addInventoryUsage,
  fetchPromoCodes,
  addPromoCode,
  modifyPromoCode,
  removePromoCode,
  checkPromoCode,
  fetchStaff,
  addStaff,
  modifyStaff,
  authenticateStaff,
  beginShift,
  finishShift,
  fetchBusinessSettings,
  modifyBusinessSettings,
  fetchReceipt,
  sendReceiptEmail,
  generateReceiptPDF,
  modifyService,
  removeService,
} from '../services/carwashService';
export const getDashboard = async (c: Context) => c.json(await fetchDashboardData());

export const getServices = async (c: Context) => c.json(await fetchServices());
export const createService = async (c: Context) => {
  try {
    const body = await c.req.json();
    return c.json(await addService(body), 201);
  } catch (error) {
    console.error('Error creating service:', error);
    return c.json({ error: 'Failed to create service' }, 500);
  }
};
export const recordWash = async (c: Context) => {
  try {
    const body = await c.req.json();
    return c.json(await saveWash(body), 201);
  } catch (error) {
    console.error('Error recording wash:', error);
    return c.json({ error: 'Failed to record wash transaction' }, 500);
  }
};
export const getWashHistory = async (c: Context) => c.json(await fetchWashHistory());
export const getCustomers = async (c: Context) => c.json(await fetchCustomers());
export const createCustomer = async (c: Context) => {
  try {
    const body = await c.req.json();
    return c.json(await addCustomer(body), 201);
  } catch (error) {
    console.error('Error creating customer:', error);
    return c.json({ error: 'Failed to create customer' }, 500);
  }
};
export const updateService = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    return c.json(await modifyService(id, body));
  } catch (error) {
    console.error('Error updating service:', error);
    return c.json({ error: 'Failed to update service' }, 500);
  }
};
export const deleteService = async (c: Context) => {
  try {
    const id = c.req.param('id');
    await removeService(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting service:', error);
    return c.json({ error: 'Failed to delete service' }, 500);
  }
};
export const getReports = async (c: Context) => {
  try {
    return c.json(await generateReports());
  } catch (error) {
    console.error('Error generating reports:', error);
    return c.json({ error: 'Failed to generate reports' }, 500);
  }
};

export const getInventory = async (c: Context) => c.json(await fetchInventory());
export const addInventoryItem = async (c: Context) => {
  try {
    const body = await c.req.json();
    return c.json(await addInventory(body), 201);
  } catch (error) {
    console.error('Error adding inventory item:', error);
    return c.json({ error: 'Failed to add inventory item' }, 500);
  }
};
export const updateInventory = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    return c.json(await modifyInventory(id, body));
  } catch (error) {
    console.error('Error updating inventory:', error);
    return c.json({ error: 'Failed to update inventory' }, 500);
  }
};
export const deleteInventory = async (c: Context) => {
  try {
    const id = c.req.param('id');
    await removeInventory(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting inventory:', error);
    return c.json({ error: 'Failed to delete inventory' }, 500);
  }
};
export const recordInventoryUsage = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    return c.json(await addInventoryUsage(id, body), 201);
  } catch (error) {
    console.error('Error recording inventory usage:', error);
    return c.json({ error: 'Failed to record inventory usage' }, 500);
  }
};

export const getPromoCodes = async (c: Context) => c.json(await fetchPromoCodes());
export const createPromoCode = async (c: Context) => {
  try {
    const body = await c.req.json();
    return c.json(await addPromoCode(body), 201);
  } catch (error) {
    console.error('Error creating promo code:', error);
    return c.json({ error: 'Failed to create promo code' }, 500);
  }
};
export const updatePromoCode = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    return c.json(await modifyPromoCode(id, body));
  } catch (error) {
    console.error('Error updating promo code:', error);
    return c.json({ error: 'Failed to update promo code' }, 500);
  }
};
export const deletePromoCode = async (c: Context) => {
  try {
    const id = c.req.param('id');
    await removePromoCode(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting promo code:', error);
    return c.json({ error: 'Failed to delete promo code' }, 500);
  }
};
export const validatePromoCode = async (c: Context) => {
  const body = await c.req.json();
  return c.json(await checkPromoCode(body.code));
};

export const getStaff = async (c: Context) => c.json(await fetchStaff());
export const createStaff = async (c: Context) => {
  try {
    const body = await c.req.json();
    return c.json(await addStaff(body), 201);
  } catch (error) {
    console.error('Error creating staff:', error);
    return c.json({ error: 'Failed to create staff' }, 500);
  }
};
export const updateStaff = async (c: Context) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    return c.json(await modifyStaff(id, body));
  } catch (error) {
    console.error('Error updating staff:', error);
    return c.json({ error: 'Failed to update staff' }, 500);
  }
};
export const staffLogin = async (c: Context) => {
  try {
    const body = await c.req.json();
    return c.json(await authenticateStaff(body));
  } catch (error) {
    console.error('Error authenticating staff:', error);
    return c.json({ error: 'Failed to authenticate' }, 500);
  }
};
export const startShift = async (c: Context) => {
  try {
    const body = await c.req.json();
    return c.json(await beginShift(body), 201);
  } catch (error) {
    console.error('Error starting shift:', error);
    return c.json({ error: 'Failed to start shift' }, 500);
  }
};
export const endShift = async (c: Context) => {
  try {
    const id = c.req.param('id');
    return c.json(await finishShift(id));
  } catch (error) {
    console.error('Error ending shift:', error);
    return c.json({ error: 'Failed to end shift' }, 500);
  }
};

export const getBusinessSettings = async (c: Context) => c.json(await fetchBusinessSettings());
export const updateBusinessSettings = async (c: Context) => {
  try {
    const body = await c.req.json();
    return c.json(await modifyBusinessSettings(body));
  } catch (error) {
    console.error('Error updating business settings:', error);
    return c.json({ error: 'Failed to update business settings' }, 500);
  }
};

export const getReceipt = async (c: Context) => {
  try {
    const number = c.req.param('number');
    const receipt = await fetchReceipt(number);
    if (!receipt) {
      return c.json({ error: 'Receipt not found' }, 404);
    }
    return c.json(receipt);
  } catch (error) {
    console.error('Error fetching receipt:', error);
    return c.json({ error: 'Failed to fetch receipt' }, 500);
  }
};
export const emailReceipt = async (c: Context) => {
  try {
    const number = c.req.param('number');
    const body = await c.req.json();
    return c.json(await sendReceiptEmail(number, body.email));
  } catch (error) {
    console.error('Error emailing receipt:', error);
    return c.json({ error: 'Failed to email receipt' }, 500);
  }
};

export const getReceiptPDF = async (c: Context) => {
  try {
    const number = c.req.param('number');
    const html = await generateReceiptPDF(number);
    return c.html(html);
  } catch (error) {
    console.error('Error generating receipt PDF:', error);
    return c.json({ error: 'Receipt not found' }, 404);
  }
};