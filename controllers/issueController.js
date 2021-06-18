const Book = require("../models/book");
const Member = require("../models/member");
const Issue = require("../models/issue");

const displayAllIssues = async () => {
  let issues = await Issue.find().populate("member").populate("book");
  console.log("-------");

  if (issues.length === 0) console.log("No issues to show");
  else {
    issues.forEach((elem) => {
      console.log(
        elem.book.title,
        "  |  ",
        elem.member.name,
        "  |  ",
        elem.status
      );
      console.log("---------");
    });
  }
};

const createNewIssue = async (name, Id) => {
  let book = await Book.findOne({ title: name });
  let member = await Member.findOne({ memberId: Id });

  let bookStatus = await Issue.findOne({ book: book._id, status: true }).catch(
    (err) => console.log(err.message)
  );
  let memberStatus = await Issue.findOne({
    member: member._id,
    status: true,
  }).catch((err) => console.log(err.message));
  if (bookStatus !== null) {
    console.log("Book not available.Some member has it issued currently");
  } else if (memberStatus !== null) {
    console.log(
      "Only one book allowed per member at time.Please return your previous book first"
    );
  } else {
    let issue = new Issue({ book: book._id, member: member._id });
    await issue.save().catch((err) => console.log(err.message));
    //update book and member properties remaining

    console.log("New issue added", issue);
  }
};

const updateIssue = async (name, Id) => {
  let book = await Book.findOne({ title: name });
  let member = await Member.findOne({ memberId: Id });

  let issue = await Issue.findOne({
    book: book._id,
    member: member._id,
    status: true,
  });
  await issue.updateOne({ status: false });
  //update book and member properties remaining
};
const seeIssueHistory = async (name) => {
  let book = await Book.findOne({ title: name });
  let issues = await Issue.find({ book: book._id }).populate("member");
  issues.forEach((issue) => {
    console.log(issue.member.name, issue.issueDate);
  });
};
module.exports = {
  createNewIssue,
  updateIssue,
  displayAllIssues,
  seeIssueHistory,
};
