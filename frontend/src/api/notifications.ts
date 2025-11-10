import api from './client';
export async function listNotifications(userId:number){ return (await api.get('/notifications',{ params:{ userId }})).data; }
export async function markRead(id:number){ return (await api.post(`/notifications/mark-read/${id}`)).data; }