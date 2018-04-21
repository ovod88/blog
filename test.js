var sanitize = require('validator');

var string= ' VOVA <html> \n Lina Khrystenko \n Pavlo';

// console.log(sanitize.escape(string));

var newstring = sanitize.escape(string);
var result = newstring.replace(/\r?\n/g,'<br>');

console.log(result);
