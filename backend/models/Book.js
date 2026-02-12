const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Book title is required"],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Author name is required"],
    trim: true,
  },
  isbn: {
    type: String,
    required: [true, "ISBN is required"],
    unique: true,
    trim: true,
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    trim: true,
  },
  totalCopies: {
    type: Number,
    default: 5,
    min: [1, "Total copies must be at least 1"],
  },
  availableCopies: {
    type: Number,
    default: 5,
  },
  publishedYear: {
    type: Number,
    min: [1000, "Published year seems invalid"],
    max: [new Date().getFullYear(), "Published year cannot be in the future"],
  },
  description: String,
});

// Pre-save middleware to set availableCopies
bookSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("totalCopies")) {
    this.availableCopies = this.totalCopies;
  }
  next();
});

module.exports = mongoose.model("Book", bookSchema);
