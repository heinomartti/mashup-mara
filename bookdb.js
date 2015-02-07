"use strict";
var mongoClient = require('mongodb').MongoClient;
var _ = require('lodash');

var bookDb = bookDb || {};
bookDb = (function() {

	  var collection = null;
	  var books = [];

      var bookMapper = function(d) {
            return {
                    isbn: d.isbn,
                    title: d.title,
                    author: d.author,
                    year: d.year
            };
        }

	  var connectToDB = function(){
		mongoClient.connect('mongodb://127.0.0.1:27017/testdb', function(err, db) {
		  if(err) throw err;
		  console.log("Connected to testdb");
		  collection = db.collection('books');
		  dropBooks();
		});
	  }

	  var closeDB = function(){
		db.close();
	  }

	  var dropBooks = function(){
		collection.drop();
	  }

	  var insertBooks = function(books){
		collection.insert(books, function(err, docs) {   
			collection.count(function(err, count) {
			    console.log("Nbr of books inserted: " + count);
			});
		});
	  }

	  var readBooksFromDB = function(){
	  	collection.find().toArray(function(err, results) {
	  		for(var i = 0; i< results.length ; i++)
	  		{
	  			var book = {isbn: results[i].isbn, title: results[i].title,
	  						author: results[i].author, year: results[i].year}; 
	  			books.push(book);	
	  		}
        });
	  }

	  var getBooks = function(){
		return books;
	  }

	  return {
	    connectToDB: connectToDB,
	    closeDB: closeDB,
		dropBooks: dropBooks,
	    insertBooks: insertBooks,
	    readBooksFromDB: readBooksFromDB,
	    getBooks: getBooks
	  };
}());

module.exports = bookDb;