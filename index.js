const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
//lisan andmebaasiga suhtlemiseks mooduli
//nüüd, async jaoks kasutame mysql2 promise osa
//const mysql = require("mysql2/promise");
//lisan andmebaasi juurdepääsuinfo
//const dbInfo = require("../../../../tcaroconfig");
const dateEt = require("./src/dateTimeET");
//me loome objekti, mis ongi express.js programm ja edasi kasutamegi seda
const app = express();
//määrame renderdajaks ejs
app.set("view engine", "ejs");
//määrame kasutamiseks "avaliku" kataloogi
app.use(express.static("public"));
//päringu URL-i parsimine, eraldame POST osa. False, kui ainult tekst, true, kui muud infot Kahjuks
app.use(bodyparser.urlencoded({extended: false}));

//loon andmebaasi ühenduse (conn-connection)
/* const conn = mysql.createConnection({
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
}); */

/* const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
}; */

app.get("/", (req, res)=>{
	//res.send("Express.js läks edukalt käima!");
	res.render("index");
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
});

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});

app.get("/visitlog", (req,res)=>{
	res.render("visitlog");
});

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

app.listen(5217);