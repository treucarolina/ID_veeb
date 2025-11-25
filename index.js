const express = require("express");
const fs = require("fs");
const mysql = require("mysql2/promise");
//sessioonihadur
const session = require("express-session");
const bodyparser = require("body-parser");
const dbInfo = require("../../../../tcaroconfig");
const dateEt = require("./src/dateTimeET");
const loginCheck = require("./src/checklogin");
//me loome objekti, mis ongi express.js programm ja edasi kasutamegi seda
const app = express();
app.use(session({secret: dbInfo.configData.sessionSecret, saveUninitialized: true, resave: true}));
//määrame renderdajaks ejs
app.set("view engine", "ejs");
//määrame kasutamiseks "avaliku" kataloogi
app.use(express.static("public"));
//päringu URL-i parsimine, eraldame POST osa. False, kui ainult tekst, true, kui muud infot 
app.use(bodyparser.urlencoded({extended: true}));

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

app.get("/", async (req, res)=>{
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT filename, alttext FROM galleryphotos WHERE id=(SELECT MAX(id) FROM galleryphotos WHERE privacy=? AND deleted IS NULL)";
		const privacy = 3;
		const [rows, fields] = await conn.execute(sqlReq, [privacy]);
		
		//let sqlNews = "SELECT title, content, added, expire, photo, photoalt FROM news WHERE id=(SELECT MAX(id) FROM news WHERE deleted IS NULL)";
		//const [newsRows] = await conn.execute(sqlNews);
		
		//console.log(rows);
		let imgAlt = "Avalik foto";
		if(rows[0].alttext != ""){
			imgAlt = rows[0].alttext;
		}
		res.render("index", {imgFile: "gallery/normal/" + rows[0].filename, imgAlt: imgAlt, photoFile: "newsPhoto/"});
	}
	catch(err){
		console.log(err);
		//res.render("index");
		res.render("index", {imgFile: "images/otsin_pilte.jpg", imgAlt: "Tunnen end, kui pilti otsiv lammas ..."});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("AndmebaasiÃ¼hendus suletud!");
		}
	}
});

//sisseloginud kasutajate osa avaleht
app.get("/home", loginCheck.isLogin, (req,res)=>{
	//console.log("Sisse logis kasutaja id: " + req.session.userId);
	res.render("home", {userName: req.session.userFirstName + " " + req.session.userLastName});
});

//väljalogimine
app.get("/logout", (req,res)=>{
	console.log("Kasutaja id: " + req.session.userId + "logis välja!");
	//tühistame sessiooni
	req.session.destroy();
	res.redirect("/");
});

app.get("/timenow", (req, res)=>{
	res.render("timenow", {nowDate: dateEt.longDate(), nowWd: dateEt.weekDay()});
});

app.get("/vanasonad", (req, res)=>{
	fs.readFile("public/txt/vanasonad.txt", "utf8", (err, data)=>{
		if(err){
			res.render("genericlist", {heading: "Valik tuntud Eesti vanasõnasid", listData: ["Kahjuks vanasõnasid ei leidnud!"]});
		} else {
			let folkWisdom = data.split(";");
			res.render("genericlist", {heading: "Valik tuntud Eesti vanasõnasid", listData: folkWisdom});	
		}
	});
	
});

/* app.get("/visitlog", (req, res)=>{
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

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});

/* app.get("/visitlog", (req,res)=>{
	res.render("visitlog");
}); */

app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + " " + dateEt.longDate() + " kell " + dateEt.time() + ";", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("visitregistered", {visitor: req.body.firstNameInput + " " + req.body.lastNameInput});
				}
			});
		}
	});
});

app.get("/visitregistered", (req, res) => {
	res.render("visitregistered");
});

//Eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes")
app.use("/eestifilm", eestifilmRouter);

const visitRouter = require("./routes/visitRoutes")
app.use(visitRouter);

//Piltide marsruudid
const galleryphotoupRouter = require("./routes/galleryphotoupRoutes")
app.use("/galleryphotoupload", galleryphotoupRouter);

//Galerii marsruudid
const photogalleryRouter = require("./routes/photogalleryRoutes")
app.use("/photogallery", photogalleryRouter);

//Uudiste marsruudid
const newsRouter = require("./routes/newsRoutes")
app.use("/news", newsRouter);

//Konto loomise marsruudid
const signupRouter = require("./routes/signupRoutes")
app.use("/signup", signupRouter);

//Sisselogimise marsruudid
const signinRouter = require("./routes/signinRoutes")
app.use("/signin", signinRouter);

//Privaatse galerii marsruudid
const myphotosRouter = require("./routes/myphotosRoutes")
app.use("/myphotos", myphotosRouter);

app.listen(5217);