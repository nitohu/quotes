const express = require("express")
const auth = require("../middleware/auth")
const User = require("../models/user")
const Quotes = require("../models/quotes")

const router = new express.Router()

// Create new users
router.post("/users", async (req, res) => {
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
// Update profile
router.patch("/users/me", auth, async (req, res) => {
    if (!User.isValid(req.body)) {
        return res.status(400).send({error: "Invalid request."})
    }

    const fields = Object.keys(req.body)
    try {
        fields.forEach((field) => req.user[field] = req.body[field])
        console.log(req.user)
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        console.info(e.message)
        res.status(400).send({ error: e._message })
    }
})
// Delete profile
router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.delete()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e._message)
    }
})

module.exports = router
