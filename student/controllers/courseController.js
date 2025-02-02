const mongoose = require('mongoose');

const Course = require("../../models/Course.js");
const Exam = require("../../models/Exam.js");
const Submission = require("../../models/Submission.js");
const dotenv = require("dotenv");
dotenv.config();

const getAllCourses = async (req, res) => {
    try {
        const studentId = req.user._id;

        // Lấy danh sách khóa học mà học sinh tham gia
        const courses = await Course.find({ students: studentId }).lean();

        // Lấy danh sách bài kiểm tra đang mở (isOpen = true)
        const exams = await Exam.find({
            course: { $in: courses.map(c => c._id) },
            isOpen: true // Chỉ lấy các bài kiểm tra đang mở
        }).lean();

        // Lấy danh sách bài nộp của học sinh
        const submissions = await Submission.find({
            student: studentId,
            exam: { $in: exams.map(e => e._id) }
        }).select("exam").lean();

        // Chuyển danh sách submission thành tập hợp examId đã làm
        const attemptedExamIds = new Set(submissions.map(sub => sub.exam.toString()));

        // Duyệt từng khóa học để kiểm tra số bài kiểm tra đang mở nhưng chưa làm
        const result = courses.map(course => {
            // Lọc ra các bài kiểm tra thuộc khóa học có isOpen = true
            const openExams = exams.filter(exam => exam.course.toString() === course._id.toString());

            // Đếm số bài kiểm tra đang mở nhưng chưa làm
            const openExamsNotAttempted = openExams.filter(exam => !attemptedExamIds.has(exam._id.toString())).length;

            return {
                ...course,
                openExamsNotAttempted
            };
        });

        res.json({
            message: "Lấy danh sách khoá học thành công",
            data: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server" });
    }
};


const getExamsInCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user._id; // Lấy studentId từ user đã đăng nhập

        // Tìm tất cả các đề thi trong khóa học
        const exams = await Exam.find({ course: courseId });


        if (!exams.length) {
            return res.status(404).json({ message: "Không tìm thấy bài thi" });
        }

        // Tìm số lần nộp bài của học sinh cho từng examId
        const result = await Promise.all(
            exams.map(async (exam) => {
                let submissions = await Submission.find({
                    student: studentId,
                    exam: exam._id,
                });

                if (submissions.length === 0) {
                    return {
                        ...exam._doc,
                        maxScoreSubmission: null,
                        attempts: 0,
                    };
                }

                // Tìm bài có điểm cao nhất
                return {
                    ...exam._doc,
                    maxScoreSubmission: submissions.reduce((max, sub) =>
                        (sub.score !== null && (max === null || sub.score > max.score)) ? sub : max
                        , null)?.score || null,
                    attempts: submissions.length
                };
            })
        );

        res.json({ message: "Lấy bài thi thành công", data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server." });
    }
}



module.exports = { getAllCourses, getExamsInCourse };
