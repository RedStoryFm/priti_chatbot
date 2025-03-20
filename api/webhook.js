const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

// Webhook verification endpoint
router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook Verified!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook for handling messages
router.post("/", (req, res) => {
  const body = req.body;
  console.log("📩 Received Webhook Event:", JSON.stringify(body, null, 2));

  if (body.object === "instagram") {
    body.entry?.forEach((entry) => {
      if (!entry.messaging || entry.messaging.length === 0) {
        console.warn("⚠️ No messaging event found in entry.");
        return;
      }

      const messageEvent = entry.messaging[0];

      if (!messageEvent.message || !messageEvent.sender) {
        console.warn("⚠️ No valid message or sender in event.");
        return;
      }

      const message = messageEvent.message.text;
      const senderId = messageEvent.sender.id;

      console.log(
        `📨 Received message: "${message}" from sender ID: ${senderId}`
      );

      if (message) {
        let botReply = getBotResponse(message);
        sendMessage(senderId, botReply);
      }
    });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    console.warn("⚠️ Received unknown event type.");
    res.sendStatus(404);
  }
});

// Function to send a message
function sendMessage(senderId, message) {
  const PAGE_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
  const url = `https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

  const response = {
    recipient: { id: senderId },
    message: { text: message },
  };

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response),
  })
    .then((res) => res.json())
    .then((data) => console.log("✅ Message sent:", data))
    .catch((err) => console.error("❌ Error sending message:", err));
}

// Dummy function for bot response
function getBotResponse(userMessage) {
  return "Thanks for your message! 😊"; // Customize as needed
}

module.exports = router;
