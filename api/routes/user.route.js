const express = require('express');
const router = express.Router();
const { test } = require('../controllers/user.controller')


router.get('/', test);

module.exports = router;