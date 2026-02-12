const express = require("express");
const Loan = require("../models/Loan");
const Book = require("../models/Book");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

// Issue book to student
router.post("/issue", auth, async (req, res) => {
  try {
    console.log("Issue book request received:", req.body);

    if (req.user.role !== "librarian") {
      return res.status(403).json({
        status: "fail",
        message: "Access denied. Librarians only.",
      });
    }

    const { studentEmail, bookId } = req.body;

    if (!studentEmail || !bookId) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide student email and book ID",
      });
    }

    // Find student by email
    const student = await User.findOne({
      email: studentEmail,
      role: "student",
    });
    if (!student) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found with this email",
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "Book not found",
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        status: "fail",
        message: "Book not available. All copies are issued.",
      });
    }

    // Calculate due date (2 weeks from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    console.log(
      "Creating loan for student:",
      student.email,
      "book:",
      book.title
    );

    // Create loan record using Loan model
    const loan = await Loan.create({
      studentId: student._id,
      bookId: book._id,
      dueDate: dueDate,
    });

    console.log("Loan created successfully:", loan._id);

    // Update book copies
    book.availableCopies -= 1;
    await book.save();

    // Update student's total books issued
    student.totalBooksIssued += 1;
    await student.save();

    // Populate the loan with book and student details
    const populatedLoan = await Loan.findById(loan._id)
      .populate("bookId")
      .populate("studentId", "name email");

    res.status(201).json({
      status: "success",
      message: `Book "${book.title}" issued successfully to ${student.name}`,
      data: {
        loan: populatedLoan,
      },
    });
  } catch (error) {
    console.error("Error in issue book route:", error);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

// Get all loans (Librarian only)
router.get("/all-loans", auth, async (req, res) => {
  try {
    if (req.user.role !== "librarian") {
      return res.status(403).json({
        status: "fail",
        message: "Access denied. Librarians only.",
      });
    }

    const loans = await Loan.find()
      .populate("bookId")
      .populate("studentId", "name email")
      .sort("-issueDate");

    res.status(200).json({
      status: "success",
      results: loans.length,
      data: {
        loans,
      },
    });
  } catch (error) {
    console.error("Error getting all loans:", error);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

// Get user's loans
// Get user's loans - FIXED VERSION
router.get("/my-loans", auth, async (req, res) => {
  try {
    console.log("Fetching loans for user:", req.user.id, req.user.email);

    const loans = await Loan.find({ studentId: req.user.id })
      .populate("bookId", "title author genre isbn") // Only get necessary book fields
      .sort("-issueDate");

    console.log("Found loans:", loans.length);

    res.status(200).json({
      status: "success",
      results: loans.length,
      data: {
        loans,
      },
    });
  } catch (error) {
    console.error("Error fetching user loans:", error);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});
// Renew book
router.patch("/:id/renew", auth, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate("bookId");

    if (!loan) {
      return res.status(404).json({
        status: "fail",
        message: "Loan not found",
      });
    }

    if (loan.studentId.toString() !== req.user.id) {
      return res.status(403).json({
        status: "fail",
        message: "Access denied",
      });
    }

    if (loan.renewalUsed) {
      return res.status(400).json({
        status: "fail",
        message: "Renewal already used",
      });
    }

    loan.dueDate.setDate(loan.dueDate.getDate() + 14);
    loan.renewalUsed = true;
    await loan.save();

    res.status(200).json({
      status: "success",
      message: "Book renewed successfully",
      data: {
        loan,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

// Return book
router.patch("/:id/return", auth, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate("bookId");

    if (!loan) {
      return res.status(404).json({
        status: "fail",
        message: "Loan not found",
      });
    }

    if (
      req.user.role !== "librarian" &&
      loan.studentId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        status: "fail",
        message: "Access denied",
      });
    }

    loan.returnDate = new Date();
    loan.status = "returned";
    await loan.save();

    // Update book copies
    const book = await Book.findById(loan.bookId);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.status(200).json({
      status: "success",
      message: "Book returned successfully",
      data: {
        loan,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

module.exports = router;
