const express = require("express")
const auth = require("../middleware/auth")
const Quotes = require("../models/quotes")

const router = new express.Router()

const buildOptions = (request, sortBy = true) => {
    const sort = {}
    if (sortBy) {
        if (request.query.sortBy) {
            const params = request.query.sortBy.split("_") // 0: field, 1: (desc -> -1| asc -> 1)
            sort[params[0]] = params[1] === "desc" ? -1 : 1
        }
    }
    const options = {
        limit: parseInt(request.query.limit),
        skip: parseInt(request.query.skip),
        sort
    }
    return options
}

// Get public quotes
// GET /quotes/public[?limit=<int>][?skip=<int>]
router.get("/quotes/public", async (req, res) => {
    const options = buildOptions(req, false)

    const quotes = await Quotes.find({ public: true }, {}, options)

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
// GET /quotes[?limit=<int>][?skip=<int>]
// GET /quotes[?sortBy=<field>_<asc|desc>] (e.g.: /quotes?sortBy=createdAt_asc)
router.get("/quotes", auth, async (req, res) => {
    const options = buildOptions(req)
    const quotes = await Quotes.find({ user: req.user._id }, {}, options)

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
