const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  callbackUrl: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Client", clientSchema);
