const express = require('express');
const router = express.Router();
const { test, updateUser } = require('../controllers/user.controller.js');
const { verifyToken } = require('../utils/verifyToken.js');


router.get('/', test);
router.post('/update/:id', verifyToken, updateUser)

module.exports = router;