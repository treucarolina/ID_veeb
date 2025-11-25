const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../../../../../tcaroconfig");
const watermarkFile = "./public/images/vp_logo_small.png";

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc Home page for uploading gallery pictures
//@route GET /galleryphotoupload
//@access public

const galleryphotoupPage = (req, res)=>{
	res.render("galleryupload");
};

//@desc Home page for uploading gallery pictures
//@route POST /galleryphotoupload
//@access public

const galleryphotoupPagePost = async (req, res)=>{
	let conn;
	console.log(req.body);
	console.log(req.file);
	
	try {
	  const fileName = "vp_" + Date.now() + ".jpg";
	  console.log(fileName);
	  await fs.rename(req.file.path, req.file.destination + fileName);
	  //kontrollin, kas vesimÃ¤rgi fail on olemas
	  const watermarkSettings = [{
		input: watermarkFile,
		gravity: "southeast"
	  }];
	  if (!await fs.access(watermarkFile).then(() => true).catch(() => false)) {
	    console.log("VesimÃ¤rgi faili ei leitud!");
		// TÃ¼hjendame seaded, et vesimÃ¤rki ei proovitaks lisada
		watermarkSettings.length = 0; 
	  }
	  console.log("Muudan suurust: 800X600");
	  //loon normaalmÃµÃµdus foto (800X600)
	  //await sharp(req.file.destination + fileName).resize(800,600).jpeg({quality: 90}).toFile("./public/gallery/normal/" + fileName);
	  let normalImageProcessor = await sharp(req.file.destination + fileName).resize(800, 600).jpeg({quality: 90});
	  console.log("Lisan vesimÃ¤rgi, " + watermarkSettings.length);    
	  if (watermarkSettings.length > 0) {
		normalImageProcessor = await normalImageProcessor.composite(watermarkSettings);
	  }
	  await normalImageProcessor.toFile("./public/gallery/normal/" + fileName);
	  //Pisipildi tegemine
	  await sharp(req.file.destination + fileName).resize(100,100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + fileName);
	  let sqlReq = "INSERT INTO galleryphotos (filename, origname, alttext, privacy, userid) VALUES(?,?,?,?,?)";
	  //kuna kasutajakontosid veel pole, siis kasuutaja 1
	  const userId = req.session.userId;
	  conn = await mysql.createConnection(dbConf);
	  const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId]);
	  console.log("Salvestati foto id: " + result.insertId);
	  res.render("galleryupload");
	}
	catch(err) {
	  console.log(err);
	  res.render("galleryupload");
	}
	finally {
	  if(conn){
		await conn.end();
		console.log("AndmebaasiÃ¼hendus suletud!");
	  }
	}
};
		
	/* let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
	
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
	} */


module.exports = {
	galleryphotoupPage,
	galleryphotoupPagePost
};