const express = require("express");
const router = express.Router();
const multer = require("multer");
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