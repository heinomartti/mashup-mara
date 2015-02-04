"use strict";
var http = require('http');
var _ = require('lodash');
var port = 80;
 
var requestHandler = function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        var response = dataProvider.getCombinedDataAsHTML() + dataProvider.getOtherStuffAsHtml() + dataProvider.getBooksAsHtml(); 
        res.end(response);
}
 
var server = http.createServer(requestHandler);
server.listen(port, '127.0.0.1');
console.log('Server running in port ' + port);

var dataProvider = dataProvider || {};
dataProvider = (function() {
        var booksHtml = "<html><body>Books not available</body></html>"; 
        var otherHtml = "<html><body>Other stuff not available</body></html>"; 
        var bookData = [];
        var otherData = [];
 
        var getBooks = function() {
                var booksUrl = 'http://metadata.helmet-kirjasto.fi/search/author.json?query=Campbell';
                http.get(booksUrl, function(res) {
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
                               
                                 booksHtml = "<html><body>";
                                _.map(bookData, function(d) {
                                         booksHtml += "<h1>" + d.displayName + "</h1>";
                                         booksHtml += "<p>" + d.year + "</p>";
                                });
                                booksHtml += "</body></html>";
                        });
                }).on("error", function(e) {
                        console.log("Error: ", e);
                });
        }

        var getBooksAsHtml = function() {
            return booksHtml;
        }    

        var getOtherStuff = function() {
            // TODO
        }
    
        var getOtherStuffAsHtml = function() {
            return otherHtml;
        }  

        var getCombinedDataAsHTML = function (){
            console.log(bookData);
            var combinedHtml = bookData.toString() +  otherData.toString();
            // TODO combine data with arrays, would be nice to have data that makes sense together
            return combinedHtml;
        }
 
        return {
            getBooks: getBooks,
            getBooksAsHtml: getBooksAsHtml,
            getOtherStuff: getOtherStuff,
            getOtherStuffAsHtml: getOtherStuffAsHtml,
            getCombinedDataAsHTML: getCombinedDataAsHTML
        };
}());

dataProvider.getBooks();
dataProvider.getOtherStuff();