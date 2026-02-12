import API from "./api";

export const getMyLoans = async () => {
  const response = await API.get("/loans/my-loans");
  return response.data;
};

export const renewLoan = async (loanId) => {
  const response = await API.patch(`/loans/${loanId}/renew`);
  return response.data;
};

export const returnBook = async (loanId) => {
  const response = await API.patch(`/loans/${loanId}/return`);
  return response.data;
};

export const issueBook = async (issueData) => {
  const response = await API.post("/loans/issue", issueData);
  return response.data;
};

// Get all loans for librarian
export const getAllLoans = async () => {
  const response = await API.get("/loans/all-loans");
  return response.data;
};
