const Book = require("../models/book");
const Category = require("../models/category");
const categoryController = require("./categoryController");
const seeAllBooks = async () => {
  let books = await Book.find().populate("category");
  console.log("-------");
  if (books.length === 0) return {"message":"No books to show"};
  else {
    books.forEach((elem) => {
      console.log(
        elem.title.toUpperCase(),
        "  |  ",
        elem.author.join(", ").toUpperCase(),
        "  |  ",
        elem.category.name
      );
      console.log("---------");
    });
    console.log(
      "----------------------------------------------------------------------------------------------"
    );
    return books;
  }
};

const addNewBook = async (book) => {
  let category = await Category.findOne({ name: book.name }).catch((err) =>
    console.log(err)
  );

  if (category === null) {
    await categoryController.addNewCategory(book.name);
    category = await Category.findOne({ name: book.name }).catch((err) =>
      console.log(err)
    );
  }

  let booki = new Book({
    title: book.name,
    price: book.price,
    category: category._id,
    author: book.author,
  });
  await booki.save().catch((err) => {console.log(err);return false});

  console.log(
    "--------------------------------NEW BOOK ADDED-------------------------------------"
  );
  return true
};
const removeBook = async (bookId) => {
  let result = await Book.findOne({_id:bookId}); // result = await Category.findOne({name:categoryName}) -> result===undefined -> err
  console.log(result)
 
  if (result !== null) {
    await result.remove();
    console.log(
      "--------------------------------BOOK REMOVED-------------------------------------"
    );
    return true
  } else {
    console.log(
      "--------------------------------BOOK NOT FOUND-------------------------------------"
    );
    return false
  }
};

const searchBook = async (bookName) => {
  let result = await Book.find(); // result = await Category.findOne({name:categoryName}) -> result===undefined -> err
  let res = result.filter((elem) => elem.title === bookName);
  if (res.length !== 0) {
    console.log(
      res[0].title.toUpperCase(),
      "  |  ",
      res[0].author.join(", ").toUpperCase()
    );
    console.log("------------");
  } else {
    console.log(
      "-------------------SHOWING SIMILAR RESULTS-----------------------------"
    );

    let partialName = bookName.slice(0, Math.floor(bookName.length / 3) + 1);
    // console.log(partialName)
    let regex = new RegExp(partialName, "i");
    // console.log(result)
    result = result.filter((elem) => regex.test(elem.title));
    // console.log(result)
    if (bookName.length < 3 || result.length === 0)
      console.log(
        "--------------------------------NO BOOKS FOUND-------------------------------------"
      );
    else {
      result.forEach((elem) => {
        console.log(
          elem.title.toUpperCase(),
          "  |  ",
          elem.author.join(", ").toUpperCase()
        );
        console.log("---------");
      });
      console.log(
        "---------------------------------------------------------------------"
      );
    }
  }
};

const searchByCategory = async (categoryName) => {
  let category = await Category.findOne({ name: categoryName });
  if (category === null) {
    console.log("No such category exists");
  } else {
    let books = await Book.find({ category: category._id });
    if (books.length === 0) console.log("No books in this this category.");
    else {
      books.forEach((elem) => {
        console.log(
          elem.title.toUpperCase(),
          "  |  ",
          elem.author.join(", ").toUpperCase()
        );
        console.log("---------");
      });
    }
  }
};
module.exports = {
  seeAllBooks,
  addNewBook,
  removeBook,
  searchBook,
  searchByCategory,
};
