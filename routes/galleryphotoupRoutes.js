const express = require("express");
const multer = require("multer");
const loginCheck = require("../src/checklogin");

const router = express.Router();
//kأµigile marsruutidele lisan sisselogimise kontrolli vahevara
router.use(loginCheck.isLogin);
//seadistame vahevara fotode أ¼leslaadimiseks kindlasse kataloogi
const uploader = multer({dest: "./public/gallery/orig/"});

//kontrollerid
const {
	galleryphotoupPage,
	galleryphotoupPagePost} = require("../controllers/galleryphotoupControllers");

router.route("/").get(galleryphotoupPage);
router.route("/").post(uploader.single("photoInput"), galleryphotoupPagePost);

module.exports = router;