const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
    unique: true,
  },
});

module.exports = mongoose.model("User", UserSchema);