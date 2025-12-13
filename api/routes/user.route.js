const express = require('express');
const router = express.Router();
const { test, updateUser, deleteUser } = require('../controllers/user.controller.js');
const { verifyToken } = require('../utils/verifyToken.js');


router.get('/', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);

module.exports = router;