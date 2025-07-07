const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    transactionId: String,
    status: {
        type: String,
        enum: ["pending", "success", "failed", "scanned"],
        default: "pending"
    },
    amount: {
        type: Number,
        required: true
    },
    clientKeyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);