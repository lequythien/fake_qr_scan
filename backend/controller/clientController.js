const Client = require('../models/Client');
const { v4: uuidv4 } = require('uuid');

const createClient = (req, res) => {
    const { callbackUrl } = req.body;
    if (!callbackUrl) {
        return res.tatus(400).json({
            message: "URl bắt buộc"
        })
    }
    new Client({ keyId: uuidv4(), callbackUrl }).save()
        .then(({ keyId, callbackUrl }) => {
            res.status(201).json({
                message: "Tạo client thành công",
                client: { keyId, callbackUrl }
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Lỗi khi tạo client",
                error: err.message
            });
        });
}

module.exports = {
    createClient
};