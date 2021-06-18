require("dotenv").config();
const jwt = require("jsonwebtoken");

const express = require("express");
const morgan = require("morgan");
const multer = require("multer");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bookController = require("./controllers/bookController");
const categoryController = require("./controllers/categoryController");

app.set("view engine", "pug");
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("static"));

//importing routes here
const bookRouter = require("./routes/books");
const authRouter = require("./routes/auth");
mongoose.connect(process.env.MongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.get("/", async (req, res) => {
  res.send("Welcome to Mclaren Library");
});
app.get("/addbook", async (req, res) => {
  let categories = await categoryController.printAllCategories();
  res.render("addBook", { categories: categories });

  //   res.send("Welcome to Mclaren Library");
});

let validateRequest = async (req, res, next) => {
  if (req.headers === undefined) {
    res.status(403).json({ message: "Invalid request" });
  } else if (req.headers.authorization === undefined) {
    res.status(403).json({ message: "Token not provided" });
  } else {
    let token = req.headers.authorization.slice(7);

    try {
      let data = jwt.verify(token, process.env.secret_token);
      console.log(data);
      next();
    } catch (err) {
      res.status(403).json({ message: "Invalid token" });
    }
  }
};
app.use("/books", validateRequest, bookRouter);

app.use("/auth", authRouter);

app.get(/.*/, (req, res) => {
  res.statusCode = 404;
  res.send("You are lost. Contact nearest librarian!");
});

const PORT = 3300;
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
