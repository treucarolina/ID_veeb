const mysql = require("mysql2/promise");
//const fs = require("fs").promises;
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
	res.render("uudised_add");
};


const newsAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO news (title, content, added, photo) VALUES (?,?,?,?)";
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud!");
		let deceasedDate = null;
		const [result] = await conn.execute(sqlReq, [req.body.title, req.body.content, req.body.added, req.body.photo]);
		console.log("Salvestati kirje id:" + result.insertId);
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