const express = require('express');
const DefaultRouter = require("./src/modules/default/routes")
const dotenv = require("dotenv")
const logger = require("morgan")
const cors = require("cors")
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(logger("dev"))
app.use(cors())//configure as needed
app.use(express.urlencoded({ extended: true }));

app.use("/", DefaultRouter)

app.listen(PORT, () => {
	console.log(`Server running on port :::->${PORT}`);

})
