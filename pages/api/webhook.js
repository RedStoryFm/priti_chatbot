import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { getBotResponse } from "../../utils/responses.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Webhook Verification
app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook Verified!");
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Handling Messages
app.post("/webhook", (req, res) => {
    let body = req.body;

    if (body.object === "instagram") {
        body.entry.forEach(entry => {
            let message = entry.messaging[0]?.message?.text;
            let senderId = entry.messaging[0]?.sender?.id;

            if (message) {
                let botReply = getBotResponse(message); // Use predefined responses
                sendMessage(senderId, botReply);
            }
        });

        res.status(200).send("EVENT_RECEIVED");
    } else {
        res.sendStatus(404);
    }
});

function sendMessage(senderId, message) {
    const PAGE_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
    const url = `https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

    const response = {
        recipient: { id: senderId },
        message: { text: message }
    };

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response)
    })
    .then(res => res.json())
    .then(data => console.log("Message sent:", data))
    .catch(err => console.error("Error sending message:", err));
}

export default app;
