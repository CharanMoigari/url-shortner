const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(url) {
        try {
          new URL(url);
          return true;
        } catch (error) {
          return false;
        }
      },
      message: 'Invalid URL format'
    }
  },
  shortId: {
    type: String,
    required: true,
    unique: true,
    default: () => nanoid(8)
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('URL', urlSchema);
