const router = require("express").Router();
let BookControler = require("../controllers/bookController");
const Authenticate = require("../Authentication");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("", Authenticate, upload.single("file"), BookControler.create);
router.get("", BookControler.getAll);
router.put("/:id", Authenticate, BookControler.update);
router.put("/buy/:id", BookControler.buyBook);
router.put(
  "/file/:id",
  Authenticate,
  upload.single("file"),
  BookControler.updateWithImage
);
router.delete("/:id", Authenticate, BookControler.delete);
router.get("/:id", BookControler.getBookById);

module.exports = router;
