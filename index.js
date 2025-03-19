require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Instagram Webhook Verification
app.get("/webhook", (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token === VERIFY_TOKEN) {
        console.log("WEBHOOK VERIFIED ✅");
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Handle Instagram Messages
app.post("/webhook", (req, res) => {
    const body = req.body;

    if (body.object === "instagram") {
        body.entry.forEach((entry) => {
            const message = entry.messaging[0].message.text;
            const senderId = entry.messaging[0].sender.id;

            // Get predefined response
            const replyText = getPredefinedResponse(message);

            // Send the response
            sendInstagramMessage(senderId, replyText);
        });

        res.status(200).send("EVENT_RECEIVED");
    } else {
        res.sendStatus(404);
    }
});

// Function to return predefined responses
function getPredefinedResponse(message) {
    message = message.toLowerCase();

    if (message.includes("hello")) {
        return "Hi there! How can I help you? 😊";
    } else if (message.includes("price")) {
        return "Our product pricing starts at $49.99. Let me know if you need details!";
    } else if (message.includes("support")) {
        return "You can reach our support team at support@example.com.";
    } else {
        return "I'm sorry, I didn't understand that. Can you rephrase?";
    }
}

// Function to send messages to Instagram
function sendInstagramMessage(senderId, message) {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    axios.post(`https://graph.facebook.com/v18.0/me/messages`, {
        recipient: { id: senderId },
        message: { text: message },
    }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    }).then(response => {
        console.log("Message sent:", response.data);
    }).catch(error => {
        console.error("Error sending message:", error.response ? error.response.data : error.message);
    });
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
