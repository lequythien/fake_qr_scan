const mongoose = require('mongoose');

const PendingPaymentSchema = new mongoose.Schema({
    transactionId: String,
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    clientKeyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

})

module.exports = mongoose.model("PendingPayment", PendingPaymentSchema);