const readline = require("readline-sync");
const mongoose = require("mongoose");
const categoryController = require("./controllers/categoryController");
const bookController = require("./controllers/bookController");
const CategoryModel = require("./models/category");
const memberController = require("./controllers/memberController");
const issueController = require("./controllers/issueController");
function displayOptions() {
  console.log("\n\nWELCOME TO MACLAREN COLLEGE");
  console.log("Here are a few things you can do:");
  console.log("1. See all books");
  console.log("2. Add a new book");
  console.log("3. Delete a book");
  console.log("4. Search a book");
  console.log("5. Search all books in a category");
  console.log("6. Add new member");
  console.log("7. Remove a member");
  console.log("8. Display All Members");
  console.log("9. See all categories");
  console.log("10. Add a new category");
  console.log("11. Delete a category");
  console.log("12. Issue a book");
  console.log("13. Return a book");
  console.log("14. Return a history of issue of a book");
  console.log("15. Display all issues\n\n");
}

mongoose
  .connect("mongodb://127.0.0.1:27017/library", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => showOptions());

async function showOptions() {
  displayOptions();
  let response = readline.question("Pick one operation to perform(1-4): ");
  switch (response) {
    case "1":
      await bookController.seeAllBooks();
      break;
    case "2":
      let bookName = readline.question(
        "What is the name of the book, you want to add? "
      );
      let bookPrice = readline.question("What is the price of the book? ");
      let bookCat = readline.question("What is the category of the book? ");
      while ((await CategoryModel.findOne({ name: bookCat })) === null) {
        console.log("No such category exists");
        await categoryController.printAllCategories();
        bookCat = readline.question("Select one from available categories: ");
      }
      let numAuthors = readline.question(
        "What is the number of authors of the book? "
      );
      let authors = [];
      while (numAuthors > 0) {
        let bookAuthor = readline.question(
          "What are the names of the authors of the book? "
        );
        authors.push(bookAuthor);
        numAuthors--;
      }
      await bookController.addNewBook({
        name: bookName,
        price: bookPrice,
        category: bookCat,
        author: authors,
      });
      break;
    case "3":
      let bookname = readline.question(
        "What is the name of the book, you want to remove? "
      );
      await bookController.removeBook(bookname);
      break;
    case "4":
      let bookiname = readline.question(
        "What is the name of the book, you want to search? "
      );
      await bookController.searchBook(bookiname);
      break;
    case "5":
      let categoryName = readline.question(
        "What is the name of the category, you want to search? "
      );
      await bookController.searchByCategory(categoryName);
      break;
    case "6":
      let memberName = readline.question(
        "What is the name of the member, you want to add? "
      );
      await memberController.createNewMember(memberName);
      break;
    case "7":
      let memberId = readline.question(
        "What is the ID of the member, you want to remove? "
      );
      await memberController.removeMember(memberId);
      break;
    case "8":
      await memberController.displayAllMembers();
      break;
    case "9":
      await categoryController.printAllCategories();
      break;
    case "10":
      let name = readline.question(
        "What is the name of the category, you want to add?"
      );
      await categoryController.addNewCategory(name);
      break;
    case "11":
      let delName = readline.question(
        "What is the name of the category, you want to add?"
      );
      await categoryController.removeCategory(delName);
      break;
    case "12":
      let bookIssueName = readline.question(
        "What is the name of the book, you want to issue?"
      );
      let memberIssueId = readline.question("What is the ID of the member?");
      await issueController.createNewIssue(bookIssueName, memberIssueId);
      break;

    case "13":
      let bookReturnName = readline.question(
        "What is the name of the book, you want to return?"
      );
      let memberReturnId = readline.question("What is the ID of the member?");
      await issueController.updateIssue(bookReturnName, memberReturnId);
      break;
case "14":
  let bookHistoryName = readline.question(
    "What is the name of the book, you want to see the history of?"
  );
  await issueController.seeIssueHistory(bookHistoryName);
  break;
    case "15":
      await issueController.displayAllIssues();
      break;
    default:
      mongoose.connection.close();
      return;
  }
  showOptions();
}
