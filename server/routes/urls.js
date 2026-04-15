const os = require("os");
const express = require("express");
const URLModel = require("../models/URL");
const authMiddleware = require("../middleware/auth");
const redisClient = require("../config/redis");

const router = express.Router();

/**
 * =====================
 * CREATE SHORT URL
 * =====================
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const userId = req.userId;

    if (!originalUrl) {
      return res.status(400).json({ error: "Original URL is required" });
    }

    // Validate URL
    try {
      new URL(originalUrl);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const url = new URLModel({
      originalUrl,
      userId,
    });

    await url.save();

    // 🔥 Cache in Redis
    await redisClient.set(url.shortId, url.originalUrl, {
      EX: 3600,
    });

    res.status(201).json({
      message: "Short URL created successfully",
      url: {
        id: url._id,
        originalUrl: url.originalUrl,
        shortId: url.shortId,
        shortUrl: `${
          process.env.SHORTURL || "http://localhost:5000"
        }/r/${url.shortId}`,   // ✅ FIXED
        createdAt: url.createdAt,
        containerId: os.hostname(),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * =====================
 * GET ALL URLS
 * =====================
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const urls = await URLModel.find({ userId }).sort({ createdAt: -1 });

    const response = await Promise.all(
      urls.map(async (url) => {
        const cached = await redisClient.get(url.shortId);

        return {
          id: url._id,
          originalUrl: url.originalUrl,
          shortId: url.shortId,
          shortUrl: `${process.env.BASE_URL}/${url.shortId}`,
          clicks: url.clicks,
          createdAt: url.createdAt,

          // 🔥 CACHE INFO ONLY
          cacheHit: cached ? true : false
        };
      })
    );

    res.status(200).json({
      message: "URLs retrieved successfully",
      count: response.length,
      urls: response
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * =====================
 * GET SINGLE URL (REDIS CACHE)
 * =====================
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

    // 🔥 Check Redis
    const cached = await redisClient.get(url.shortId);

    if (cached) {
      return res.status(200).json({
        message: "URL retrieved successfully (CACHE HIT)",
        url: {
          id: url._id,
          originalUrl: cached,
          shortId: url.shortId,
          shortUrl: `${
            process.env.SHORTURL || "http://localhost:5000"
          }/r/${url.shortId}`,   // ✅ FIXED
          clicks: url.clicks,
          createdAt: url.createdAt,
          containerId: os.hostname(),
          cacheHit: true,
        },
      });
    }

    // 🔥 Cache miss → store
    await redisClient.set(url.shortId, url.originalUrl, {
      EX: 3600,
    });

    res.status(200).json({
      message: "URL retrieved successfully (CACHE MISS)",
      url: {
        id: url._id,
        originalUrl: url.originalUrl,
        shortId: url.shortId,
        shortUrl: `${
          process.env.SHORTURL || "http://localhost:5000"
        }/r/${url.shortId}`,   // ✅ FIXED
        clicks: url.clicks,
        createdAt: url.createdAt,
        containerId: os.hostname(),
        cacheHit: false,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * =====================
 * DELETE URL
 * =====================
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

    // 🔥 Remove from Redis
    await redisClient.del(url.shortId);

    await URLModel.deleteOne({ _id: req.params.id });

    res.status(200).json({
      message: "URL deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;