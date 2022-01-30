const settings = require("../settings")
const mongoose = require("mongoose")

const dbUrl = process.env.db_url || settings.dbUrl

mongoose.connect(dbUrl)
