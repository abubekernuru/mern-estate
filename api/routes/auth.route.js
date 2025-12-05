const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/auth.controller.js')


router.post('/sign-up', signup);

module.exports = router;