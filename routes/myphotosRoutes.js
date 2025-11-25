const express = require("express");
// üks punkt sama kataloog, kaks punkti läheb routesi kataloogist välja
const loginCheck = require("../src/checklogin");

const router = express.Router();
//kõigile marsruutidele lisan sisselogimise kontrolli vahevara
router.use(loginCheck.isLogin);

//kontrollerid
const {
	myphotosHome,
	myphotosPage} = require("../controllers/myphotosControllers");

router.route("/").get(myphotosHome);

router.route("/:page").get(myphotosPage);

module.exports = router;