const express = require("express");
const multer = require("multer");
// üks punkt sama kataloog, kaks punkti läheb routesi kataloogist välja
const loginCheck = require("../src/checklogin");
const router = express.Router();
//kõigile marsruutidele lisan sisselogimise kontrolli vahevara
router.use(loginCheck.isLogin);
const uploader = multer({dest: "./public/newsPhoto/"});

//kontrollerid
const {
	newsHome,
	newsAdd,
	newsAddPost} = require("../controllers/newsControllers");

router.route("/").get(newsHome);
router.route("/uudised_add").get(newsAdd);
router.route("/uudised_add").post(uploader.single("photoInput"), newsAddPost)

module.exports = router;