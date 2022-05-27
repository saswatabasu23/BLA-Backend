const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const cloudinary = require("cloudinary");
require('dotenv').config();



async function signUp(req, res, next) {
    const {
        name,
        email,
        regno,
        password,
        phone,
        image
    } = req.body;
    try {
        const user = await User.findOne({
            regno,
        });
        if (user) {
            return res.status(400).send({
                message: "User Already Exists!",
            });
        }

        //setup cloudinary with api key and secret
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });


        //upload image to cloudinary and get cloudinary url
        const result = await cloudinary.v2.uploader.upload(image);
        const imageUrl = result.secure_url;

        const newUser = new User({
            name,
            email,
            regno,
            password,
            phone,
            image: imageUrl,
        });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();
        res.status(200).send({
            message: "User Created Successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message,
        });
    }
}


async function login(req, res, next) {
    const {
        regno,
        password,
    } = req.body;
    try {
        const user = await User.findOne({
            regno,
        });
        if (!user) {
            return res.status(400).send({
                message: "User Not Found!",
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({
                message: "Invalid Password!",
            });
        }
        const token = jwt.sign({
            _id: user._id,
            name: user.name,
            email: user.email,
            regno: user.regno,
            phone: user.phone,
        }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.status(200).send({
            message: "Login Successful!",
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message,
        });
    }
}

async function getUser(req, res, next) {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message,
        });
    }
}

async function updateUser(req, res, next) {
    const {
        name,
        email,
        regno,
        password,
        phone,
        image
    } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).send({
                message: "User Not Found!",
            });
        }

        user.name = name;
        user.email = email;
        user.regno = regno;
        user.phone = phone;

        if (image) {
            //setup cloudinary with api key and secret
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });

            //upload image to cloudinary and get cloudinary url
            const result = await cloudinary.v2.uploader.upload(image);
            const imageUrl = result.secure_url;


            user.image = imageUrl;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        await user.save();
        res.status(200).send({
            message: "User Updated Successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message,
        });
    }
}

async function forgotPassword(req, res, next) {
    const {
        email,
    } = req.body;
    try {
        const user = await User.findOne({
            email,
        });
        if (!user) {
            return res.status(400).send({
                message: "User Not Found!",
            });
        }
        const token = jwt.sign({
            _id: user._id,
        }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        await user.save();
        res.status(200).send({
            message: "Password Reset Link Sent!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message,
        });
    }
}

module.exports = {
    signUp,
    login,
    getUser,
    updateUser,
    forgotPassword,
};