const mongoose = require("mongoose");
const { Schema } = mongoose;

const saveSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  yelpID: {
    type: String,
    required: true
  },

},
{timestamps: true}

);

const Save = mongoose.model('Save', saveSchema)

module.exports = Save