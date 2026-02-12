const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
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
  issueDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  renewalUsed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["active", "returned", "overdue"],
    default: "active",
  },
  fineAmount: {
    type: Number,
    default: 0,
  },
});

// Calculate fine method
loanSchema.methods.calculateFine = function () {
  if (this.status === "active" && new Date() > this.dueDate) {
    const daysOverdue = Math.ceil(
      (new Date() - this.dueDate) / (1000 * 60 * 60 * 24)
    );
    this.fineAmount = daysOverdue * 5; // ₹5 per day
    this.status = "overdue";
    return this.fineAmount;
  }
  return 0;
};

// Create and export the model
const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
