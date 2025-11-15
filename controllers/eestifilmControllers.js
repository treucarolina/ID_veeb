const mysql = require("mysql2/promise");
const dbInfo = require("../../../../../tcaroconfig");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc Home page for Estonian film section
//@route GET /eestifilm
//@access public

const filmHomePage = (req, res)=>{
	res.render("eestifilm");
};

//@desc page for list of people involved in Estonian film industry
//@route GET /eestifilm/inimesed
//@access public

const filmPeople = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM person";
	
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud!");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("filmiinimesed", {personList: rows});
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("filmiinimesed", {personList: []});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletus!");
		}
	}
};

//@desc page for adding people involved in Estonian film industry
//@route GET /eestifilm/inimesed_add
//@access public

const filmPeopleAdd = (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust!"});
};



//@desc page for adding people involved in Estonian film industry
//@route POST /eestifilm/inimesed_add
//@access public

const filmPeopleAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
	
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput > new Date()){
		res.render("filmiinimesed_add", {notice: "Andmed on vigased! Vaata üle!"});
		return;
	}
	else {
		try {
			conn = await mysql.createConnection(dbConf);
			console.log("Andmebaasiühendus loodud!");
			let deceasedDate = null;
			if(req.body.deceasedInput != ""){
				deceasedDate = req.body.deceasedInput;
			}
			const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
			console.log("Salvestati kirje id:" + result.insertId);
			res.render("filmiinimesed_add", {notice: "Andmed on salvestatud!"});
		}
		catch(err){
			console.log("Viga: " + err);
			res.render("filmiinimesed_add", {notice: "Tekkis tehniline viga:" + err});
		}
		finally {
			if(conn){
				await conn.end();
			console.log("Andmebaasiühendus suletus!");
			}
		}
	}
};

//@desc page for list of positions involved in film industry
//@route GET /eestifilm/ametid
//@access public

const filmPosition = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM position";
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud!");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("filmiametid", {positionList: rows});
	}
	catch(err) {
		console.log(err);
		res.render("filmiametid", {positionList: []});
	}
	finally {
		if (conn) {
			await conn.end();
			console.log ("Andmebaasiühendus suletus!");
		}
	}
};


//@desc page for adding positions involved in film industry
//@route GET /eestifilm/ametid_add
//@access public

const filmPositionAdd = (req, res)=>{
	res.render("filmiametid_add", {notice: "Ootan sisestust!"});
};

//@desc page for adding positions involved in film industry
//@route POST /eestifilm/ametid_add
//@access public

const filmPositionAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO `position` (position_name, description) VALUES (?,?)";
	
	if(!req.body.positionNameInput || !req.body.descriptionInput){
		res.render("filmiametid_add", {notice: "Andmed on vigased! Vaata üle!"});
	}
	else {
		try {
			conn = await mysql.createConnection(dbConf);
			console.log("Andmebaasiühendus loodud!");
			const [result] = await conn.execute(sqlReq, [req.body.positionNameInput, req.body.descriptionInput]);
			console.log("Salvestati kirje id:" + result.insertId);
			res.render("filmiametid_add", {notice: "Andmed on salvestatud!"});
		}
		catch(err) {
			console.log("Viga: " + err);
			res.render("filmiametid_add", {notice: "Tekkis tehniline viga:" + err});
		}
		finally {
			if(conn){
				await conn.end();
				console.log("Andmebaasiühendus suletus!");
			}
		}
	}
};



//@desc page for list of movies in Estonian film industry
//@route GET /eestifilm/filmid
//@access public

const filmMovie = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM movie";
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud!");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("filmifilmid", {movieList: rows});
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("filmifilmid", {movieList: []});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletus!");
		}
	}
};
	
//@desc page for adding movies in Estonian film industry
//@route GET /eestifilm/filmid_add
//@access public

const filmMovieAdd = (req, res)=>{
	res.render("filmifilmid_add", {notice: "Ootan sisestust!"});
};

//@desc page for adding movies in Estonian film industry
//@route POST /eestifilm/filmid_add
//@access public

const filmMovieAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO movie (title, production_year, duration, description) VALUES (?,?,?,?)";
	
	if(!req.body.titleInput || !req.body.productionYearInput || !req.body.durationInput || req.body.descriptionInput > new Date()){
		res.render("filmifilmid_add", {notice: "Andmed on vigased! Vaata üle!"});
		return;
	}
	else {
		try {
			conn = await mysql.createConnection(dbConf);
			console.log("Andmebaasiühendus loodud!");
			const [result] = await conn.execute(sqlReq, [req.body.titleInput, req.body.productionYearInput, req.body.durationInput, req.body.descriptionInput]);
			console.log("Salvestati kirje id:" + result.insertId);
			res.render("filmifilmid_add", {notice: "Andmed on salvestatud!"});
		}
		catch(err){
			console.log("Viga: " + err);
			res.render("filmifilmid_add", {notice: "Tekkis tehniline viga:" + err});
		}
		finally {
			if(conn){
				await conn.end();
				console.log("Andmebaasiühendus suletus!");
			}
		}
	}
};

//@desc page for list of connections in Estonian film industry
//@route GET /eestifilm/seosed
//@access public

const filmConnections = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM person_in_movie";
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud!");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("filmiseosed", {person_in_movieList: rows});
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("filmiseosed", {person_in_movieList: []});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletus!");
		}
	}
};

//@desc page for adding connections between people, films and positions in Estonian film industry
//@route GET /eestifilm/filmiseosed_add
//@access public

const filmConnectionsAdd = (req, res)=>{
	res.render("filmiseosed_add", {notice: "Ootan sisestust!"});
};

//@desc page for adding connections between people, films and positions in Estonian film industry
//@route POST /eestifilm/filmiseosed_add
//@access public

const filmConnectionsAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "SELECT (first_name, last_name, role, title) FROM person JOIN `position` ON (person.id = position.person_id JOIN movie ON movie.id = position.movie_id) VALUES (?,?,?,?)";
	
	if(!req.body.personSelect || !req.body.positionSelect || !req.body.movieSelect > new Date()){
		res.render("filmiseosed_add", {notice: "Andmed on vigased! Vaata üle!"});
		return;
	}
	else {
		try {
			conn = await mysql.createConnection(dbConf);
			console.log("Andmebaasiühendus loodud!");
			const [result] = await conn.execute(sqlReq, [req.body.personSelect, req.body.positionSelect, req.body.movieSelect]);
			console.log("Salvestati kirje id:" + result.selectId);
			res.render("filmiseosed_add", {notice: "Andmed on salvestatud!"});
		}
		catch(err){
			console.log("Viga: " + err);
			res.render("filmiseosed_add", {notice: "Tekkis tehniline viga:" + err});
		}
		finally {
			if(conn){
				await conn.end();
				console.log("Admebaasi ühendus suletus!");
			}
		}
	}
};




module.exports = {
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
	filmConnectionsAddPost
};