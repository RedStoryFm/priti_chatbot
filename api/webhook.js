// Load environment variables
require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const https = require("https");

const router = express.Router();
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;

const agent = new https.Agent({
  rejectUnauthorized: false, // Ignore self-signed certificates
});

// ✅ Webhook verification for Instagram
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook Verified!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ Handle incoming messages from Instagram
router.post("/", async (req, res) => {
  const body = req.body;

  if (body.object === "instagram") {
    body.entry.forEach((entry) => {
      entry.messaging.forEach(async (messaging) => {
        // Ignore messages sent by the bot itself (echo messages)
        if (messaging.message && !messaging.message.is_echo) {
          const senderId = messaging.sender.id;
          const receivedMessage = messaging.message.text;

          console.log(
            "💬 Received Message:",
            receivedMessage + "SenderId:",
            senderId
          );
          // Auto-reply logic
          const replyMessage = `Thanks for your message! 😊 ${receivedMessage}`;
          await sendMessage(senderId, replyMessage);
        }
      });
    });

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// ✅ Function to send a message via Instagram API
async function sendMessage(recipientId, messageText) {
  const postData = JSON.stringify({
    recipient: { id: recipientId },
    message: { text: messageText },
  });

  const options = {
    hostname: "graph.facebook.com",
    path: `/v22.0/me/messages`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "Content-Length": postData.length,
    },
  };

  const req = https.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("📨 Message Sent Successfully:", JSON.parse(data));
    });
  });

  req.on("error", (error) => {
    console.error("❌ Request Error:", error);
  });

  req.write(postData);
  req.end();

  /*   const url = `https://graph.instagram.com/v21.0/me/messages?access_token=${ACCESS_TOKEN}`;

  const messageData = {
    recipient: { id: recipientId },
    message: { text: messageText },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData),
      /*  agent: agent, */ // Allow self-signed certificates
  /* });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Message Sent Successfully:", data);
    } else {
      console.error("❌ Error Sending Message:", data);
    }
  } catch (error) {
    console.error("❌ Error sending message:", error);
  } */
}

module.exports = router;
