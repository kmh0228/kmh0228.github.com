
const fs = require('fs');
const path = require('path');


/*
	获取文件类型
	-----------------------------------------
	@filePath 文件根目录
	@files    在 filePath 下的文件数组
*/
function getFileType( files, filePath ) {
	let result = [];

	if (files.length > 0) {
		files.forEach( (val, index) => {
			let thisPath = path.join(filePath, val);
			let stat = fs.statSync( thisPath );
			let type = '';
			if ( stat.isDirectory() ) {
				type = 'dir';
			}
			else {
				type = 'file'
			}

			result.push({
				name: val,
				type: type,
				path: thisPath,
				_stats: stat
			})
		})
	}

	return result;
}

module.exports = getFileType;