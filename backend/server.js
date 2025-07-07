const express = require("express");
const http = require("http");
const path = require("path");
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");

const clientRoute = require("./route/clientRoute");
const authRoute = require("./route/authRoute");
const qrcodeRoute = require("./route/qrcodeRoute");

const { init } = require("./socket/socketInstance");

const app = express();
const server = http.createServer(app);
const io = init(server);
require("./socket/socket")(io);

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// Routes
app.use("/api/clients", clientRoute);
app.use("/api/auth", authRoute);
app.use("/api/qrcode", qrcodeRoute);

// Uncomment if serving static files (e.g., for a frontend build)
// const staticPath = path.join(__dirname);
// app.use(express.static(staticPath));

// Start server
const PORT = process.env.PORT || 8001;
server.listen(PORT, () => {
  console.log(`✅ Server + Socket.IO đang chạy tại: http://localhost:${PORT}`);
});
