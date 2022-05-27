const blog = require("../models/blog");
const cloudinary = require("cloudinary");
require('dotenv').config();

async function createBlog(req, res, next) {
    try {
        const {
            title,
            content,
            author,
            image,
            category,
        } = req.body;

        //setup cloudinary with api key and secret
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        //upload image to cloudinary and get cloudinary url
        const result = await cloudinary.v2.uploader.upload(image);
        const imageUrl = result.secure_url;

        const newBlog = new blog({
            title,
            content,
            author,
            image: imageUrl,
            category,
        });
        await newBlog.save();
        res.status(200).send({
            message: "Blog Created Successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message,
        });
    }
}

async function getBlogs(req, res, next) {
    try {
        const blogs = await blog.find();
        res.status(200).send(blogs);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message,
        });
    }
}

async function getBlog(req, res, next) {
    try {
        const blog = await blog.findById(req.params.id);
        res.status(200).send(blog);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message,
        });
    }
}


async function updateBlog(req, res, next) {
    try {
        const {
            title,
            content,
            author,
            image,
            category,
        } = req.body;

        //setup cloudinary with api key and secret
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        //upload image to cloudinary and get cloudinary url
        const result = await cloudinary.v2.uploader.upload(image);
        const imageUrl = result.secure_url;

        const updatedBlog = await blog.findByIdAndUpdate(req.params.id, {
            title,
            content,
            author,
            image: imageUrl,
            category,
        });
        res.status(200).send({
            message: "Blog Updated Successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message,
        });
    }
}


async function deleteBlog(req, res, next) {
    try {
        await blog.findByIdAndDelete(req.params.id);
        res.status(200).send({
            message: "Blog Deleted Successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message,
        });
    }
}


module.exports = {
    createBlog,
    getBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
};