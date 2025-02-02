const Course = require("../../models/Course.js");
const Student = require("../../models/Student.js");
const dotenv = require("dotenv");
dotenv.config();
function generateUsername(fullName, birthDay) {
   // Chuyển đổi họ và tên thành chữ thường và loại bỏ dấu tiếng Việt
   let nameParts = fullName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
      .replace(/đ/g, "d") // Thay thế 'đ' thành 'd'
      .replace(/Đ/g, "d") // Thay thế 'Đ' thành 'd'
      .split(" "); // Tách tên thành mảng từng từ

   let username = nameParts.join("");

   let formattedDate = "";

   let date = birthDay ? new Date(birthDay) : null;
   if (date instanceof Date && date != "Invalid Date") {
      formattedDate =
         date.getDate().toString().padStart(2, "0") +
         (date.getMonth() + 1).toString().padStart(2, "0") +
         date.getFullYear().toString();
   }

   return username + formattedDate;
}

const getStudents = async (req, res) => {
   try {
      const { courseId } = req.params;

      const course = await Course.findById(courseId).populate(
         "students",
         "_id fullname birthday male avatar username career"
      ); // Lấy thông tin chi tiết học viên
      if (!course) return res.status(404).json({ message: "Khóa học không tồn tại" });
      else return res.json({ message: "Lấy thông tin khoá học", data: course });
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Lỗi server", error });
   }
};

const addStudent = async (req, res) => {
   try {
      const { courseId } = req.params;
      let { fullname, birthday, phone, male } = req.body;
      const username = generateUsername(fullname, birthday);
      const check = await Student.findOne({ username });
      if (check) {
         res.status(400).json({
            message: "Tài khoản học sinh đã tồn tại",
         });
      } else {
         const newStudent = new Student({ username, male, birthday, fullname, phone });
         const student = await newStudent.save();

         if (student) {
            await Course.findByIdAndUpdate(courseId, { $push: { students: student._id } });
            res.json({
               message: "Đã thêm",
            });
         } else {
            res.status(400).json({
               message: "Thêm học sinh thất bại",
            });
         }
      }
   } catch (error) {
      console.log(error);
      res.status(500).json(error);
   }
};

const deleteStudent = async (req, res) => {
   try {
      const { studentId } = req.params;

      // Kiểm tra học sinh có tồn tại không
      const student = await Student.findById(studentId);
      if (!student) return res.status(404).json({ message: "Học sinh không tồn tại" });

      // Xóa studentId khỏi tất cả các khóa học
      await Course.updateMany({ students: studentId }, { $pull: { students: studentId } });

      // Xóa học sinh khỏi database
      await Student.findByIdAndDelete(studentId);

      res.json({ message: "Đã xóa học sinh và loại bỏ khỏi các khóa học" });
   } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Lỗi server", error });
   }
};

const updateStudent = async (req, res) => {
   try {
      // Tìm và cập nhật học sinh
      const { studentId } = req.params; // Lấy id học sinh từ params
      let { fullname, birthday, phone, male } = req.body;
      const username = generateUsername(fullname, birthday);
      const check = await Student.findOne({ username, _id: { $ne: studentId } });
      if (check) {
         res.status(400).json({
            message: "Tài khoản học sinh đã tồn tại",
         });
      } else {
         const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            { username, male, birthday, fullname, phone },
            { new: true }
         );

         if (updatedStudent) {
            res.json({ message: "Đã cập nhật học sinh", data: updatedStudent });
         } else {
            res.status(404).json({ message: "Học sinh không tồn tại" });
         }
      }
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
   }
};

const changePassword = async (req, res) => {
   try {
      // Tìm và cập nhật học sinh
      const { studentId } = req.params; // Lấy id học sinh từ params
      let { password } = req.body;

      // Hash mật khẩu
      const updatedStudent = await Student.findByIdAndUpdate(studentId, { password }, { new: true });

      if (updatedStudent) {
         res.json({ message: "Đã đổi mật khẩu", data: updatedStudent });
      } else {
         res.status(404).json({ message: "Học sinh không tồn tại" });
      }
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
   }
};

module.exports = { getStudents, addStudent, deleteStudent, updateStudent, changePassword };
