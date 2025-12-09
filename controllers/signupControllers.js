const mysql = require("mysql2/promise");
const argon2 = require("argon2")
const validator = require("validator");
const dbInfo = require("../../../../../tcaroconfig");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc Home page for creating user account
//@route GET /signup
//@access public

const signupPage = (req, res)=>{
	res.render("signup", {notice: "Ootan andmeid..."});
};

//@desc Home page for creating user account
//@route POST /signup
//@access public

const signupPagePost = async (req, res)=>{
	let conn;
	console.log(req.body);
	//andmete algne valideerimine
	/* if(
	  !req.body.firstNameInput || 
	  !req.body.lastNameInput ||
	  !req.body.birthDateInput ||
	  !req.body.genderInput ||
	  !req.body.emailInput ||
	  req.body.passwordInput.length < 8 ||
	  req.body.passwordInput !== req.body.confirmPasswordInput
	  ) {
		  let notice = "Andmeid on puudu või need on vigased!";
		  console.log(notice);
		  return res.render("signup", {notice: notice});
	  } */
	
	// Puhastame sisendandmeid ja võtame kasutusele vastavad muutujad
	const firstName = validator.escape(req.body.firstNameInput.trim());
	const lastName = validator.escape(req.body.lastNameInput.trim());
	const birthDate = req.body.birthDateInput;
	const gender = req.body.genderInput;
	const email = req.body.emailInput.trim();
	const password = req.body.passwordInput;
	const confirmPassword = req.body.confirmPasswordInput;
	
	//kontrollime, kas kõik oluline on olemas 
	
	if(
	  !firstName || 
	  !lastName||
	  !birthDate||
	  !gender||
	  !email||
	  !password||
	  !confirmPassword
    ) {
		let notice = "Andmeid on puudu või need on vigased!";
		console.log(notice);
		return res.render("signup", {notice: notice});
	}
	  //kas email on korras 
	  if(!validator.isEmail(email)){
		let notice = "E-mail pole korrektne!";
		console.log(notice);
		return res.render("signup", {notice: notice});  
	}
	
	//kas parool on korrektne
	const passwordOptions = {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0};
	if(!validator.isStrongPassword(password, passwordOptions)){
		let notice = "Parool pole piisavalt tugev!";
		console.log(notice);
		return res.render("signup", {notice: notice});
	}
	
	//kas paroolid klapivad
	if(password !== confirmPassword){
		let notice = "Paroolid ei klapi!";
		console.log(notice);
		return res.render("signup", {notice: notice});
	}
		  
	//kas sünnikuupäev on korrektne, tõenäoline
	if(!validator.isDate(birthDate) || validator.isAfter(birthDate)){
		let notice = "Sünnikuupäev ei ole reaalne";
		console.log(notice);
		return res.render("signup", {notice: notice});
	}
		  
	try {
	  conn = await mysql.createConnection(dbConf);
	  let sqlReq  = "SELECT id from users WHERE email = ?";
	  const [users] = await conn.execute(sqlReq, [email]);
	  if(users.length > 0){
		let notice = "Selline kasutaja (" + email +") on juba olemas!";
		console.log(notice);
		return res.render("signup", {notice: notice}); 
	  }
	  
	  
	  //krüpteerime salasõna
	  const pwdHash = await argon2.hash(req.body.passwordInput);
	  console.log(pwdHash);
	  console.log(req.body.firstNameInput + req.body.lastNameInput + req.body.genderInput + req.body.emailInput);
	  
	  
	  sqlReq  = "INSERT INTO users (first_name, last_name, birth_date, gender, email, password) VALUES(?,?,?,?,?,?)";
	  const [result] = await conn.execute(sqlReq, [
		req.body.firstNameInput,
		req.body.lastNameInput,
		req.body.birthDateInput,
		req.body.genderInput,
		req.body.emailInput,
		pwdHash
	  ]);
	  
	  //console.log("Salvestati foto id: " + result.insertId);
	  res.render("signup", {notice: "Konto loodud!"});
	}
	catch(err) {
	  console.log(err);
	  res.render("signup", {notice: "Tehniline viga"});
	}
	finally {
	  if(conn){
		await conn.end();
		console.log("AndmebaasiÃ¼hendus suletud!");
	  }
	}
};
		


module.exports = {
	signupPage,
	signupPagePost
};