const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  balance: {
    type: Number,
    default: 0,
  },
  portfolio: {
    type: Map,
    of: Number,
    default: {},
  },
});
const User = mongoose.model("User", UserSchema);

module.exports = User;
