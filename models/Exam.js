const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true } // Chỉ mục của đáp án đúng
});

const examSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    duration: { type: Number, required: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // Liên kết với khóa học
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Giáo viên tạo đề
    questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model("Exam", examSchema);
