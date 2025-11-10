import { Context } from 'hono';
import {
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

export const getServices = async (c: Context) => c.json(await fetchServices());
export const createService = async (c: Context) => {
  const body = await c.req.json();
  return c.json(await addService(body), 201);
};
export const recordWash = async (c: Context) => {
  const body = await c.req.json();
  return c.json(await saveWash(body), 201);
};
export const getWashHistory = async (c: Context) => c.json(await fetchWashHistory());
export const getCustomers = async (c: Context) => c.json(await fetchCustomers());
export const createCustomer = async (c: Context) => {
  const body = await c.req.json();
  return c.json(await addCustomer(body), 201);
};
export const updateService = async (c: Context) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  return c.json(await modifyService(id, body));
};
export const deleteService = async (c: Context) => {
  const id = c.req.param('id');
  await removeService(id);
  return new Response(null, { status: 204 });
};
export const getReports = async (c: Context) => c.json(await generateReports());

export const getInventory = async (c: Context) => c.json(await fetchInventory());
export const addInventoryItem = async (c: Context) => {
  const body = await c.req.json();
  return c.json(await addInventory(body), 201);
};
export const updateInventory = async (c: Context) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  return c.json(await modifyInventory(id, body));
};
export const deleteInventory = async (c: Context) => {
  const id = c.req.param('id');
  await removeInventory(id);
  return new Response(null, { status: 204 });
};
export const recordInventoryUsage = async (c: Context) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  return c.json(await addInventoryUsage(id, body), 201);
};

export const getPromoCodes = async (c: Context) => c.json(await fetchPromoCodes());
export const createPromoCode = async (c: Context) => {
  const body = await c.req.json();
  return c.json(await addPromoCode(body), 201);
};
export const updatePromoCode = async (c: Context) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  return c.json(await modifyPromoCode(id, body));
};
export const deletePromoCode = async (c: Context) => {
  const id = c.req.param('id');
  await removePromoCode(id);
  return new Response(null, { status: 204 });
};
export const validatePromoCode = async (c: Context) => {
  const body = await c.req.json();
  return c.json(await checkPromoCode(body.code));
};

export const getStaff = async (c: Context) => c.json(await fetchStaff());
export const createStaff = async (c: Context) => {
  const body = await c.req.json();
  return c.json(await addStaff(body), 201);
};
export const updateStaff = async (c: Context) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  return c.json(await modifyStaff(id, body));
};
export const staffLogin = async (c: Context) => {
  const body = await c.req.json();
  return c.json(await authenticateStaff(body));
};
export const startShift = async (c: Context) => {
  const body = await c.req.json();
  return c.json(await beginShift(body), 201);
};
export const endShift = async (c: Context) => {
  const id = c.req.param('id');
  return c.json(await finishShift(id));
};

export const getBusinessSettings = async (c: Context) => c.json(await fetchBusinessSettings());
export const updateBusinessSettings = async (c: Context) => {
  const body = await c.req.json();
  return c.json(await modifyBusinessSettings(body));
};

export const getReceipt = async (c: Context) => {
  const number = c.req.param('number');
  return c.json(await fetchReceipt(number));
};
export const emailReceipt = async (c: Context) => {
  const number = c.req.param('number');
  const body = await c.req.json();
  return c.json(await sendReceiptEmail(number, body.email));
};

export const getReceiptPDF = async (c: Context) => {
  const number = c.req.param('number');
  const html = await generateReceiptPDF(number);
  return c.html(html);
};