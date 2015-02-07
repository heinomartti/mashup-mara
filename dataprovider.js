"use strict";
var http = require('http');
var _ = require('lodash');
var bookDb = require('./bookdb');

var dataProvider = dataProvider || {};
dataProvider = (function() {
        var combinedHtml = "<html><body>Data not available</body></html>"; 
        var authorData = [];
        var titleData = [];

        var bookMapper = function(d) {
                return {
                        isbn: d.isbn,
                        title: d.title,
                        author: d.author,
                        year: d.year
                };
        }
 
        var getBooksByAuthor = function() {
                var url = 'http://metadata.helmet-kirjasto.fi/search/author.json?query=Campbell';
                http.get(url, function(res) {
                        var body = "";
                        res.on("data", function(chunk) {
                                body += chunk;
                        });
 
                        res.on("end", function() {
                                authorData = _.map(JSON.parse(body).records, bookMapper);
                                console.log("Got list of books by author:", authorData);
                                bookDb.insertBooks(authorData);
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
                                titleData = _.map(JSON.parse(body).records, bookMapper);
                                console.log("Got list of by title:", titleData);
                                bookDb.insertBooks(authorData);
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

        var getCombinedDataAsJSONFromDB = function (){
            bookDb.readBooksFromDB();
            var books = bookDb.getBooks();
            console.log(books); 
            return JSON.stringify(books);
        }

        var initializeData = function (){
            getBooksByAuthor();
            getBooksByTitle();
        }
 
        return {
            initializeData: initializeData,
            getCombinedDataAsHTML: getCombinedDataAsHTML,
            getCombinedDataAsJSON: getCombinedDataAsJSON,
            getCombinedDataAsJSONFromDB: getCombinedDataAsJSONFromDB
        };
}());

module.exports = dataProvider;