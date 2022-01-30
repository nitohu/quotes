const settings = require("../settings")
const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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
    }]
})

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8)
    }

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

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel