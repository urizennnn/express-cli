import express from "express"
import "dotenv/config"
import cors from "cors"
import logger from "morgan"
import defaultRouter from "./src/module/default/routes"

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api", defaultRouter)

app.listen(PORT, () => {
	console.log(`Server running on port :::->${PORT}`);

})
