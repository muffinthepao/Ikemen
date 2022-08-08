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

  reviewCount: {
    type: Number,
    required: true,
  },

  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review",
  }],
});

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing