import api from './client';

export async function addToCart(userId: number, bookId: number, qty = 1) {
  const res = await api.post('/cart/add', { userId, bookId, qty });
  return res.data;
}

export async function getCart(userId: number) {
  const res = await api.get('/cart', { params: { userId } });
  return res.data;
}

export async function removeCartItem(itemId: number) {
  return (await api.post('/cart/remove', { itemId })).data;
}