const express = require("express");
const router = express.Router();

//kontrollerid
const {
	newsHome,
	newsAdd,
	newsAddPost} = require("../controllers/newsControllers");

router.route("/").get(newsHome);

module.exports = router;