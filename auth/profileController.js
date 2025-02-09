const Student = require("../models/Student.js");

const changeAvatar = async (req, res) => {
    try {
        const userId = req.user._id;
        const { avatar } = req.body;
        console.log(avatar);


        const user = await Student.findByIdAndUpdate(userId, { avatar }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "Tài khoản không tồn tại" });
        }

        res.json({ message: "Đổi ảnh đại diện thành công", data: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "L��i server" });
    }
}

const getAllAvatars = async (req, res) => {
    return res.json({
        message: "Lấy tất cả ảnh đại diện thành công",
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(a => `/public/avatar/${a}.jpg`)
    })
}

module.exports = { changeAvatar, getAllAvatars };