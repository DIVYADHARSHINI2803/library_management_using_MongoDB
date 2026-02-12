// import React, { useState, useEffect } from "react";
// import { getBooks, addBook, deleteBook } from "../services/books";
// // import { issueBook, returnBook } from "../services/loans";

// const LibrarianDashboard = () => {
//   const [books, setBooks] = useState([]);
//   const [showAddBook, setShowAddBook] = useState(false);
//   const [issueData, setIssueData] = useState({
//     studentEmail: "",
//     bookId: "",
//   });
//   const [newBook, setNewBook] = useState({
//     title: "",
//     author: "",
//     isbn: "",
//     genre: "",
//     totalCopies: 5,
//   });
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     loadBooks();
//   }, []);

//   const loadBooks = async () => {
//     try {
//       const response = await getBooks();
//       setBooks(response.data.books);
//     } catch (error) {
//       console.error("Error loading books:", error);
//     }
//   };

//   const handleAddBook = async (e) => {
//     e.preventDefault();
//     try {
//       await addBook(newBook);
//       setMessage("Book added successfully!");
//       setShowAddBook(false);
//       setNewBook({
//         title: "",
//         author: "",
//         isbn: "",
//         genre: "",
//         totalCopies: 5,
//       });
//       loadBooks();
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Failed to add book");
//     }
//   };

//   const handleDeleteBook = async (bookId) => {
//     if (window.confirm("Are you sure you want to delete this book?")) {
//       try {
//         await deleteBook(bookId);
//         setMessage("Book deleted successfully!");
//         loadBooks();
//       } catch (error) {
//         setMessage(error.response?.data?.message || "Failed to delete book");
//       }
//     }
//   };

//   const handleIssueBook = async (e) => {
//     e.preventDefault();
//     try {
//       await issueBook(issueData);
//       setMessage("Book issued successfully!");
//       setIssueData({ studentEmail: "", bookId: "" });
//       loadBooks();
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Failed to issue book");
//     }
//   };

//   return (
//     <div className="dashboard">
//       <h1>Librarian Dashboard</h1>

//       {message && (
//         <div
//           className={`message ${
//             message.includes("success") ? "success" : "error"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       {/* Add Book Section */}
//       <div className="section">
//         <button onClick={() => setShowAddBook(!showAddBook)}>
//           {showAddBook ? "Cancel" : "Add New Book"}
//         </button>

//         {showAddBook && (
//           <form onSubmit={handleAddBook} className="add-book-form">
//             <h3>Add New Book</h3>
//             <input
//               type="text"
//               placeholder="Title"
//               value={newBook.title}
//               onChange={(e) =>
//                 setNewBook({ ...newBook, title: e.target.value })
//               }
//               required
//             />
//             <input
//               type="text"
//               placeholder="Author"
//               value={newBook.author}
//               onChange={(e) =>
//                 setNewBook({ ...newBook, author: e.target.value })
//               }
//               required
//             />
//             <input
//               type="text"
//               placeholder="ISBN"
//               value={newBook.isbn}
//               onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
//               required
//             />
//             <input
//               type="text"
//               placeholder="Genre"
//               value={newBook.genre}
//               onChange={(e) =>
//                 setNewBook({ ...newBook, genre: e.target.value })
//               }
//               required
//             />
//             <input
//               type="number"
//               placeholder="Total Copies"
//               value={newBook.totalCopies}
//               onChange={(e) =>
//                 setNewBook({ ...newBook, totalCopies: e.target.value })
//               }
//               required
//             />
//             <button type="submit">Add Book</button>
//           </form>
//         )}
//       </div>

//       {/* Issue Book Section */}
//       <div className="section">
//         <h3>Issue Book to Student</h3>
//         <form onSubmit={handleIssueBook}>
//           <input
//             type="email"
//             placeholder="Student Email"
//             value={issueData.studentEmail}
//             onChange={(e) =>
//               setIssueData({ ...issueData, studentEmail: e.target.value })
//             }
//             required
//           />
//           <select
//             value={issueData.bookId}
//             onChange={(e) =>
//               setIssueData({ ...issueData, bookId: e.target.value })
//             }
//             required
//           >
//             <option value="">Select Book</option>
//             {books
//               .filter((book) => book.availableCopies > 0)
//               .map((book) => (
//                 <option key={book._id} value={book._id}>
//                   {book.title} (Available: {book.availableCopies})
//                 </option>
//               ))}
//           </select>
//           <button type="submit">Issue Book</button>
//         </form>
//       </div>

//       {/* Books Management Section */}
//       <div className="section">
//         <h3>Book Management</h3>
//         <div className="books-grid">
//           {books.map((book) => (
//             <div key={book._id} className="book-card">
//               <h4>{book.title}</h4>
//               <p>Author: {book.author}</p>
//               <p>ISBN: {book.isbn}</p>
//               <p>Genre: {book.genre}</p>
//               <p>
//                 Available: {book.availableCopies}/{book.totalCopies}
//               </p>
//               <button
//                 onClick={() => handleDeleteBook(book._id)}
//                 className="delete-btn"
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LibrarianDashboard;

import React, { useState, useEffect } from "react";
import { getBooks, addBook, deleteBook } from "../services/books";
import { issueBook, getAllLoans, returnBook } from "../services/loans";

const LibrarianDashboard = () => {
  const [books, setBooks] = useState([]);
  const [allLoans, setAllLoans] = useState([]);
  const [showAddBook, setShowAddBook] = useState(false);
  const [showIssueBook, setShowIssueBook] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [issueData, setIssueData] = useState({
    studentEmail: "",
    bookId: "",
  });

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    totalCopies: 5,
  });

  useEffect(() => {
    loadBooks();
    loadAllLoans();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response.data.books);
    } catch (error) {
      showMessage("Error loading books", "error");
    }
  };

  const loadAllLoans = async () => {
    try {
      const response = await getAllLoans();
      setAllLoans(response.data.loans);
    } catch (error) {
      console.log("Error loading loans:", error);
    }
  };

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  const handleAddBook = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!newBook.title || !newBook.author || !newBook.isbn || !newBook.genre) {
      showMessage("Please fill in all fields", "error");
      return;
    }

    try {
      await addBook(newBook);
      showMessage("Book added successfully!");
      setShowAddBook(false);
      setNewBook({
        title: "",
        author: "",
        isbn: "",
        genre: "",
        totalCopies: 5,
      });
      loadBooks();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Failed to add book",
        "error"
      );
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(bookId);
        showMessage("Book deleted successfully!");
        loadBooks();
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Failed to delete book",
          "error"
        );
      }
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();

    if (!issueData.studentEmail || !issueData.bookId) {
      showMessage("Please fill in all fields", "error");
      return;
    }

    try {
      const response = await issueBook(issueData);
      showMessage(response.message || "Book issued successfully!");
      setShowIssueBook(false);
      setIssueData({ studentEmail: "", bookId: "" });
      loadBooks();
      loadAllLoans();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Failed to issue book",
        "error"
      );
    }
  };

  const handleReturnBook = async (loanId) => {
    try {
      await returnBook(loanId);
      showMessage("Book returned successfully!");
      loadBooks();
      loadAllLoans();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Failed to return book",
        "error"
      );
    }
  };

  return (
    <div className="dashboard">
      <h1>Librarian Dashboard</h1>

      {message && (
        <div
          className={`message ${
            messageType === "success" ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <button
          onClick={() => setShowAddBook(!showAddBook)}
          className="action-btn primary"
        >
          {showAddBook ? "Cancel" : "➕ Add New Book"}
        </button>
        <button
          onClick={() => setShowIssueBook(!showIssueBook)}
          className="action-btn secondary"
        >
          {showIssueBook ? "Cancel" : "📚 Issue Book to Student"}
        </button>
      </div>

      {/* Add Book Form */}
      {showAddBook && (
        <div className="section card">
          <h3>Add New Book to Library</h3>
          <form onSubmit={handleAddBook} className="add-book-form">
            <div className="form-row">
              <input
                type="text"
                placeholder="Book Title *"
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Author *"
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
                required
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="ISBN *"
                value={newBook.isbn}
                onChange={(e) =>
                  setNewBook({ ...newBook, isbn: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Genre *"
                value={newBook.genre}
                onChange={(e) =>
                  setNewBook({ ...newBook, genre: e.target.value })
                }
                required
              />
            </div>
            <div className="form-row">
              <input
                type="number"
                placeholder="Total Copies"
                value={newBook.totalCopies}
                onChange={(e) =>
                  setNewBook({
                    ...newBook,
                    totalCopies: parseInt(e.target.value) || 1,
                  })
                }
                min="1"
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Add Book to Library
            </button>
          </form>
        </div>
      )}

      {/* Issue Book Form */}
      {showIssueBook && (
        <div className="section card">
          <h3>Issue Book to Student</h3>
          <form onSubmit={handleIssueBook} className="issue-book-form">
            <div className="form-row">
              <input
                type="email"
                placeholder="Student Email Address *"
                value={issueData.studentEmail}
                onChange={(e) =>
                  setIssueData({ ...issueData, studentEmail: e.target.value })
                }
                required
              />
              <select
                value={issueData.bookId}
                onChange={(e) =>
                  setIssueData({ ...issueData, bookId: e.target.value })
                }
                required
              >
                <option value="">Select Book to Issue *</option>
                {books
                  .filter((book) => book.availableCopies > 0)
                  .map((book) => (
                    <option key={book._id} value={book._id}>
                      {book.title} by {book.author} (Available:{" "}
                      {book.availableCopies})
                    </option>
                  ))}
              </select>
            </div>
            <button type="submit" className="submit-btn">
              Issue Book
            </button>
          </form>
        </div>
      )}

      {/* Books Management */}
      <div className="section">
        <h3>Book Management</h3>
        <div className="stats">
          <div className="stat-card">
            <h4>Total Books</h4>
            <p>{books.length}</p>
          </div>
          <div className="stat-card">
            <h4>Available Books</h4>
            <p>{books.filter((book) => book.availableCopies > 0).length}</p>
          </div>
          <div className="stat-card">
            <h4>Total Issued</h4>
            <p>{allLoans.filter((loan) => loan.status === "active").length}</p>
          </div>
        </div>

        <div className="books-grid">
          {books.map((book) => (
            <div key={book._id} className="book-card">
              <div className="book-header">
                <h4>{book.title}</h4>
                <span
                  className={`status ${
                    book.availableCopies > 0 ? "available" : "unavailable"
                  }`}
                >
                  {book.availableCopies > 0 ? "Available" : "Out of Stock"}
                </span>
              </div>
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>ISBN:</strong> {book.isbn}
              </p>
              <p>
                <strong>Genre:</strong> {book.genre}
              </p>
              <p>
                <strong>Copies:</strong> {book.availableCopies}/
                {book.totalCopies}
              </p>
              <div className="book-actions">
                <button
                  onClick={() => handleDeleteBook(book._id)}
                  className="delete-btn"
                  disabled={book.availableCopies !== book.totalCopies}
                >
                  Delete Book
                </button>
                {book.availableCopies !== book.totalCopies && (
                  <small>Cannot delete - books are issued</small>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Book Issues */}
      <div className="section">
        <h3>Recent Book Issues ({allLoans.length})</h3>
        <div className="loans-list">
          {allLoans.length === 0 ? (
            <p className="no-data">No books issued yet</p>
          ) : (
            allLoans.map((loan) => (
              <div key={loan._id} className="loan-item">
                <div className="loan-info">
                  <strong>{loan.bookId?.title}</strong>
                  <span>
                    Issued to: {loan.studentId?.name || "Student"} (
                    {loan.studentId?.email})
                  </span>
                  <span>
                    Due: {new Date(loan.dueDate).toLocaleDateString()}
                  </span>
                  <span className={`status ${loan.status}`}>{loan.status}</span>
                </div>
                {loan.status === "active" && (
                  <button
                    onClick={() => handleReturnBook(loan._id)}
                    className="return-btn"
                  >
                    Mark Returned
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboard;
