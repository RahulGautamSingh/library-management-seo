const { eventNames } = require("../models/member");
const Member = require("../models/member");

const displayAllMembers = async () => {
  let members = await Member.find();
  console.log("-------");
  console.log(members);
  if (members.length === 0) console.log("No members to show");
  else {
    members.forEach((elem) => {
      console.log(elem.name, "  |  ", elem.memberId);
      console.log("---------");
    });
  }
};

const createNewMember = async (name) => {
  // let newMember = await Member.findOne({})

  let newMember = new Member({ name: name });
  await newMember.save().catch((err) => console.log(err.message));
  console.log("New member added", newMember);
};

const removeMember = async (id) => { 
  let newMember = await Member.findOne({ memberId: id });
  if (newMember !== null) {
    newMember.remove();
    console.log("Member removed.");
  } else {
    console.log("Member does not exist.");
  }
};

module.exports = {
  createNewMember,
  removeMember,
  displayAllMembers,
};
