const express = require("express");
const router = express.Router();
const multer = require("multer");

//kontrollerid
const {
	newsHome,
	newsAdd,
	newsAddPost} = require("../controllers/newsControllers");

router.route("/").get(newsHome);
router.route("/uudised_add").get(newsAdd);
router.route("/uudised_add").post(newsAddPost)

module.exports = router;