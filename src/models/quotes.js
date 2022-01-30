const mongoose = require("mongoose")

const quoteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: "Unknown"
    },
    public: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
})

quoteSchema.pre("save", function (next) {
    this.title = this.title.trim()
    this.author = this.author.trim()

    next()
})

quoteSchema.methods.toString = function () {
    return this.title + "\n\t- " + this.author
}

quoteSchema.statics.isValid = function(obj) {
    const allowedFields = ["title", "author", "public"]
    const fields = Object.keys(obj)

    return fields.every((field) => allowedFields.includes(field))
}

const Quote = mongoose.model("Quote", quoteSchema)

module.exports = Quote
