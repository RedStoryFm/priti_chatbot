const express = require("express");
const fetch = require("node-fetch"); // Ensure fetch is available
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

  if (body.object === "instagram") {
    body.entry?.forEach((entry) => {
      let message = entry.messaging[0]?.message?.text;
      let senderId = entry.messaging[0]?.sender?.id;
      if (entry.messaging && entry.messaging.length > 0) {
        const messageEvent = entry.messaging[0];
        const message = messageEvent?.message?.text;
        const senderId = messageEvent?.sender?.id;

        if (message) {
          let botReply = getBotResponse(message); // Use predefined responses
          sendMessage(senderId, botReply);
        }
      }
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    console.warn("Invalid webhook event received.");
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
    .then((data) => console.log("Message sent:", data))
    .catch((err) => console.error("Error sending message:", err));
}

// Dummy function for bot response
function getBotResponse(userMessage) {
  return "Thanks for your message! 😊"; // Customize as needed
}
module.exports = router;
