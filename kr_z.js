var soap = require("soap");
var argv = require("optimist").argv;
var fs = require("fs");
var path = require("path");
var pd = require("pretty-data").pd;

var day = argv.d;
var shop = argv.s;
var regExpDate = /^\d{4}-[01]\d{1}-\d{2}/;
var regExpIP = /^\d{2,3}\.\d{2,3}\.\d{1,3}\.\d{1,3}/;
var listIP = [
	"192.168.1.7",
	"192.168.3.30",
	"192.168.4.7",
	"192.168.5.7",
	"192.168.7.7"
];

var dir;

if (listIP.indexOf(shop) == -1){
	console.log('ERROR: unknown IP address!');
	return 1;
}

if (!regExpDate.test(day) || !regExpIP.test(shop)){
	console.log("ERROR: Date or IP incorrect!");
	return 1;
}

switch (shop){
	case "192.168.1.7":
		dir = __dirname + "/shop/Yubil/";
		break;
	case "192.168.3.30":
		dir = __dirname + "/shop/Xolod/";
		break;
	case "192.168.4.7":
		dir = __dirname + "/shop/Enisei/";
		break;
	case "192.168.5.7":
		dir = __dirname + "/shop/Solnech/";
		break;
	case "192.168.7.7":
		dir = __dirname + "/shop/Krupsk/";
		break;
}; 




var fileNameZ = ("zreports-" + day + ".xml").replace(/:/g,"-");

var fileNameP = ("purchases-" + day + ".xml").replace(/:/g,"-");


var	url = "http://" + shop + ":8090/SET-ERPIntegration/FiscalInfoExport?wsdl";

var args = {
	dateOperDay: day
};

soap.createClient(url, function(err, client){
	if (err) {console.log("error create client" + err);return;};

	client.getZReportsByOperDay(args, function(err, result){
		if (err) {console.log("error call action" + err);return;};
		var buf = new Buffer(result.return, "base64").toString('utf-8');
		if (result.return) console.log("\nzreports success\n");
		fs.writeFileSync(dir + fileNameZ, pd.xml(buf));
	});

	client.getPurchasesByOperDay(args, function(err, result){
		if (err) {console.log("error call action" + err);return;};
		var buf = new Buffer(result.return, "base64").toString('utf-8');
		if (result.return) console.log("\npurchases success\n");
		fs.writeFileSync(dir + fileNameP, pd.xml(buf));
	});
});
