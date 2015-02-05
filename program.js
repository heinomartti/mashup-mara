"use strict";
var http = require('http');
var _ = require('lodash');
var port = 80;
 
var requestHandler = function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html', 
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE' });
        
//        var response = dataProvider.getCombinedDataAsHTML(); 
        var response = dataProvider.getCombinedDataAsJSON();
        res.write(response);
        res.end();
}
 
var server = http.createServer(requestHandler);
server.listen(port, '127.0.0.1');
console.log('Server running in port ' + port);

var dataProvider = dataProvider || {};
dataProvider = (function() {
        var combinedHtml = "<html><body>Data not available</body></html>"; 
        var authorData = [];
        var titleData = [];
 
        var getBooksByAuthor = function() {
                var url = 'http://metadata.helmet-kirjasto.fi/search/author.json?query=Campbell';
                http.get(url, function(res) {
                        var body = "";
                        res.on("data", function(chunk) {
                                body += chunk;
                        });
 
                        res.on("end", function() {
                                authorData = _.map(JSON.parse(body).records, function(d) {
                                        return {
                                                displayName: d.title,
                                                author: d.author
                                        };
                                });
                                console.log("Got list of books:", authorData);
                        });
                }).on("error", function(e) {
                        console.log("Error: ", e);
                });
        }

        var getBooksByTitle = function() {
                var url = 'http://metadata.helmet-kirjasto.fi/search/title.json?query=Campbell';
                http.get(url, function(res) {
                        var body = "";
                        res.on("data", function(chunk) {
                                body += chunk;
                        });
 
                        res.on("end", function() {
                                titleData = _.map(JSON.parse(body).records, function(d) {
                                        return {
                                                displayName: d.title,
                                                author: d.author
                                        };
                                });
                                console.log("Got list of other stuff:", titleData);
                        });
                }).on("error", function(e) {
                        console.log("Error: ", e);
                });
        }

        var getCombinedDataAsHTML = function (){
            combinedHtml = "<html><body>";
            _.map(titleData, function(d) {
                combinedHtml += "<h1>" + d.displayName + "</h1>";
                combinedHtml += "<p>" + d.author + "</p>";
            });
           _.map(authorData, function(d) {
                combinedHtml += "<h1>" + d.displayName + "</h1>";
                combinedHtml += "<p>" + d.author + "</p>";
            });
            combinedHtml += "</body></html>";

            return combinedHtml;
        }

        var getCombinedDataAsJSON = function (){
            titleData.push.apply(titleData, authorData)
            return JSON.stringify(titleData);
        }

        var initializeData = function (){
            getBooksByAuthor();
            getBooksByTitle();
        }
 
        return {
            initializeData: initializeData,
            getCombinedDataAsHTML: getCombinedDataAsHTML,
            getCombinedDataAsJSON: getCombinedDataAsJSON
        };
}());

dataProvider.initializeData();