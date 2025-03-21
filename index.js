// Load environment variables
require("dotenv").config();

// Express server for handling Instagram webhook and auto-replies
const express = require("express");
const bodyParser = require("body-parser");
const privacyRoutes = require("./routes/privacy");
const webhookRoutes = require("./api/webhook");
const instagramApi = require("./api/webapi");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
// Middleware
app.use(bodyParser.json());

// Use separate routes
app.use("/webhook", webhookRoutes);
app.use("/api", instagramApi);
app.use("/privacy", privacyRoutes);

// Welcome Page
/* app.get("/", (req, res) => {
  res.send("<h1>Welcome to Instagram Webhook API</h1>");
}); */

app.get("/api", (req, res) => {
  res.render("download");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Vercel configuration
module.exports = app;
