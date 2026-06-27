const express = require('express')
const cors = require("cors")
const authRoutes = require("./routes/auth.routes")
const clientRoutes = require("./routes/client.routes")


const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/clients", clientRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT)

