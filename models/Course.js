const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
        students: [{ type: mongoose.Schema.Types.ObjectId, ref: "students" }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("courses", CourseSchema);
