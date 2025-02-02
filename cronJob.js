const Exam = require("./models/Exam");
const Submission = require("./models/Submission");

const checkAndUpdateExamStatus = async () => {
    try {
        console.log("cronJob");

        const exams = await Exam.find();  // Lấy danh sách tất cả các bài thi

        const now = new Date();
        for (const exam of exams) {
            // Lấy tất cả submissions của bài thi
            const submissions = await Submission.find({
                exam: exam._id,
                isDone: false,
            });

            for (const submission of submissions) {
                // Lấy thời gian kết thúc dựa trên createdAt của submission và exam.duration
                const submissionEndTime = new Date(submission.createdAt);
                submissionEndTime.setMinutes(submissionEndTime.getMinutes() + exam.duration);

                // Kiểm tra nếu bài thi đã hết thời gian và chưa được chấm điểm
                if (now > submissionEndTime) {
                    // Cập nhật trạng thái cho những bài thi hết giờ nhưng chưa nộp
                    await Submission.updateOne(
                        { _id: submission._id },
                        { $set: { isDone: true } }
                    );
                    console.log(`Submission ${submission._id} đã hết hạn và được chấm điểm.`);
                }
            }
        }
    } catch (error) {
        console.error("Error updating exam status:", error);
    }
};

// Kiểm tra mỗi phút (60000 ms)
module.exports = () => {
    setInterval(checkAndUpdateExamStatus, 10000);
}