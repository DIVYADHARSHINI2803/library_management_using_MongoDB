// import React, { useState, useEffect } from "react";
// import { getBooks, searchBooks } from "../services/books";
// // import { getMyLoans, renewLoan } from "../services/loans";
// import { reserveBook } from "../services/reservations";

// const StudentDashboard = () => {
//   const [books, setBooks] = useState([]);
//   const [loans, setLoans] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     loadBooks();
//     loadMyLoans();
//   }, []);

//   const loadBooks = async () => {
//     try {
//       const response = await getBooks();
//       setBooks(response.data.books);
//     } catch (error) {
//       console.error("Error loading books:", error);
//     }
//   };

//   const loadMyLoans = async () => {
//     try {
//       const response = await getMyLoans();
//       setLoans(response.data.loans);
//     } catch (error) {
//       console.error("Error loading loans:", error);
//     }
//   };

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await searchBooks(searchQuery);
//       setBooks(response.data.books);
//     } catch (error) {
//       console.error("Error searching books:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRenew = async (loanId) => {
//     try {
//       await renewLoan(loanId);
//       setMessage("Book renewed successfully!");
//       loadMyLoans();
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Renewal failed");
//     }
//   };

//   const handleReserve = async (bookId) => {
//     try {
//       await reserveBook(bookId);
//       setMessage(
//         "Book reserved successfully! We will notify you when available."
//       );
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Reservation failed");
//     }
//   };

//   return (
//     <div className="dashboard">
//       <h1>Student Dashboard</h1>

//       {message && (
//         <div
//           className={`message ${
//             message.includes("success") ? "success" : "error"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       {/* Search Section */}
//       <div className="search-section">
//         <form onSubmit={handleSearch}>
//           <input
//             type="text"
//             placeholder="Search books by title, author, or genre..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <button type="submit" disabled={loading}>
//             {loading ? "Searching..." : "Search"}
//           </button>
//         </form>
//       </div>

//       {/* My Loans Section */}
//       <div className="loans-section">
//         <h2>My Borrowed Books</h2>
//         {loans.length === 0 ? (
//           <p>No books borrowed</p>
//         ) : (
//           <div className="loans-grid">
//             {loans.map((loan) => (
//               <div key={loan._id} className="loan-card">
//                 <h3>{loan.bookId.title}</h3>
//                 <p>Author: {loan.bookId.author}</p>
//                 <p>Due Date: {new Date(loan.dueDate).toLocaleDateString()}</p>
//                 <p>Status: {loan.status}</p>
//                 {loan.fineAmount > 0 && (
//                   <p className="fine">Fine: ₹{loan.fineAmount}</p>
//                 )}
//                 {loan.status === "active" && !loan.renewalUsed && (
//                   <button onClick={() => handleRenew(loan._id)}>
//                     Renew Book
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Books Section */}
//       <div className="books-section">
//         <h2>Available Books</h2>
//         <div className="books-grid">
//           {books.map((book) => (
//             <div key={book._id} className="book-card">
//               <h3>{book.title}</h3>
//               <p>Author: {book.author}</p>
//               <p>Genre: {book.genre}</p>
//               <p>
//                 Available: {book.availableCopies}/{book.totalCopies}
//               </p>
//               {book.availableCopies > 0 ? (
//                 <button className="available">Available for Issue</button>
//               ) : (
//                 <button
//                   onClick={() => handleReserve(book._id)}
//                   className="reserve"
//                 >
//                   Reserve Book
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;
import React, { useState, useEffect } from "react";
import { getBooks, searchBooks } from "../services/books";
import { getMyLoans, renewLoan } from "../services/loans";
import { reserveBook } from "../services/reservations";

const StudentDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("books"); // 'books' or 'loans'

  useEffect(() => {
    loadBooks();
    loadMyLoans();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response.data.books);
    } catch (error) {
      showMessage("Error loading books", "error");
    }
  };

  const loadMyLoans = async () => {
    try {
      console.log("Loading my loans...");
      const response = await getMyLoans();
      console.log("Loans response:", response);
      setLoans(response.data.loans);

      if (response.data.loans.length === 0) {
        console.log("No loans found for this user");
      } else {
        console.log("Found loans:", response.data.loans);
      }
    } catch (error) {
      console.error("Error loading loans:", error);
      showMessage("Error loading your borrowed books", "error");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await searchBooks(searchQuery);
      setBooks(response.data.books);
    } catch (error) {
      showMessage("Error searching books", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (loanId) => {
    try {
      await renewLoan(loanId);
      showMessage("Book renewed successfully!");
      loadMyLoans();
    } catch (error) {
      showMessage(error.response?.data?.message || "Renewal failed", "error");
    }
  };

  const handleReserve = async (bookId) => {
    try {
      await reserveBook(bookId);
      showMessage(
        "Book reserved successfully! We will notify you when available."
      );
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Reservation failed",
        "error"
      );
    }
  };

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  };

  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="dashboard">
      <h1>Student Dashboard</h1>

      {message && (
        <div
          className={`message ${
            message.includes("success") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      {/* Stats Section */}
      <div className="stats">
        <div className="stat-card">
          <h4>Books Borrowed</h4>
          <p>{loans.filter((loan) => loan.status === "active").length}</p>
        </div>
        <div className="stat-card">
          <h4>Books Available</h4>
          <p>{books.filter((book) => book.availableCopies > 0).length}</p>
        </div>
        <div className="stat-card">
          <h4>Total Books</h4>
          <p>{books.length}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "books" ? "active" : ""}`}
          onClick={() => setActiveTab("books")}
        >
          📚 Browse Books
        </button>
        <button
          className={`tab ${activeTab === "loans" ? "active" : ""}`}
          onClick={() => setActiveTab("loans")}
        >
          📖 My Borrowed Books (
          {loans.filter((loan) => loan.status === "active").length})
        </button>
      </div>

      {/* Books Tab */}
      {activeTab === "books" && (
        <>
          {/* Search Section */}
          <div className="search-section">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search books by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </form>
          </div>

          {/* Books Section */}
          <div className="books-section">
            <h2>Available Books ({books.length})</h2>
            <div className="books-grid">
              {books.map((book) => (
                <div key={book._id} className="book-card">
                  <h3>{book.title}</h3>
                  <p>
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p>
                    <strong>Genre:</strong> {book.genre}
                  </p>
                  <p>
                    <strong>Available:</strong> {book.availableCopies}/
                    {book.totalCopies}
                  </p>
                  {book.availableCopies > 0 ? (
                    <button className="available-btn">
                      Available for Issue
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReserve(book._id)}
                      className="reserve-btn"
                    >
                      Reserve Book
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Loans Tab */}
      {activeTab === "loans" && (
        <div className="loans-section">
          <h2>My Borrowed Books</h2>
          {loans.length === 0 ? (
            <div className="no-books">
              <p>You haven't borrowed any books yet.</p>
              <p>
                Visit the "Browse Books" tab to find books you'd like to borrow.
              </p>
            </div>
          ) : (
            <div className="loans-grid">
              {loans.map((loan) => (
                <div key={loan._id} className="loan-card">
                  <div className="loan-header">
                    <h3>{loan.bookId?.title || "Unknown Book"}</h3>
                    <span className={`status ${loan.status}`}>
                      {loan.status}
                    </span>
                  </div>
                  <p>
                    <strong>Author:</strong>{" "}
                    {loan.bookId?.author || "Unknown Author"}
                  </p>
                  <p>
                    <strong>Issued Date:</strong>{" "}
                    {new Date(loan.issueDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Due Date:</strong>{" "}
                    {new Date(loan.dueDate).toLocaleDateString()}
                  </p>

                  {loan.status === "active" && (
                    <>
                      <p className="days-remaining">
                        <strong>Days Remaining:</strong>{" "}
                        {calculateDaysRemaining(loan.dueDate)} days
                      </p>
                      {!loan.renewalUsed && (
                        <button
                          onClick={() => handleRenew(loan._id)}
                          className="renew-btn"
                        >
                          Renew Book
                        </button>
                      )}
                      {loan.renewalUsed && (
                        <p className="renewal-used">Renewal already used</p>
                      )}
                    </>
                  )}

                  {loan.status === "overdue" && (
                    <p className="fine-amount">
                      <strong>Fine Amount:</strong> ₹{loan.fineAmount || 0}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
