const settings = require("../settings")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async (req, res, next) => {
    try {
        // Get token, decode it and try to find user
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = jwt.verify(token, settings.secretToken)
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token })

        // No user was found by the given key
        if (!user) {
            throw new Error()
        }
        // Extend request object, continue request
        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.status(401).send({ error: "Please log in to continue." })
    }
}

module.exports = auth
