const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("<h1>Privacy Policy</h1><p>We respect your privacy...</p>");
});

module.exports = router;
