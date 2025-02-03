const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
   {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
      exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
      answers: [{ questionId: mongoose.Schema.Types.ObjectId, answer: mongoose.Schema.Types.Mixed }], // Đáp án học sinh chọn
      isDone: { type: Boolean, default: false },
      score: { type: Number, default: null }, // Điểm số (sẽ được chấm sau)
      dateSubmitted: { type: Date },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
