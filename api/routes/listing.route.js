const express = require('express');
const { verifyToken } = require('../utils/verifyToken');
const {createListing} = require('../controllers/listing.controller.js')
const router = express.Router();

router.post('/create', verifyToken, createListing);

module.exports = router;