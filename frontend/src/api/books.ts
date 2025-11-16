import API from "./api";
import { Book } from "@/types";

export const booksApi = {
  getAllBooks: async (): Promise<Book[]> => {
    const response = await API.get<Book[]>("/books");
    return response.data;
  },

  getBookById: async (id: number): Promise<Book> => {
    const response = await API.get<Book>(`/books/${id}`);
    return response.data;
  },

  searchBooks: async (query: string): Promise<Book[]> => {
    const response = await API.get<Book[]>(`/books/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  addBook: async (book: Partial<Book>): Promise<Book> => {
    const response = await API.post<Book>("/books", book);
    return response.data;
  },

  updateBook: async (id: number, book: Partial<Book>): Promise<Book> => {
    const response = await API.put<Book>(`/books/${id}`, book);
    return response.data;
  },

  deleteBook: async (id: number): Promise<void> => {
    await API.delete(`/books/${id}`);
  },

  getBooksByUser: async (userId: number): Promise<Book[]> => {
    const response = await API.get<Book[]>(`/books`);
    const allBooks = response.data;
    return allBooks.filter((book) => book.owner?.id === userId);
  },
};

