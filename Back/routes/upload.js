// routes/upload.js
const express = require("express");
const multer = require("multer");
const cloudinary = require("../cloudinary.js");
const { Readable } = require("stream");
const User = require("../models/User");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const buffer = req.file.buffer;

    const stream = cloudinary.uploader.upload_stream(
      { folder: "profiles" },
      async (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          return res.status(500).json({ error: error.message });
        }

        try {
          const imageUrl = result.secure_url;
          const user = await User.findByPk(id);

          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }

          user.imageurl = imageUrl;
          await user.save();

          res.json({ url: imageUrl });
        } catch (dbError) {
          console.error("❌ DB error:", dbError);
          res.status(500).json({ error: dbError.message });
        }
      },
    );

    Readable.from(buffer).pipe(stream);
  } catch (outerError) {
    console.error("❌ Outer try-catch error:", outerError);
    res.status(500).json({ error: outerError.message });
  }
});

module.exports = router;
