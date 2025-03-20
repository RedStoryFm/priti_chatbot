// Load environment variables
require("dotenv").config();

// Express server for handling Instagram webhook and auto-replies
const express = require("express");
const bodyParser = require("body-parser");
const privacyRoutes = require("./routes/privacy");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Webhook verification endpoint
app.get("/webhook", (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    
    if (mode && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Webhook for handling messages
app.post("/webhook", (req, res) => {
    const body = req.body;
    
    if (body.object === "instagram") {
        body.entry.forEach(entry => {
            const messaging = entry.messaging[0];
            if (messaging && messaging.message) {
                console.log("Received Message:", messaging.message);
                // Here you can integrate auto-reply logic
            }
        });
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// Use separate route for Privacy Page
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
