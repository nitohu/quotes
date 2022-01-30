const express = require("express")
const auth = require("../middleware/auth")
const User = require("../models/user")
const Quotes = require("../models/quotes")

const router = new express.Router()

// Create new users
router.post("/users/", async (req, res) => {
    const validFields = ["username", "email", "password"]
    const fields = Object.keys(req.body)
    const isValid = fields.every((field) => validFields.includes(field))

    if (!isValid) {
        return res.status(400).send({error: "Invalid fields used."})
    }

    try {
        const user = new User(req.body)
        const token = await user.generateAuthToken()

        await user.save()

        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send({ error: e._message })
    }
})
// Show profile
router.get("/users/me", auth, async (req, res) => {
    const quotes = await Quotes.find({ user: req.user._id })
    const data = req.user.toJSON()
    data.quotes = quotes

    res.send(data)
})

module.exports = router
