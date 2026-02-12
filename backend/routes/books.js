const express = require("express");
const Book = require("../models/Book");
const auth = require("../middleware/auth");
const router = express.Router();

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({
      status: "success",
      results: books.length,
      data: {
        books,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

// Search books
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({
      status: "success",
      results: books.length,
      data: {
        books,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

// Add book (Librarian only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "librarian") {
      return res.status(403).json({
        status: "fail",
        message: "Access denied. Librarians only.",
      });
    }

    const { title, author, isbn, genre, totalCopies } = req.body;

    // Create book with explicit availableCopies
    const newBook = await Book.create({
      title,
      author,
      isbn,
      genre,
      totalCopies: totalCopies || 5,
      availableCopies: totalCopies || 5,
    });

    res.status(201).json({
      status: "success",
      message: "Book added successfully!",
      data: {
        book: newBook,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

// Update book
router.patch("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "librarian") {
      return res.status(403).json({
        status: "fail",
        message: "Access denied. Librarians only.",
      });
    }

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        book,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

// Delete book
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "librarian") {
      return res.status(403).json({
        status: "fail",
        message: "Access denied. Librarians only.",
      });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

module.exports = router;
