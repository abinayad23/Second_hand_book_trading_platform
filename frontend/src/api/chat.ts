import api from './client';
export async function createThread(bookId:number,buyerId:number,sellerId:number){
  const res = await api.post('/chat/threads',{bookId,buyerId,sellerId});
  return res.data;
}
export async function getMessages(threadId:number){ return (await api.get(`/chat/threads/${threadId}/messages`)).data; }