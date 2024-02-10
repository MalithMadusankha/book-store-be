const express = require("express");
const admin = require("firebase-admin");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const rateLimit = require("express-rate-limit");

const app = express();
require("dotenv").config();

const GlobalErrorHandler = require("./controllers/errorController");
const CustomError = require("./utils/CustomError");

const PORT = process.env.PORT || 8080;

app.use(cors());

app.use(bodyParser.json());
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);

// Initialize Firebase Admin SDK
const serviceAccount = require("./config/serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//DB URL
const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("        <=== Database connected ! ====>");
  console.log(`<=== Running on URL: http://localhost:${PORT} ====>`);
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`<=== Server is up and running on port ${PORT} ====>`);
});

// rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// Book Routes
const BookRoute = require("./routes/bookRoute");
app.use("/book", BookRoute);

app.all("*", (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the Server!`,
    404
  );
  next(err);
});

app.use(GlobalErrorHandler);
