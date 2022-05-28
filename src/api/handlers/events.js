const Event = require("../models/event");
const cloudinary = require("cloudinary");
require('dotenv').config();

//create event
async function createEvent(req, res, next) {
    try {
        const {
            name,
            description,
            date,
            image,
            time,
            venue,
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

        const newEvent = new Event({
            name,
            des,
            date,
            image: imageUrl,
            time,
            venue,
            category,
        });
        await newEvent.save();
        res.status(200).send({
            message: "Event Created Successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message,
        });
    }
}

//get all events
async function getEvents(req, res, next) {
    try {
        const events = await Event.find();
        res.status(200).send(events);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message,
        });
    }
}

//get event by id
async function getEvent(req, res, next) {
    try {
        const event = await Event.findById(req.params.id);
        res.status(200).send(event);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message,
        });
    }
}

//update event
async function updateEvent(req, res, next) {
    try {
        const {
            name,
            description,
            date,
            image,
            time,
            venue,
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

        const newEvent = new Event({
            name,
            description,
            date,
            image: imageUrl,
            time,
            venue,
            category,
        });
        await newEvent.save();
        res.status(200).send({
            message: "Event Created Successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message,
        });
    }
}

//delete event
async function deleteEvent(req, res, next) {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).send({
            message: "Event Deleted Successfully!",
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message,
        });
    }
}

module.exports = {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
};