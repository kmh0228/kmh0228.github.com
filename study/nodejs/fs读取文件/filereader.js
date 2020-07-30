

 var fs = require('fs');
 var path = require('path');

//读取目录
const getFileType = require('get-file-type');
/*
	查找文件下的所有文件
	-------------------------------------
*/
var result = {}
function findDirFiles(dirPath, inChild) {
	let fileNum = 0, $tNum = 0;
	let fileTypeArr = [];
	let todo = (_Path) => {
		try {
			let files = fs.readdirSync(_Path);
			let fileType = getFileType(files, _Path);
			fileTypeArr = fileTypeArr.concat( fileType );
			fileType.forEach((val, i)=>{
				if (val.type == 'dir' && inChild) {
					todo(path.join(_Path, val.name))
				}else{
					//计算个数
					fileNum ++
					var data = fs.readFileSync(path.join(_Path, val.name));
					var buf = Buffer.from(data);
					var str = buf.toString();
					let arr = str.match(/\$t/g)
					$tNum += arr?arr.length:0


					// 获取文件文字的方法
					// var data = fs.readFileSync(path.join(_Path, val.name));
					// var buf = Buffer.from(data);
					// var str = buf.toString();
					// var reg = /[\u4e00-\u9fa5，？）（。！]*/g;
						// var pageChinaArr = Array.from(new Set(str.match(reg).filter(item => !!item)))
					// var pageChinaArr = Array.from(new Set(str.match(reg)));
					// var length = pageChinaArr.length;
					// for(var i = 0;i<length;i++){
					// 	var name = pageChinaArr[i];
					// 	if(result[name]){result[name]++}else{result[name]=1}
					// }
				}
			})
		} catch (err) {
		}
	}
	todo(dirPath);
	return {fileNum:fileNum,$tNum:$tNum}
}

var numJson = findDirFiles('./views',true)
console.log(numJson)
// fs.writeFile('./result.txt',JSON.stringify(result),function(){
// 	console.log('写入成功')
// })

// fs.readFile('./test/a.txt',function(err,data){
// 	console.log(data);
// 	console.log(data.length);
// 	var buf = Buffer.from(data);
// 	console.log(buf.length);
// 	console.log(buf.toString());
// 	console.log(String.fromCharCode(data[0]))
// 	console.log(String.fromCharCode(data[1]))
// 	console.log(String.fromCharCode(data[2]))
// });




