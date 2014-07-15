var fs = require('fs');
fs.exists('./zm.txt', function (exists) {
    console.log(exists);
})