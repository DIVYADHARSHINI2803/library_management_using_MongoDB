import API from "./api";

export const reserveBook = async (bookId) => {
  const response = await API.post("/reservations", { bookId });
  return response.data;
};

export const getMyReservations = async () => {
  const response = await API.get("/reservations/my-reservations");
  return response.data;
};

export const cancelReservation = async (reservationId) => {
  const response = await API.delete(`/reservations/${reservationId}`);
  return response.data;
};
