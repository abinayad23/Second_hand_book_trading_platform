import api from './client';

export async function listBooks(category?: string) {
  const res = await api.get('/books', { params: category ? { category } : {} });
  return res.data;
}

export async function getBook(id: number) {
  const res = await api.get(`/books/${id}`);
  return res.data;
}

export async function createBook(payload: any) {
  const res = await api.post('/books', payload);
  return res.data;
}

export async function uploadBookImages(bookId: number, files: File[]) {
  const form = new FormData();
  files.forEach(f => form.append('files', f));
  const res = await api.post(`/books/${bookId}/images`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
}