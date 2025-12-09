const express = require("express");
require("dotenv").config();
const fs = require("fs");
const mysql = require("mysql2/promise");
process.env.DB_HOST
//sessioonihadur
const session = require("express-session");
const bodyparser = require("body-parser");
const dbInfo = require("../../../../tcaroconfig");
const dateEt = require("./src/dateTimeET");
const loginCheck = require("./src/checklogin");
//me loome objekti, mis ongi express.js programm ja edasi kasutamegi seda
const app = express();
//määrame renderdajaks ejs
app.set("view engine", "ejs");
//määrame kasutamiseks "avaliku" kataloogi
app.use(express.static("public"));
//päringu URL-i parsimine, eraldame POST osa. False, kui ainult tekst, true, kui muud infot 
app.use(bodyparser.urlencoded({extended: true}));

//console.log(process.env.DB_HOST);

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

app.get("/", async (req, res)=>{
	let conn;
	try {
		res.render("proov");
	}
	catch(err){
		console.log(err);
		res.render("proov");
	}
	finally {
		if(conn){
			await conn.end();
			console.log("AndmebaasiÃ¼hendus suletud!");
		}
	}
});

const viljaveduRouter = require("./routes/viljaveduRoutes")
app.use("/viljaveoesileht", viljaveduRouter);

app.listen(5217);