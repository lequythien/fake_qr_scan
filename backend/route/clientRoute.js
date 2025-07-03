const express = require('express');
const router = express.Router();

const { createClient } = require('../controller/clientcontroller');

router.post('/create', createClient);

module.exports = router;