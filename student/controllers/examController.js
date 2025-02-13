const Exam = require("../../models/Exam.js");
const Course = require("../../models/Course.js");
const Submission = require("../../models/Submission.js");

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Chọn ngẫu nhiên một vị trí từ 0 đến i
        [array[i], array[j]] = [array[j], array[i]];  // Hoán đổi phần tử
    }
    return array;
}

const checkExam = async (req, res) => {
    const studentId = req.user._id;
    const { examId } = req.params;

    try {
        // 1. Lấy bài thi theo examId
        const exam = await Exam.findById(examId).lean();
        let numberQuestions;
        if (!exam) {
            return res.status(404).json({ message: "Bài thi không tồn tại" });
        }
        numberQuestions = exam.questions.length;
        delete exam.questions;
        exam.numberQuestions = numberQuestions;


        // 3. Kiểm tra xem học sinh có thuộc lớp nào của bài thi không
        const course = await Course.findOne({
            _id: exam.course,
            students: studentId,
        });

        if (!course) {
            console.log("Course not found");
            return res
                .status(403)
                .json({ message: "Học sinh không thuộc lớp được phép làm bài thi này" });
        }

        // 4. Kiểm tra số lần nộp bài đã tối đa hay chưa
        const submissions = await Submission.find({
            exam: examId,
            student: studentId
        });

        return res.status(200).json({
            data: {
                exam,
                submissions,
            },
            message: "",
        });
    } catch (error) {
        console.error("Lỗi lấy thông tin bài thi:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};

const joinExam = async (req, res) => {
    try {
        const { examId } = req.params;
        const studentId = req.user._id;

        const newSubmission = new Submission({
            exam: examId,
            student: studentId,
            isDone: false,
        })

        await newSubmission.save();
        console.log("Tham gia bài thi thành công");
        return res.status(200).json({
            message: "Tham gia bài thi thành công",
            data: newSubmission,
        });
    } catch (error) {
        console.error("Lỗi tham gia bài thi:", error);
        return res.status(500).json({ error: "Lỗi server" });
    }
}

const getExamForSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const submission = await Submission.findById(submissionId).populate("exam");
        if (!submission) {
            return res.status(404).json({ error: "Bài làm không tồn tại" });
        }

        const exam = submission.exam;
        let { questions, duration } = exam;

        const createdAt = new Date(submission.createdAt);
        const endTime = new Date(createdAt.getTime() + duration * 60000);
        const isExpired = Date.now() > endTime.getTime();

        // Nếu hết giờ, cập nhật isDone
        if (isExpired && !submission.isDone) {
            submission.isDone = true;
            await submission.save();
        }

        questions = questions.map(question => ({
            content: question.content,
            options: question.options,
            _id: question._id
        }));

        if (exam.shuffleQuestions) {
            questions = shuffleArray(questions);
        }

        exam.questions = questions;
        submission.exam = exam;

        return res.status(200).json({
            message: "Học sinh đã tham gia bài thi",
            data: submission,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
};

const countCorrectAnswers = (answers, questions) => {
    return answers.reduce((correctCount, { questionId, answer }) => {
        const question = questions.find(q => q._id == questionId);
        return (question && answer == question.correctAnswer) ? correctCount + 1 : correctCount;
    }, 0);
};
const submitExam = async (req, res) => {
    try {
        const { answers } = req.body;
        const { submissionId } = req.params;

        const submission = await Submission.findById(submissionId).populate("exam");
        if (!submission) {
            return res.status(404).json({ error: "Bài làm không tồn tại" });
        }

        const mappedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer: parseInt(answer)
        }));

        const exam = submission.exam;
        const questions = exam.questions;
        const correctCount = countCorrectAnswers(mappedAnswers, questions);
        submission.score = correctCount;
        submission.answers = mappedAnswers;
        submission.isDone = true;
        submission.dateSubmitted = new Date();
        await submission.save();

        return res.status(200).json({
            message: "Nộp bài thi thành công",
            data: submission,
        });
    } catch (error) {

    }
}


module.exports = { checkExam, joinExam, getExamForSubmission, submitExam };