const express = require('express');
const AdminController = require('./../controller/account_controller');
const router = express.Router();
//Signup request
router.post('/signup', AdminController.registration);
router.post('/signin', AdminController.signin);
router.get('/genpwd/:pwd', AdminController.genPwd);
router.get('/genpwds', AdminController.generateUserCredentials);

module.exports = router;