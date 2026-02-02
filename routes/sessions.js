


const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controller/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/current', passport.authenticate('jwt', { session: false }), authController.currentUser);

module.exports = router;