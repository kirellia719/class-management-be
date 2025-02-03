const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
   {
      username: { type: String, required: true },
      fullname: { type: String, required: true },
      password: { type: String, required: true },
      avatar: { type: String },
      career: { type: Number, required: true, default: 2 },
      birthday: { type: Date, required: true, default: new Date() },
      male: { type: Boolean, required: true, default: false },
      phone: { type: String },
   },
   { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
