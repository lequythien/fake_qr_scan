const express = require('express');
const router = express.Router();

const { generateQRCode } = require('../controller/QRCodeService');

router.post('/generate', generateQRCode);

module.exports = router;