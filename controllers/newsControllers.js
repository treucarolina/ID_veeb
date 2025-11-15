const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../../../../../tcaroconfig");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc Home page of photogallery
//@route GET /photogallery
//@access public


const newsHome = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM news";
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud!");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("uudised", {newsList: rows});
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("uudised", {newsList: []});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletus!");
		}
	}
};

const newsAdd = (req, res)=>{
	res.render("uudised_add", {notice: "Ootan sisestust!"});
};


const newsAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO news (title, content, expire, photo, photoalt, userid) WHERE expire > ? VALUES (?,?,?,?,?,?)";
	
	if(!req.body.title || !req.body.content || !req.body.expire > new Date()){
		res.render("uudised_add", {notice: "Andmed on vigased! Vaata üle!"});
		return;
	}
	try {
		const fileName = "vp_" + Date.now() + ".jpg";
		console.log(fileName);conn = await mysql.createConnection(dbConf);
		await fs.rename(req.file.path, req.file.destination + fileName);
		console.log("Andmebaasiühendus loodud!");
		await normalImageProcessor.toFile("./public/newsPhoto/" + fileName);
		const userId = 1;
		console.log("Salvestati kirje id:" + result.insertId);
		const [result] = await conn.execute(sqlReq, [req.body.title, req.body.content, req.body.expire > new Date(), req.body.photo, req.body.photoalt, req.body.userid]);
		res.render("uudised_add", {notice: "Andmed on salvestatud!"});
	}
	catch(err){
		console.log("Viga: " + err);
		res.render("uudised_add", {notice: "Tekkis tehniline viga:" + err});
	}
	finally {
		if(conn){
			await conn.end();
		console.log("Andmebaasiühendus suletus!");
		}
	}
};

module.exports = {
	newsHome,
	newsAdd,
	newsAddPost
};