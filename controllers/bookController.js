const multer = require("multer");
const upload = multer();
const BookModel = require("../models/bookModel");
const AsyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");

// Insert Book
exports.create = AsyncErrorHandler(async (req, res, next) => {
  console.log("<=== Add New Book ====>");
  // Destructure req.body for cleaner code
  const { title, author, description, price, availableQuantity, type } =
    req.body;

  // Extract the image data from the request body
  const bookImage =
    "http://localhost:8080/public/uploads/" + req.file.originalname;

  const newBook = new BookModel({
    title,
    author,
    description,
    price,
    availableQuantity,
    bookImage,
    type,
  });

  const book = await newBook.save();
  res
    .status(201)
    .json({ status: "success", message: "Insert Book", result: book });
});

// Insert Book
exports.updateWithImage = AsyncErrorHandler(async (req, res, next) => {
  console.log("<=== Update Book With Image  ====>");
  const id = req.params.id;
  // Destructure req.body for cleaner code
  const {
    title,
    author,
    description,
    price,
    availableQuantity,
    soldQuantity,
    type,
  } = req.body;

  // Extract the image data from the request body
  const bookImage =
    "http://localhost:8080/public/uploads/" + req.file.originalname;

  const updateObj = {
    title,
    author,
    description,
    price,
    availableQuantity,
    soldQuantity,
    bookImage,
    type,
  };

  const book = await BookModel.findByIdAndUpdate(id, updateObj);

  if (!book) {
    const error = new CustomError("Book with that ID is not found!", 404);
    return next(error);
  }

  res
    .status(200)
    .json({ status: "success", message: "Update Book", result: book });
});

// Get All Books
exports.getAll = AsyncErrorHandler(async (req, res, next) => {
  console.log(`<=== Get All Books ====>`);
  const books = await BookModel.find().exec();

  if (books && books.length > 0) {
    res
      .status(200)
      .json({ status: "success", message: "Found Books", result: books });
  } else {
    res.status(200).json({
      status: "success",
      message: "Books are not available",
      result: books,
    });
  }
});

// Buy Book
exports.update = AsyncErrorHandler(async (req, res, next) => {
  console.log(`<=== Update Book ====>`);
  const id = req.params.id;
  const {
    title,
    author,
    description,
    price,
    availableQuantity,
    soldQuantity,
    bookImage,
    type,
  } = req.body;

  const updateObj = {
    title,
    author,
    description,
    price,
    availableQuantity,
    soldQuantity,
    bookImage,
    type,
  };

  const book = await BookModel.findByIdAndUpdate(id, updateObj);

  if (!book) {
    const error = new CustomError("Book with that ID is not found!", 404);
    return next(error);
  }

  res
    .status(200)
    .json({ status: "success", message: "Update Book", result: book });
});

// Delete Book
exports.delete = AsyncErrorHandler(async (req, res, next) => {
  console.log(`<=== Delete Book ====>`);
  const id = req.params.id;

  const book = await BookModel.findByIdAndDelete(id);

  if (!book) {
    const error = new CustomError("Book with that ID is not found!", 404);
    return next(error);
  }

  res
    .status(200)
    .json({ status: "success", message: "Deleted Book", result: book });
});

// Get Book
exports.getBookById = AsyncErrorHandler(async (req, res, next) => {
  console.log(`<=== Get Book By Book ID ====>`);
  const bookId = req.params.id;
  const book = await BookModel.findById(bookId);

  if (!book) {
    const error = new CustomError("Book with that ID is not found!", 404);
    return next(error);
  }
  res
    .status(200)
    .json({ status: "success", message: "Found Book", result: book });
});

// buy Book
exports.buyBook = AsyncErrorHandler(async (req, res, next) => {
  console.log(`<=== Buy Book  ====>`);

  const bookId = req.params.id;
  const quantity = 1;

  const book = await BookModel.findById(bookId);

  if (!book) {
    const error = new CustomError("Book not found!", 404);
    return next(error);
  }

  if (book.availableQuantity < quantity) {
    const error = new CustomError("Not enough available quantity!", 400);
    return next(error);
  }

  book.soldQuantity += quantity;
  book.availableQuantity -= quantity;

  await book.save();

  res.json({ message: "Book purchased successfully", book });
});
