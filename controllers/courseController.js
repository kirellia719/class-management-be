const User = require("../models/User.js");
const Course = require("../models/Course.js");
const dotenv = require("dotenv");
dotenv.config();

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ teacherId: req.user });
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
module.exports = { createCourse, getCourses }