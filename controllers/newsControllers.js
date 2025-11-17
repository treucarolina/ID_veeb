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
	const sqlReq = "SELECT title, content, added, expire, photo, photoalt FROM news ORDER BY added DESC";
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud!");
		const [rows, fields] = await conn.execute(sqlReq);
		let newsData = [];
	  for (let i = 0; i < rows.length; i ++){
		  let photoalt = "Uudisepilt";
		  if(rows[i].photoalt != ""){
			  photoalt = rows[i].photoalt;
		  }
		  newsData.push({src: rows[i].photo, alt: photoalt});
	  }
	  //esimene pool, mis nimega saadateakse, teine pool, kust võetakse (galleryData)
	  res.render("uudised", {imagehref: "/newsPhoto/", newsList: rows});
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("uudised", {newsList: [], imagehref: "/newsPhoto/"});
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
	console.log("Saabunud andmed:", req.body);
    console.log("Saabunud fail:", req.file);
	
	
	
	if(!req.body.titleInput || !req.body.contentInput || !req.body.expireInput){
		res.render("uudised_add", {notice: "Andmed on vigased! Vaata üle!"});
		return;
	}
	const expireDate = new Date(req.body.expireInput);
	const today = new Date();
	today.setHours(0,0,0,0);
	
	if (expireDate < today) {
		res.render("uudised_add", {notice: "Aegumiskuupäev on minevikus!"});
		return;
	}
	const fileName = "vp_" + Date.now() + ".jpg";
	
	try {
		if (req.file) {
			fileName; 
			console.log("töötlen faili:", fileName);
			
			await fs.rename(req.file.path, req.file.destination + fileName);
			
			await sharp(req.file.destination + fileName).resize(800, 600, { fit: 'inside' }).jpeg({ quality: 90 }).toFile("./public/newsPhoto/" + fileName);
			console.log(fileName);
		}
		
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud!");
		let sqlReq = "INSERT INTO news (title, content, expire, photo, photoalt, userid) VALUES (?,?,?,?,?,?)";
		const userId = 1;
		const [result] = await conn.execute(sqlReq, [req.body.titleInput, req.body.contentInput, req.body.expireInput, fileName, req.body.photoaltInput, userId]);
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