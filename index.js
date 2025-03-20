const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Index Route
app.get("/", (req, res) => {
  res.send("Welcome to My Node.js Webhook App!");
});

// Webhook Route
app.post("/webhook", (req, res) => {
  console.log("Webhook Received:", req.body);
  res.json({ message: "Webhook received successfully", data: req.body });
});

// Start server locally
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = app; // Export for Vercel
