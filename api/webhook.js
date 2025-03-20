const express = require("express");
const router = express.Router();

// Webhook verification endpoint
router.get("/", (req, res) => {
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
router.post("/", (req, res) => {
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

module.exports = router;
