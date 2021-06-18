const mongoose = require("mongoose");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
    required: true,
  },
  password: {
    type: String,
    unique: false,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validateEmail, "Please fill a valid email address"],
    // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
