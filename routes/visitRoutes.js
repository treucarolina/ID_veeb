const express = require("express");
const router = express.Router();

//kontrollerid
const {
	visitLog} = require("../controllers/visitControllers");

router.route("/visitlog").get(visitLog);

module.exports = router;