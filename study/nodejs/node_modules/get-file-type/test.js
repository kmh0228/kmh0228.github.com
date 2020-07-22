const fs = require('fs');
const gft = require('./getFileType');

fs.readdir('./', (err, files)=> {
	if (err) {
		throw err;
		return
	}

	console.log( gft(files, './') )
})