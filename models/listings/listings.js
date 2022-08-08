const mongoose = require("mongoose");
const { Schema } = mongoose;

const listingSchema = new mongoose.Schema({
  yelpID: {
    type: String,
    required: true,
  },

  avgRating: {
    type: Number,
    required: true,
  },

  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review",
  }],

  reviewCount: {
    type: Number,
    required: true,
    default: 0
  },

  saves: [{
    type: Schema.Types.ObjectId,
    ref: "Saves",
  }],

  saveCount: {
    type: Number,
    required: true,
    default: 0
  }
});

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing