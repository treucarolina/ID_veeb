const express = require("express");
const router = express.Router();

//kontrollerid
const {
	viljaveduHomePage,
	viljaveduSummary,
	viljaveduAdd,
	viljaveduAddPost,
	viljaveduValitud,
	viljaveduMassita,
	viljaveduMassitaPost} = require("../controllers/viljaveduControllers");

router.route("/").get(viljaveduHomePage);
router.route("/viljavedu").get(viljaveduAdd);
router.route("/viljavedu").post(viljaveduAddPost);
router.route("/summary").get(viljaveduSummary);
router.route("/valitudauto").post(viljaveduValitud);
router.route("/massita").get(viljaveduMassita);
router.route("/massita").post(viljaveduMassitaPost);

module.exports = router;