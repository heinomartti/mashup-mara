"use strict";
var http = require('http');
var _ = require('lodash');
var dataProvider = require('./dataprovider');
var bookDb = require('./bookdb');
var port = 80;
 
var requestHandler = function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html', 
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE' });
        
//        var response = dataProvider.getCombinedDataAsHTML(); 
//        var response = dataProvider.getCombinedDataAsJSON();
		var response = dataProvider.getCombinedDataAsJSONFromDB();
        res.write(response);
        res.end();
}
 
var server = http.createServer(requestHandler);
server.listen(port, '127.0.0.1');
console.log('Server running in port ' + port);

bookDb.connectToDB();
dataProvider.initializeData();
