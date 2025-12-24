const express = require('express');
const router = express.Router();
const { test, updateUser, deleteUser, getUserListings, getUser } = require('../controllers/user.controller.js');
const { verifyToken } = require('../utils/verifyToken.js');


router.get('/', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);
router.get('/:id', verifyToken, getUser);

module.exports = router;