const express = require('express');
const router = express.Router();

const { generateQRCode,scanQRCode } = require('../controller/QRCodeService');

router.post('/generate', generateQRCode);

router.get('/scan/:paymentId', scanQRCode);

module.exports = router;