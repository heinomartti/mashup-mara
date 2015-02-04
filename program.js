"use strict";
var http = require('http');
var _ = require('lodash');
var port = 80;
 
var requestHandler = function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        var response = dataProvider.getCombinedDataAsHTML(); 
        res.end(response);
}
 
var server = http.createServer(requestHandler);
server.listen(port, '127.0.0.1');
console.log('Server running in port ' + port);

var dataProvider = dataProvider || {};
dataProvider = (function() {
        var combinedHtml = "<html><body>Data not available</body></html>"; 
        var bookData = [];
        var otherData = [];
 
        var getBooks = function() {
                var url = 'http://metadata.helmet-kirjasto.fi/search/author.json?query=Campbell';
                http.get(url, function(res) {
                        var body = "";
                        res.on("data", function(chunk) {
                                body += chunk;
                        });
 
                        res.on("end", function() {
                                bookData = _.map(JSON.parse(body).records, function(d) {
                                        return {
                                                displayName: d.title,
                                                year: d.year
                                        };
                                });
                                console.log("Got list of books:", bookData);
                        });
                }).on("error", function(e) {
                        console.log("Error: ", e);
                });
        }

        var getOtherStuff = function() {
                var url = 'http://metadata.helmet-kirjasto.fi/search/author.json?query=Wayne';
                http.get(url, function(res) {
                        var body = "";
                        res.on("data", function(chunk) {
                                body += chunk;
                        });
 
                        res.on("end", function() {
                                otherData = _.map(JSON.parse(body).records, function(d) {
                                        return {
                                                displayName: d.title,
                                                author: d.author
                                        };
                                });
                                console.log("Got list of other stuff:", otherData);
                        });
                }).on("error", function(e) {
                        console.log("Error: ", e);
                });
        }

        var getCombinedDataAsHTML = function (){
            combinedHtml = "<html><body>";
            _.map(otherData, function(d) {
                combinedHtml += "<h1>" + d.displayName + "</h1>";
                combinedHtml += "<p>" + d.author + "</p>";
            });
           _.map(bookData, function(d) {
                combinedHtml += "<h1>" + d.displayName + "</h1>";
                combinedHtml += "<p>" + d.year + "</p>";
            });
            combinedHtml += "</body></html>";

            return combinedHtml;
        }

        var initializeData = function (){
            getBooks();
            getOtherStuff();
        }
 
        return {
            initializeData: initializeData,
            getCombinedDataAsHTML: getCombinedDataAsHTML
        };
}());

dataProvider.initializeData();