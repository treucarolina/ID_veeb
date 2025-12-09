const express = require("express");
const router = express.Router();

//kontrollerid
const {
	viljaveduHomePage,
	viljaveduSummary,
	viljaveduAdd,
	viljaveduAddPost} = require("../controllers/viljaveduControllers");

router.route("/").get(viljaveduHomePage);
router.route("/viljavedu").get(viljaveduAdd);
router.route("/viljavedu").post(viljaveduAddPost);
router.route("/summary").get(viljaveduSummary);

module.exports = router;