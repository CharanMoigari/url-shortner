const os = require("os");
const express = require("express");
const URLModel = require("../models/URL");
const authMiddleware = require("../middleware/auth");
const redisClient = require("../config/redis");

const router = express.Router();

/**
 * CREATE SHORT URL
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const userId = req.userId;

    if (!originalUrl) {
      return res.status(400).json({ error: "Original URL is required" });
    }

    try {
      new URL(originalUrl);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const url = new URLModel({ originalUrl, userId });
    await url.save();

    // Redis cache (safe)
    try {
      if (redisClient.isOpen) {
        await redisClient.set(url.shortId, url.originalUrl, {
          EX: 3600,
        });
      }
    } catch (err) {
      console.log("Redis SET error:", err.message);
    }

    res.status(201).json({
      message: "Short URL created successfully",
      url: {
        id: url._id,
        originalUrl: url.originalUrl,
        shortId: url.shortId,
        shortUrl: `${process.env.BASE_URL || "http://localhost:5000"}/${url.shortId}`,
        createdAt: url.createdAt,
        containerId: os.hostname(),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET ALL URLS
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const urls = await URLModel.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "URLs retrieved successfully",
      count: urls.length,
      urls: urls.map((url) => ({
        id: url._id,
        originalUrl: url.originalUrl,
        shortId: url.shortId,
        shortUrl: `${process.env.BASE_URL || "http://localhost:5000"}/${url.shortId}`,
        clicks: url.clicks,
        createdAt: url.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET SINGLE URL (CACHE HIT/MISS)
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const url = await URLModel.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    if (url.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    let cached = null;
    let cacheHit = false;

    // SAFE REDIS GET
    try {
      if (redisClient.isOpen) {
        cached = await redisClient.get(url.shortId);
        if (cached) cacheHit = true;
      }
    } catch (err) {
      console.log("Redis GET error:", err.message);
    }

    // If miss → set cache
    if (!cacheHit) {
      try {
        if (redisClient.isOpen) {
          await redisClient.set(url.shortId, url.originalUrl, {
            EX: 3600,
          });
        }
      } catch (err) {
        console.log("Redis SET error:", err.message);
      }
    }

    res.status(200).json({
      message: cacheHit
        ? "URL retrieved successfully (CACHE HIT)"
        : "URL retrieved successfully (CACHE MISS)",
      url: {
        id: url._id,
        originalUrl: cacheHit ? cached : url.originalUrl,
        shortId: url.shortId,
        shortUrl: `${process.env.BASE_URL || "http://localhost:5000"}/${url.shortId}`,
        clicks: url.clicks,
        createdAt: url.createdAt,
        containerId: os.hostname(),
        cacheHit,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE URL
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const url = await URLModel.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    if (url.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    try {
      if (redisClient.isOpen) {
        await redisClient.del(url.shortId);
      }
    } catch (err) {
      console.log("Redis DEL error:", err.message);
    }

    await URLModel.deleteOne({ _id: req.params.id });

    res.status(200).json({
      message: "URL deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;