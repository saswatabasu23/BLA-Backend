const jwt = require("jsonwebtoken")
require('dotenv/config')
const User = require("../models/user")

//check admin with jwt check and isAdmin boolean check
async function isAdmin(req, res, next) {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decoded._id,
            isAdmin: true
        });
        if (!user) {
            return res.status(401).send({
                message: "Not Authorized!"
            });
        }
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        });
    }
}

module.exports = {
    isAdmin
};