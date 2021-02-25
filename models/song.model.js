const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const songSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
  },
  artist: {
    type: String,
    required: true,
    minlength: 1,
  },
});

const Song = mongoose.model("Song", songSchema);
module.exports = Song;

