const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    regno: {
        type: String,
        required: true,
        unique: [true, "Registration Number Already Exists!"],
        validate: [
            function (v) {
                var re = /^[2][01][A-Z][A-Z][A-Z]\d{4}$/;
                return re.test(v);
            },
            "Please enter a valid VIT Register Number",
        ],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    phone: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("User", userSchema);