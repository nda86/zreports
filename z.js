var soap = require("soap");
var argv = require("optimist").argv;
var fs = require("fs");
var path = require("path");
var pd = require("pretty-data").pd;


var dir = __dirname + "/success/";
if (!fs.existsSync(dir)) 
	fs.mkdirSync(dir);

var fileNameZ = ("zreports-" + (new Date().toLocaleDateString()) + "_" + (new Date().toLocaleTimeString()) + ".xml").replace(/:/g,"-");

var fileNameP = ("purchases-" + (new Date().toLocaleDateString()) + "_" + (new Date().toLocaleTimeString()) + ".xml").replace(/:/g,"-");

var day, shop;

shop 	= argv.s;
day 	= argv.d;
dayF	= argv.f;
dayT	= argv.t;



var	url = "http://" + shop + ":8090/SET-ERPIntegration/FiscalInfoExport?wsdl";


if (argv.h){
	console.log("-m: mode [day, range]");
	console.log("-s: shop [shop {ip}]");
	console.log("-d: day [operday {ГГГГ-ММ-ДД}]");
};


if (argv.m =='date'){

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
}

if (argv.m == 'range'){

	var args = {
		fromDate: dayF,
		toDate: dayT
	};

	soap.createClient(url, function(err, client){
		if (err) {console.log("error create client" + err);return;};

		client.getZReportsByPeriod(args, function(err, result){
			if (err) {console.log("error call action" + err);return;};
			var buf = new Buffer(result.return, "base64").toString('utf-8');
			if (result.return) console.log("\nzreports success\n");
			fs.writeFileSync(dir + fileNameZ, pd.xml(buf));
		});

		client.getPurchasesByPeriod(args, function(err, result){
			if (err) {console.log("error call action" + err);return;};
			var buf = new Buffer(result.return, "base64").toString('utf-8');
			if (result.return) console.log("\npurchases success\n");
			fs.writeFileSync(dir + fileNameP, pd.xml(buf));
		});
	});
}



