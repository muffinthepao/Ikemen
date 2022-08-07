const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review