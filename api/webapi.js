const express = require("express");
const router = express.Router();
const { instagramGetUrl } = require("instagram-url-direct");
const axios = require("axios");

router.get("/download", async (req, res) => {
  const instagramUrl = req.query.url;
  if (!instagramUrl) {
    return res.status(400).send("Missing url parameter");
  }
  try {
    const data = await instagramGetUrl(instagramUrl);
    if (data.results_number === 0) {
      return res.status(404).send("No media found");
    }
    const directUrl = data.url_list[0];
    const mediaType = data.media_details[0].type;
    let extension = mediaType === "video" ? "mp4" : "jpg";
    let filename = `${data.post_info.owner_username}.${extension}`;
    res.set("Content-Disposition", `attachment; filename="${filename}"`);
    const response = await axios.get(directUrl, { responseType: "stream" });
    response.data.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error downloading media");
  }
});

module.exports = router;
