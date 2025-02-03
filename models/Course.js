const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
   },
   { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
