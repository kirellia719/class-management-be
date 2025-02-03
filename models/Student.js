const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
   {
      username: { type: String, required: true },
      fullname: { type: String, required: true },
      password: { type: String, required: true, default: "123456" },
      avatar: { type: String },
      career: { type: Number, default: 2 },
      birthday: { type: Date },
      male: { type: Boolean, default: false },
      phone: { type: String },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
