const express = require("express")
const auth = require("../middleware/auth")
const Quotes = require("../models/quotes")

const router = new express.Router()

// Get public quotes
router.get("/quotes/public", async (req, res) => {
    const quotes = await Quotes.find({ public: true })

    res.send(quotes)
})

// Create quotes
router.post("/quotes", auth, async (req, res) => {
    const quote = new Quotes({
        ...req.body,
        user: req.user._id
    })

    try {
        await quote.save()
        res.status(201).send(quote)
    } catch (e) {
        res.status(400).send({error: e.message})
    }
})
// Get all quotes of user
router.get("/quotes", auth, async (req, res) => {
    const quotes = await Quotes.find({ user: req.user._id })

    res.send(quotes)
})

module.exports = router
