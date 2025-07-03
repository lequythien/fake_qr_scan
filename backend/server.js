const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

const clientRoute = require("./route/clientRoute");

const app = express();

// Connect to MongoDB
connectDB();
app.use(express.json());
app.use("/api/clients", clientRoute);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});