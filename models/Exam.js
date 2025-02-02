const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true } // Chỉ mục của đáp án đúng
});

const examSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    duration: { type: Number, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // Liên kết với khóa học
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Giáo viên tạo đề
    questions: [QuestionSchema],
    shuffleQuestions: Boolean,
    shuffleAnswers: Boolean,
    attemptsAllowed: Number,
    isOpen: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Exam", examSchema);
