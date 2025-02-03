const Course = require("../../models/Course.js");
const dotenv = require("dotenv");
dotenv.config();

const getCourses = async (req, res) => {
   try {
      const courses = await Course.find({ teacherId: req.user._id });
      res.json({
         message: "Lấy danh sách khoá học thành công",
         data: courses,
      });
   } catch (error) {
      res.json(error);
   }
};

const createCourse = async (req, res) => {
   try {
      const { name } = req.body;
      let course = await Course.findOne({ name });
      if (course) {
         res.status(400).json({
            message: "Khoá học đã tồn tại",
         });
      } else {
         course = await Course.create({ name, teacherId: req.user });
         res.status(201).json({
            message: "Tạo khoá học thành công",
            data: course,
         });
      }
   } catch (error) {
      res.json(error);
   }
};

const updateCourse = async (req, res) => {
   try {
      const { courseId } = req.params;
      const { name } = req.body;
      const checkedCourse = await Course.findOne({ name, _id: { $ne: courseId } });
      if (checkedCourse) {
         return res.status(400).json({ message: "Bị trùng tên" });
      } else {
         let course = await Course.findByIdAndUpdate(courseId, { name });
         if (course) {
            res.status(200).json({
               message: "Cập nhật khoá học thành công",
               data: course,
            });
         } else {
            return res.status(404).json({ message: "Khoá học không tồn tại" });
         }
      }
   } catch (error) {
      console.log(error);
      res.status(500).json(error);
   }
};

const deleteCourse = async (req, res) => {
   try {
      const { courseId } = req.params;
      const course = await Course.findByIdAndDelete(courseId);
      if (!course) {
         return res.status(404).json({ message: "Khoá học không tồn tại" });
      } else if (course.teacherId != req.user._id) {
         return res.status(403).json({ message: "Bạn không có quyền xóa khoá học này" });
      }
      res.json({ message: "Xóa khoá học thành công" });
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Lỗi server" });
   }
};

module.exports = { createCourse, getCourses, updateCourse, deleteCourse };
