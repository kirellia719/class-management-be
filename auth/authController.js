const User = require("../models/User.js");
const Student = require("../models/Student.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const login = async (req, res) => {
   try {
      const { username, password } = req.body;
      let user = await User.findOne({ username });
      if (!user) {
         user = await Student.findOne({ username });
      }
      if (user) {
         if (user.password === password) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
               expiresIn: "30d",
            });
            res.json({
               message: "Đăng nhập thành công",
               data: token,
            });
         } else {
            res.status(400).json({
               message: "Mật khẩu không đúng",
            });
         }
      } else {
         res.status(400).json({
            message: "Tài khoản không tồn tại",
         });
      }
   } catch (error) {
      res.json(error);
   }
};

const register = async (req, res) => {
   try {
      const { username, password, email } = req.body;
      const findWithUser = await User.findOne({ username });
      const findWithEmail = await User.findOne({ email });
      if (findWithUser || findWithEmail) {
         res.status(400).json({
            message: "Tài khoản hoặc Email đã tồn tại",
         });
      } else {
         const newUser = new User({
            username,
            password,
            email,
         });
         const user = await newUser.save();

         if (user) {
            const rootFolder = new File({
               name: username,
               type: "folder",
               isRoot: true,
               ownerId: user._id,
            });
            await rootFolder.save();

            res.json({
               status: 200,
               message: "Đăng ký thành công",
            });
         } else {
            try {
               if (user && user._id) {
                  await user.delete();
               }
            } catch (error) { }
            res.json({
               status: 500,
               message: "Lỗi hệ thống",
            });
         }
      }
   } catch (error) {
      console.log(error);
      res.json({ status: 500, message: "Lỗi hệ thống" });
   }
};

const getCurrentUser = async (req, res) => {
   try {
      const token = req.headers?.authorization && req.headers.authorization.split(" ")[1];
      try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET);

         let user = await User.findById(decoded._id);
         if (!user) {
            user = await Student.findById(decoded._id);
         }
         if (user) {
            res.json({
               message: "Lấy thông tin cá nhân thành công",
               data: user,
            });
         } else {
            //Không tồn tại
            res.status(404).json({ message: "Không tìm thấy người dùng" });
         }
      } catch (error) {
         console.log(error);
         res.status(401).json({
            message: "Token hết hạn",
            error: error,
         });
      }

   } catch (error) {
      console.log(error);

      res.json({
         status: 500,
         message: "Hệ thống lỗi",
      });
   }
};

const authenticate = (req, res, next) => {
   try {
      let token;
      if (req.headers.authorization) {
         token = req.headers.authorization.split(" ")[1];
      } else {
         res.status(401).json({ message: "Không thể xác minh người dùng" });
      }
      try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         req.user = decoded;
         next();
      } catch (error) {
         res.status(401).json({
            message: "Token hết hạn",
            error: error,
         });
      }
   } catch (error) {
      console.log("authenticate", error);
      res.status(500).json({
         message: "Hệ thống lỗi authen",
      });
   }
};

module.exports = { login, register, getCurrentUser, authenticate };
