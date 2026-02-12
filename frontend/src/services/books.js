import API from "./api";

export const getBooks = async () => {
  const response = await API.get("/books");
  return response.data;
};

export const searchBooks = async (query) => {
  const response = await API.get(`/books/search?query=${query}`);
  return response.data;
};

export const addBook = async (bookData) => {
  const response = await API.post("/books", bookData);
  return response.data;
};

export const updateBook = async (id, bookData) => {
  const response = await API.patch(`/books/${id}`, bookData);
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await API.delete(`/books/${id}`);
  return response.data;
};
