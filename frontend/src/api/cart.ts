import axios from "axios";
export const API_URL = "http://localhost:8082/api/cart";

export const getCartGroupedBySeller = async (userId: number) => {
  const res = await axios.get(`${API_URL}/user/${userId}/grouped`);
  return res.data;
};

export const addToCart = async (userId: number, bookId: number) => {
  const res = await axios.post(`${API_URL}/add`, { userId, bookId });
  return res.data;
};

export const removeCartItem = async (cartId: number) => {
  await axios.delete(`${API_URL}/${cartId}`);
};

export const getUserCart = async (userId: number) => {
  const res = await axios.get(`${API_URL}/user/${userId}`);
  return res.data;
};