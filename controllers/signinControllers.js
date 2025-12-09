const mysql = require("mysql2/promise");
const argon2 = require("argon2")
const pool = ("../src/dbPool");
//const dbInfo = require("../../../../../tcaroconfig");

/* const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
}; */

//@desc Home page for signin
//@route GET /signin
//@access public

const signinPage = (req, res)=>{
	res.render("signin", {notice: "Sisesta oma kasutajatunnus ning parool..."});
};

//@desc Home page for signin
//@route POST /signin
//@access public

const signinPagePost = async (req, res)=>{
	//let conn;
	//console.log(req.body);
	//andmete algne valideerimine
	if(
	  !req.body.emailInput ||
	  !req.body.passwordInput
	  ) {
		  let notice = "Sisselogimise andmeid on puudulikud!";
		  console.log(notice);
		  return res.render("signin", {notice: notice});
	  }
	
	try {
	  //conn = await mysql.createConnection(dbConf);
	  let sqlReq  = "SELECT id, first_name, last_name, password FROM users WHERE email = ?";
	  //andmetabelist millegi pärimine annab alati listi
	  //const [users] = await conn.execute(sqlReq, [req.body.emailInput]);
	  const [users] = await pool.execute(sqlReq, [req.body.emailInput]);
	  //kas selline kasutaja leiti
	  if(users.length === 0){
		let notice = "Kasutajanimi ja/või parool on vale!";
		console.log(notice);
		return res.render("signin", {notice: notice});  
	  }
	  const user = users[0];
	  //kontrollime salasõna vastavust krüpteeritud räsile
	  const match = await argon2.verify(user.password, req.body.passwordInput);
	  if(match){
		//logisime edukalt sisse
		//let notice = "Edukalt sisse loginud!";
		//console.log(notice);
		//return res.render("signin", {notice: notice});
		//paneme sessiooni käima ja määrame sessioonimuutuja
		req.session.userId = user.id;
		req.session.userFirstName = user.first_name;
		req.session.userLastName = user.last_name;
		return res.redirect("/home");
	  }
	  else {
		let notice = "Kasutajanimi ja/või parool on vale!";
		console.log(notice);
		return res.render("signin", {notice: notice});    
	  }
	}
	catch(err) {
	  console.log(err);
	  res.render("signin", {notice: "Tehniline viga"});
	}
	finally {
	  /* if(conn){
		await conn.end();
		console.log("AndmebaasiÃ¼hendus suletud!");
	  } */
	}
};
		


module.exports = {
	signinPage,
	signinPagePost
};