const express = require("express");
const {
  addNewBook,
  seeAllBooks,
  removeBook,
} = require("../controllers/bookController");
const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    let books = await seeAllBooks();
    res.json(books);
  })
  .post(async (req, res) => {
    let result = await addNewBook(req.body);
    if (result) {
      res.redirect("/");
    } else {
      res.render("/error");
    }
  });

let bookHandler1 = async (req, res, next) => {
  let id = req.params.bookID;
  let result = await removeBook(id);

  next();
};
let bookHandler2 = (req, res) => {
  res.redirect("/");
};

router.delete("/:bookID", [bookHandler1, bookHandler2]);

module.exports = router;
