const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        fullname: { type: String, required: true },
        password: { type: String, required: true },
        avatar: { type: String },
        career: { type: Number, default: 2 },
        birthday: { type: Date, default: new Date() },
        male: { type: Boolean, default: false },
        phone: { type: String }
    },
    { timestamps: true }
);

module.exports = mongoose.model("students", StudentSchema);
