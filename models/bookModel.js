const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required field!"],
    maxlength: [50, "Title must not have more than 50 characters"],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Author is required field!"],
    maxlength: [50, "Author must not have more than 50 characters"],
    minlength: [3, "Author must have at least 3 characters"],
    trim: true,
  },
  description: { type: String },
  price: { type: Number, required: [true, "Price is required field!"] },
  availableQuantity: {
    type: Number,
    required: [true, "Available Quantity is required field!"],
  },
  soldQuantity: { type: Number, default: 0 },
  bookImage: {
    type: String,
    required: [true, "Book image is required field!"],
  },
  type: {
    type: [String],
    required: [true, "Genres is required field!"],
    enum: {
      values: [
        "Action",
        "Adventure",
        "Classics",
        "Thriller",
        "Crime",
        "Fantasy",
        "Horror",
        "Romance",
        "Mystery",
      ],
      message: "This book type does not exist",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
