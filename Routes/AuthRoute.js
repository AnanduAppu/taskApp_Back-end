const express = require('express');
const router = express();
const userControl = require('../Controllers/AuthControll')

router.route("/signup").post(userControl.userSignUp);
router.route("/login").post(userControl.userLogin);
router.route("/useraccess").get(userControl.userAccess);


module.exports = router;