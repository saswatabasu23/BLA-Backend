const jwt = require("jsonwebtoken")
require('dotenv/config')
const User = require("../models/user")

//check jtw auth
async function checkAuth(req, res, next) {
    try {
        const token = req.header("auth-token").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decoded._id
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
    checkAuth
};