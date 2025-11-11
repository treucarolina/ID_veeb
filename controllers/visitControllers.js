const fs = require("fs").promises;

/* const mysql = require("mysql2/promise");
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

app.get("/visitlog", (req, res)=>{
	let listData = [];
	fs.readFile("public/txt/visitlog.txt", "utf8", (err, data)=>{
		if(err){
			//kui tuleb viga, siis ikka vأ¤ljastame veebilehe, liuhtsalt vanasأµnu pole أ¼htegi
			res.render("genericlist", {heading: "Registreeritud kأ¼lastused", listData: ["Ei leidnud أ¼htegi kأ¼lastust!"]});
		}
		else {
			let tempListData = data.split(";");
			for(let i = 0; i < tempListData.length - 1; i ++){
				listData.push(tempListData[i]);
			}
			res.render("genericlist", {heading: "Registreeritud kأ¼lastused", listData: listData});
		}
	});
}); */


const visitLog = async (req, res)=>{
	let listData = [];
	
	try {
		const data = await fs.readFile ("public/txt/visitlog.txt", "utf8");
		const tempListData = data.split(";");
		console.log("List tehtud.")
		for(let i = 0; i < tempListData.length - 1; i ++){
				listData.push(tempListData[i]);
			}
		res.render("genericlist", {heading: "Registreeritud kأ¼lastused", listData: listData});
		/* res.render("visitlog"); */
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("genericlist", {heading: "Registreeritud kأ¼lastused", listData: ["Ei leidnud أ¼htegi kأ¼lastust!"]});
	}
	finally {
		console.log("Ühendus suletus!")
		
	}
};



module.exports = {
	visitLog
};