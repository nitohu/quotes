require("./db/mongoose")
const settings = require("./settings")
const express = require("express")
const userRouter = require("./routers/user")

const app = express()

// Parse body as JSON
app.use(express.json())

// Add routers
app.use(userRouter)

app.listen(settings.port, () => {
    console.log(`[INFO] Listening on ${settings.port}...`)
})
