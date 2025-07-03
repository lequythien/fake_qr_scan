const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    keyId: String,
    callbackUrl: String,
});

module.exports = mongoose.model("Client", ClientSchema);