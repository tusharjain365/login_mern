const express=require('express');
const router=express.Router();
const Controller=require("../controller/appController");
const {auth,localVariables}=require("../middleware/auth");
const registerMail=require("../controller/mailer");

//post methods
router.route("/register").post(Controller.register)
// route to send email when user registered.
router.route('/registerMail').post(registerMail);
router.route('/login').post(Controller.verifyUser, Controller.login)
router.route('/authenticate').post(Controller.verifyUser,(req,res)=> res.end());

//get methods
router.route("/user/:username").get(Controller.getUser);
router.route("/generateOTP").get(Controller.verifyUser,localVariables,Controller.generateOTP);
router.route("/verifyOTP").get(Controller.verifyUser,Controller.verifyOTP);
router.route("/createResetSession").get(Controller.createResetSession);

//put methods
router.route("/updateuser").put(auth,Controller.updateUser);
router.route("/resetPassword").put(Controller.verifyUser,Controller.resetPassword);

module.exports=router