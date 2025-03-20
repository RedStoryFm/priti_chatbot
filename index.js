// Load environment variables
require("dotenv").config();

// Express server for handling Instagram webhook and auto-replies
const express = require("express");
const bodyParser = require("body-parser");
const privacyRoutes = require("./routes/privacy");
const webhookRoutes = require("./api/webhook");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Use separate routes
app.use("/webhook", webhookRoutes);
app.use("/privacy", privacyRoutes);

// Welcome Page
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Instagram Webhook API</h1>");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Vercel configuration
module.exports = app;
