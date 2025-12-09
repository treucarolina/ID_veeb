const mysql = require("mysql2/promise");
const dbInfo = require("../../../../../tcaroconfig");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};


const viljaveduHomePage = (req, res)=>{
	res.render("viljaveoesileht");
};

//@desc page for list of people involved in Estonian film industry
//@route GET /eestifilm/inimesed
//@access public

const viljaveduSummary = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM viljavedu";
	
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud!");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("summary", {viljaveduList: rows});
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("summary", {viljaveduList: []});
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

const viljaveduAdd = (req, res)=>{
	res.render("viljavedu", {notice: "Ootan sisestust!"});
};


//@desc page for adding people involved in Estonian film industry
//@route POST /eestifilm/inimesed_add
//@access public

const viljaveduAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO viljavedu (number, inWeight, outWeight, cropWeight) VALUES (?,?,?,?)";
	
	/* if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput > new Date()){
		res.render("filmiinimesed_add", {notice: "Andmed on vigased! Vaata üle!"});
		return;
	} */
	//else {
		try {
			conn = await mysql.createConnection(dbConf);
			let cropWeight = req.body.inWeightInput - req.body.outWeightInput;
			const [result] = await conn.execute(sqlReq, [req.body.numberInput, req.body.inWeightInput, req.body.outWeightInput, cropWeight]);
			console.log("Salvestati kirje id:" + result.insertId);
			res.render("viljavedu", {notice: "Andmed on salvestatud!"});
		}
		catch(err){
			console.log("Viga: " + err);
			res.render("viljavedu", {notice: "Tekkis tehniline viga:" + err});
		}
		finally {
			if(conn){
				await conn.end();
			console.log("Andmebaasiühendus suletus!");
			}
		}
	//}
};







module.exports = {
	viljaveduHomePage,
	viljaveduSummary,
	viljaveduAdd,
	viljaveduAddPost
};