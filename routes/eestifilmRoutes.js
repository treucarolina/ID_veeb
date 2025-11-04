const express = require("express");
const router = express.Router();

//kontrollerid
const {
	filmHomePage,
	filmPeople,
	filmPeopleAdd,
	filmPeopleAddPost,
	filmPosition,
	filmPositionAdd,
	filmPositionAddPost,
	filmMovie,
	filmMovieAdd,
	filmMovieAddPost,
	filmConnections,
	filmConnectionsAdd,
	filmConnectionsAddPost,
	/* visitLog */} = require("../controllers/eestifilmControllers");

router.route("/").get(filmHomePage);
router.route("/inimesed").get(filmPeople);
router.route("/inimesed_add").get(filmPeopleAdd);
router.route("/inimesed_add").post(filmPeopleAddPost);
router.route("/ametid").get(filmPosition);
router.route("/ametid_add").get(filmPositionAdd);
router.route("/ametid_add").post(filmPositionAddPost);
router.route("/filmid").get(filmMovie);
router.route("/filmid_add").get(filmMovieAdd);
router.route("/filmid_add").post(filmMovieAddPost);
router.route("/filmiseosed").get(filmConnections);
router.route("/filmiseosed_add").get(filmConnectionsAdd);
router.route("/filmiseosed_add").post(filmConnectionsAddPost);
/* router.route("/visitlog").get(visitLog); */

module.exports = router;