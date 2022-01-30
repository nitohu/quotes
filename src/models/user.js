const settings = require("../settings")
const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Quotes = require("./quotes")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("Please enter a valid E-Mail.")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        validate(val) {
            if (val.toLowerCase().includes("password")) {
                throw new Error("The password should not include the word password.")
            }
        }
    },
    tokens: [{
        token: {
            type: String
        }
    }],
    quotes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quote"
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function(next) {
    this.username = this.username.trim()
    this.email = this.email.trim()

    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})
userSchema.pre("remove", async function (next) {
    const res = await Quotes.deleteMany({ user: this._id })
    console.log(`Deleted quotes: ${ res.deletedCount }`)
    next()
})

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, settings.secretToken)

    this.tokens = this.tokens.concat({ token })
    await this.save()

    return token
}
userSchema.methods.toJSON = function () {
    let user = this.toObject()

    delete user.tokens
    delete user.password

    return user
}

userSchema.statics.isValid = (obj) => {
    const allowedFields = ["username", "email", "password"]
    const fields = Object.keys(obj)
    return fields.every((field) => allowedFields.includes(field))
}
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await UserModel.findOne({ email: email })
    if (!user) {
        throw new Error("Error while logging in.")
    }
    const isMatch = bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("Error while logging in.")
    }
    return user
}

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel
