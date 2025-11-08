import api from './client';

export async function createOrder(payload: any) {
  const res = await api.post('/orders/create', payload);
  return res.data;
}

export async function getOrderHistory(buyerId: number) {
  const res = await api.get('/orders/history', { params: { buyerId } });
  return res.data;
}