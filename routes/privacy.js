const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send(`
        <h1>Privacy Policy</h1>
        <p>Last updated: March 2025</p>
        <p>This Privacy Policy describes how we collect, use, and protect your information.</p>

        <h2>Information We Collect</h2>
        <p>We collect basic information such as your messages when you interact with our automated Instagram chatbot.</p>

        <h2>How We Use Your Information</h2>
        <ul>
            <li>To provide automated responses to your Instagram messages.</li>
            <li>To improve user experience and optimize responses.</li>
        </ul>

        <h2>Data Protection</h2>
        <p>We do not store or share your personal data. All messages are processed in real-time and are not saved.</p>

        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, you can contact us at: <strong>your@email.com</strong></p>
    `);
});
