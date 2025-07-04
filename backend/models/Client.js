const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    callbackUrl: String,
});

module.exports = mongoose.model("Client", ClientSchema);