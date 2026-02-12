const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  reservationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "notified", "cancelled"],
    default: "pending",
  },
  notifiedAt: Date,
});

module.exports = mongoose.model("Reservation", reservationSchema);
