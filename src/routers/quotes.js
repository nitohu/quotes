const express = require("express")
const auth = require("../middleware/auth")
const Quotes = require("../models/quotes")

const router = new express.Router()

// Get public quotes
router.get("/quotes/public", async (req, res) => {
    const quotes = await Quotes.find({ public: true })

    res.send(quotes)
})
// Get random public quote
router.get("/quotes/public/random", async (req, res) => {
    const quotes = await Quotes.find({ public: true })
    const index = Math.floor(Math.random() * quotes.length)

    console.log(`Random quote ${index} : ${quotes[index].title}`)

    res.send(quotes[index])
})

// Get all quotes of user
router.get("/quotes", auth, async (req, res) => {
    const quotes = await Quotes.find({ user: req.user._id })

    res.send(quotes)
})
// Create quotes
router.post("/quotes", auth, async (req, res) => {
    if (!Quotes.isValid(req.body)) {
        return res.status(400).send({error: "Invalid fields."})
    }

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
// Update quotes
router.patch("/quotes/:id", auth, async (req, res) => {
    const quote = await Quotes.findOne({ _id: req.params.id, user: req.user._id })
    if (!Quotes.isValid(req.body)) {
        return res.status(400).send({error: "Invalid fields."})
    }

    try {
        Object.keys(req.body).forEach((field) => quote[field] = req.body[field])
        await quote.save()

        res.status(200).send(quote)
    } catch (e) {
        res.status(400).send(e)
    }
})
// Delete quotes
router.delete("/quotes/:id", auth, async (req, res) => {
    const quote = await Quotes.deleteOne({ _id: req.params.id, user: req.user._id })

    if (!quote) {
        return res.status(404).send({error: "No quote found."})
    }
    res.send(quote)
})

module.exports = router
