const Exam = require("../../models/Exam.js");
const dotenv = require("dotenv");
const Submission = require("../../models/Submission.js");
dotenv.config();

const createExam = async (req, res) => {
   try {
      const teacherId = req.user._id;
      const { title } = req.body;

      const existingExam = await Exam.findOne({ title });

      if (existingExam) {
         return res.status(400).json({ message: "Tên đề thi đã tồn tại" });
      }

      // Tạo đề thi mới
      const newExam = new Exam({
         ...req.body,
         teacherId,
      });

      await newExam.save();

      res.status(201).json({
         message: "Tạo đề thi thành công",
         exam: newExam,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Lỗi server", error });
   }
};
const updateExam = async (req, res) => {
   try {
      const { examId } = req.params;
      const { title } = req.body;

      console.log(req.body);

      const existingExam = await Exam.findOne({ title, _id: { $ne: examId } });

      if (existingExam) {
         return res.status(400).json({ message: "Tên đề thi đã tồn tại" });
      }

      // Cập nhật đề thi
      const exam = await Exam.findByIdAndUpdate(examId, { ...req.body });

      if (!exam) {
         return res.status(404).json({ message: "Đề thi không tồn tại" });
      }

      res.status(201).json({
         message: "Cập nhật đề thi thành công",
         data: exam,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Lỗi server", error });
   }
};

const getExams = async (req, res) => {
   try {
      const teacherId = req.user._id; // Lấy teacherId từ req.user

      const exams = await Exam.find({ teacherId }).sort({ createdAt: -1 });

      res.status(200).json({
         message: "Đã lấy đề thi",
         data: exams,
      });
   } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
   }
};

const getExam = async (req, res) => {
   try {
      const examId = req.params.examId;
      const exam = await Exam.findById(examId);

      if (!exam) {
         return res.status(404).json({ message: "Đề thi không tồn tại" });
      }

      res.status(200).json({
         message: "Đã lấy đề thi",
         data: exam,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
   }
};

const deleteExam = async (req, res) => {
   try {
      const examId = req.params.examId;
      const exam = await Exam.findByIdAndDelete(examId);
      await Submission.deleteMany({ exam: examId });
      if (!exam) {
         return res.status(404).json({ message: "Đề thi không tồn tại" });
      }
      res.status(200).json({ message: "Đã xóa đề thi" });
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
   }
};

module.exports = { createExam, getExams, getExam, deleteExam, updateExam };
