const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// OpenAI API for chatbot response
async function getChatbotResponse(message) {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4",
        messages: [{ role: "user", content: message }],
    }, {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }
    });
    return response.data.choices[0].message.content;
}

// Webhook verification (Step 5)
app.get("/webhook", (req, res) => {
    if (req.query["hub.verify_token"] === VERIFY_TOKEN) {
        res.send(req.query["hub.challenge"]);
    } else {
        res.send("Verification failed.");
    }
});

// Handle Instagram messages
app.post("/webhook", async (req, res) => {
    let body = req.body;

    if (body.object === "instagram") {
        body.entry.forEach(async (entry) => {
            let messaging = entry.messaging[0];
            let senderId = messaging.sender.id;
            let userMessage = messaging.message.text;

            let botReply = await getChatbotResponse(userMessage);
            await sendInstagramMessage(senderId, botReply);
        });

        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// Send message to Instagram
async function sendInstagramMessage(recipientId, message) {
    await axios.post(`https://graph.facebook.com/v18.0/me/messages`, {
        recipient: { id: recipientId },
        message: { text: message }
    }, {
        params: { access_token: INSTAGRAM_ACCESS_TOKEN }
    });
}

app.listen(3000, () => console.log("Chatbot running on port 3000"));
