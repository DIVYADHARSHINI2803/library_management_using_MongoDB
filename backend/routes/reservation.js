const express = require("express");
const Reservation = require("../models/Reservation");
const Book = require("../models/Book");
const auth = require("../middleware/auth");
const router = express.Router();

// Reserve a book
router.post("/", auth, async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "Book not found",
      });
    }

    if (book.availableCopies > 0) {
      return res.status(400).json({
        status: "fail",
        message: "Book is available for direct issue",
      });
    }

    // Check if user already has a pending reservation for this book
    const existingReservation = await Reservation.findOne({
      studentId: req.user.id,
      bookId,
      status: "pending",
    });

    if (existingReservation) {
      return res.status(400).json({
        status: "fail",
        message: "You already have a pending reservation for this book",
      });
    }

    const reservation = await Reservation.create({
      studentId: req.user.id,
      bookId,
    });

    res.status(201).json({
      status: "success",
      message: "Book reserved successfully. We will notify you when available.",
      data: {
        reservation,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

// Get user's reservations
router.get("/my-reservations", auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ studentId: req.user.id })
      .populate("bookId")
      .sort("-reservationDate");

    res.status(200).json({
      status: "success",
      results: reservations.length,
      data: {
        reservations,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

// Cancel reservation
router.delete("/:id", auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        status: "fail",
        message: "Reservation not found",
      });
    }

    if (reservation.studentId.toString() !== req.user.id) {
      return res.status(403).json({
        status: "fail",
        message: "Access denied",
      });
    }

    await Reservation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Reservation cancelled successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

module.exports = router;
