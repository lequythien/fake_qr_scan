const Client = require("../models/Client");
const Payment = require("../models/Payment");
const QRCode = require("qrcode"); 

const generateQRCode = (req, res) => {
    const { clientKeyId, amount } = req.body;

    if (typeof amount !== "number" || amount < 0) {
        return res.status(400).json({ message: "Invalid amount" })
    }

    Client.findById(clientKeyId)
        .then(client => {
            if (!client) {
                return res.status(404).json({ message: "Client ID not found" })
            }
            return Payment.create({
                clientKeyId,
                amount,
                status: "pending",
            })
                .then(payment => {
                    const qrData = JSON.stringify({
                        paymentId: payment._id,
                        amount,
                        client: client.name,
                    });
                    return QRCode.toDataURL(qrData)
                        .then(qrCodeImage => {
                            res.json({
                                paymentId: payment._id,
                                qrCode: qrCodeImage,
                                status: payment.status,
                            })
                        })
                })
        })
        .catch(error => {
            console.error("QR code error:", error);
            res.status(500).json({ message: "Lỗi tạo QR code." });
        });
}


module.exports = { generateQRCode };