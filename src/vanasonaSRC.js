const pickOneWisdom = function() {
	//jagan teksti ";" järgi massiiviks (list, array)
	let oldWisdomList = rawText.split(";");
	//console.log(oldWisdomList);
	//väljastan kuupäeva
	console.log("Täna on " + dateET.longDate() + ".")
	//loosin ühe ja väljastan
	//console.log("Tänane vanasõna: " + oldWisdomList[Math.round(Math.random() * (oldWisdomList.length -1))]);
	return "Tänane vanasõna: " + oldwisdomList[Math.round(Math.random() * (oldWisdomList.length -1))] 
}

module.exports = {vanasona: pickOneWisdom};