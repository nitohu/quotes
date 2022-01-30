const express = require("express")
const auth = require("../middleware/auth")
const User = require("../models/user")

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
    res.send(req.user)
    console.log(req.user)
})

module.exports = router
