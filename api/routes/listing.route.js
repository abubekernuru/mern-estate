const express = require('express');
const { verifyToken } = require('../utils/verifyToken');
const {createListing, deleteListing, updateListing} = require('../controllers/listing.controller.js')
const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);

module.exports = router;