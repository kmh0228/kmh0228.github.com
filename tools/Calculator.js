/*
**	author:	kmh0228
**	time:	2017/01/05
**	QQ:		1150123276
*/


//创建类
function Calculator(){
	this.numRegExp=/^-?\d+.?\d*$/;
}

//两个数值相加，返回和
Calculator.prototype.plus=function(a,b){
	a=''+a;b=''+b;
	if(!this.numRegExp.test(a)){alert(a+'不是一个数字');return '';}
	if(!this.numRegExp.test(b)){alert(b+'不是一个数字');return '';}
	if(a.charAt(0)=='-'&&b.charAt(0)!='-'){
		a=a.substring(1);
		return this.minus(b,a);
	}else if(a.charAt(0)=='-'&&b.charAt(0)=='-'){
		a=a.substring(1);b=b.substring(1);
		return '-'+this.plus(a,b);
		return this.minus(b,a);
	}else if(a.charAt(0)!='-'&&b.charAt(0)=='-'){
		b=b.substring(1);
		return this.minus(a,b);
	}else if(a.charAt(0)!='-'&&b.charAt(0)!='-'){
		var fix=0;
		var randa=a.indexOf('.');
		var randb=b.indexOf('.');
		var arrA=a.split('').reverse();
		var arrB=b.split('').reverse();
		if(randa==-1&&randb==-1){
		}else if(randa!=-1&&randb==-1){
			var fixa=fix=a.length-randa-1;
			arrA.splice(fixa,1);
			for(var i=0;i<fix;i++){
				arrB.unshift(0);
			}
		}else if(randa==-1&&randb!=-1){
			var fixb=fix=b.length-randb-1;
			arrB.splice(fixb,1);
			for(var i=0;i<fix;i++){
				arrA.unshift(0);
			}
		}else if(randa!=-1&&randb!=-1){
			var fixa=a.length-randa-1;
			var fixb=b.length-randb-1;
			arrA.splice(fixa,1);
			arrB.splice(fixb,1);
			if(fixa>fixb){
				fix=fixa;
				for(var i=0;i<fixa-fixb;i++){
					arrB.unshift(0);
				}
			}else{
				fix=fixb;
				for(var i=0;i<fixb-fixa;i++){
					arrA.unshift(0);
				}
			}
		}
		var resultarr=this.tosingle(this.arrplus([arrA,arrB]));
		var tab=fix-resultarr.length+1;
		if(tab>0){
			for(var i=0;i<tab;i++){
				resultarr.push(0);
			}
		}
		if(fix){
			resultarr.splice(fix,0,'.');
			var t=0;
			for(var i=0;i<fix;i++){
				if(!resultarr[0]){
					resultarr.shift();
					t++;
				}else{
					break;
				}
			}
			if(t==fix){resultarr.shift();}
		}
		resultarr.reverse();
		result=resultarr.join('');
		if(result==''){return 0;}else{return result;}
	}
}

//两个数值相减，返回差
Calculator.prototype.minus=function(a,b){
	a=''+a;b=''+b;
	if(!this.numRegExp.test(a)){alert(a+'不是一个数字');return '';}
	if(!this.numRegExp.test(b)){alert(b+'不是一个数字');return '';}
	if(a.charAt(0)=='-'&&b.charAt(0)!='-'){
		a=a.substring(1);
		return '-'+this.plus(a,b);
	}else if(a.charAt(0)=='-'&&b.charAt(0)=='-'){
		a=a.substring(1);b=b.substring(1);
		return this.minus(b,a);
	}else if(a.charAt(0)!='-'&&b.charAt(0)=='-'){
		b=b.substring(1);
		return this.plus(a,b);
	}else if(a.charAt(0)!='-'&&b.charAt(0)!='-'){
		var fix=0;
		var randa=a.indexOf('.');
		var randb=b.indexOf('.');
		var arrA=a.split('').reverse();
		var arrB=b.split('').reverse();
		if(randa==-1&&randb==-1){
		}else if(randa!=-1&&randb==-1){
			var fixa=fix=a.length-randa-1;
			arrA.splice(fixa,1);
			for(var i=0;i<fix;i++){
				arrB.unshift(0);
			}
		}else if(randa==-1&&randb!=-1){
			var fixb=fix=b.length-randb-1;
			arrB.splice(fixb,1);
			for(var i=0;i<fix;i++){
				arrA.unshift(0);
			}
		}else if(randa!=-1&&randb!=-1){
			var fixa=a.length-randa-1;
			var fixb=b.length-randb-1;
			arrA.splice(fixa,1);
			arrB.splice(fixb,1);
			if(fixa>fixb){
				fix=fixa;
				for(var i=0;i<fixa-fixb;i++){
					arrB.unshift(0);
				}
			}else{
				fix=fixb;
				for(var i=0;i<fixb-fixa;i++){
					arrA.unshift(0);
				}
			}
		}
		var resultarr;
		var z=this.contrast(arrA,arrB);
		if(z){
			resultarr=this.arrminute(arrA,arrB);
		}else{
			resultarr=this.arrminute(arrB,arrA);
		}
		var tab=fix-resultarr.length+1;
		if(tab>0){
			for(var i=0;i<tab;i++){
				resultarr.push(0);
			}
		}
		if(fix){
			resultarr.splice(fix,0,'.');
			var t=0;
			for(var i=0;i<fix;i++){
				if(!resultarr[0]){
					resultarr.shift();
					t++;
				}else{
					break;
				}
			}
			if(t==fix){resultarr.shift();}
		}
		resultarr.reverse();
		result=resultarr.join('');
		if(!z){result='-'+result;}
		if(result==''){return 0;}else{return result;}
	}
}

//两个数值相乘，返回积
Calculator.prototype.multiply=function(a,b){
	a=''+a;b=''+b;
	if(!this.numRegExp.test(a)){alert(a+'不是一个数字');return '';}
	if(!this.numRegExp.test(b)){alert(b+'不是一个数字');return '';}
	var sign=1;
	if(a.charAt(0)=='-'){
		a=a.substring(1);sign*=-1;
	}
	if(b.charAt(0)=='-'){
		b=b.substring(1);sign*=-1;
	}
	var fix=0;
	var randa=a.indexOf('.');
	var randb=b.indexOf('.');
	var arrA=a.split('').reverse();
	var arrB=b.split('').reverse();
	if(randa!=-1){
		var fixa=a.length-randa-1;
		fix+=fixa;
		arrA.splice(fixa,1);
	}
	if(randb!=-1){
		var fixb=b.length-randb-1;
		fix+=fixb;
		arrB.splice(fixb,1);
	}
	var sum=[];
	for(var i=0;i<arrB.length;i++){
		var arr=[];
		for(var j=0;j<i;j++){
			arr.push(0);
		}
		for(var j=0;j<arrA.length;j++){
			arr.push(arrB[i]*arrA[j])
		}
		sum.push(this.tosingle(arr))
	}
	var resultarr=this.tosingle(this.arrplus(sum));
	var tab=fix-resultarr.length+1;
	if(tab>0){
		for(var i=0;i<tab;i++){
			resultarr.push(0);
		}
	}
	if(fix){
		resultarr.splice(fix,0,'.');
		var t=0;
		for(var i=0;i<fix;i++){
			if(!resultarr[0]){
				resultarr.shift();
				t++;
			}else{
				break;
			}
		}
		if(t==fix){resultarr.shift();}
	}
	resultarr.reverse();
	result=resultarr.join('');
	if(sign==-1){result='-'+result;}
	if(result==''){return 0;}else{return result;}
}

//两数相除，返回商,fix为保留小数位数
Calculator.prototype.divide=function(a,b,fix2){
	a=''+a;b=''+b;
	if(!this.numRegExp.test(a)){alert(a+'不是一个数字');return '';}
	if(!this.numRegExp.test(b)){alert(b+'不是一个数字');return '';}
	var sign=1;
	if(a.charAt(0)=='-'){
		a=a.substring(1);sign*=-1;
	}
	if(b.charAt(0)=='-'){
		b=b.substring(1);sign*=-1;
	}
	var fix=0;
	var randa=a.indexOf('.');
	var randb=b.indexOf('.');
	var arrA=a.split('').reverse();
	var arrB=b.split('').reverse();
	if(randa!=-1){
		var fixa=a.length-randa-1;
		fix+=fixa;
		arrA.splice(fixa,1);
	}
	if(randb!=-1){
		var fixb=b.length-randb-1;
		fix-=fixb;
		arrB.splice(fixb,1);
	}
	var sum=[];
	var fixto=fix2||fix2==0?fix2:10;
	fixtab=fix>=fixto?0:fixto-fix;
	fix+=fixtab;
	for(var i=0;i<fixtab;i++){
		arrA.unshift(0);
	}
	var bOk=true;
	//setInterval(whil,300);
	while(bOk){
		var lengthA=arrA.length;
		var lengthB=arrB.length;
		if(lengthA>lengthB){
			var t=lengthA-lengthB;
			var arr=[];
			if(Number(arrA[lengthA-1])>Number(arrB[lengthB-1])){
				for(var i=0;i<t;i++){
					arr.push(0);
				}
				arr.push(1);
			}else{
				for(var i=0;i<t-1;i++){
					arr.push(0);
				}
				arr.push(1);
			}
			sum.push(arr);
			var chushu=arr.slice(0,arr.length-1).concat(arrB);
			arrA=this.tosingle2(this.arrminute(arrA,chushu));
		}else if(lengthA=lengthB){
			var eqnum=0;
			for(var i=0;i<lengthA;i++){
				if(arrA[lengthA-1-i]>arrB[lengthB-1-i]){
					sum.push([1]);
					arrA=this.tosingle2(this.arrminute(arrA,arrB));
					break;
				}else if(arrA[lengthA-1-i]==arrB[lengthB-1-i]){
					eqnum++;
				}else if(arrA[lengthA-1-i]<arrB[lengthB-1-i]){
					bOk=false;
					break;
				}
			}
			if(eqnum==lengthA){
				sum.push([1]);
				arrA=this.tosingle2(this.arrminute(arrA,arrB));
				bOk=false;
			}
			
		}else if(lengthA<lengthB){bOk=false;}
	}
	
	
	var resultarr=this.tosingle2(this.arrplus(sum));
	var tab=fix-resultarr.length+1;
	if(tab>0){
		for(var i=0;i<tab;i++){
			resultarr.push(0);
		}
	}
	if(fix){
		resultarr.splice(fix,0,'.');
		var t=0;
		for(var i=0;i<fix;i++){
			if(!resultarr[0]){
				resultarr.shift();
				t++;
			}else{
				break;
			}
		}
		if(t==fix){resultarr.shift();}
	}
	resultarr.reverse();
	result=resultarr.join('');
	if(sign==-1){result='-'+result;}
	if(result==''){return 0;}else{return result;}
}

//把ARR格式改成每项都小于10 eg[10,2] > ][0,3]	
Calculator.prototype.tosingle=function(arr){
	var newarr=[];
	var mod=0;
	for(var i=0;i<arr.length;i++){
		newarr.push((arr[i]+mod)%10);
		mod=parseInt((arr[i]+mod)/10);
	}
	while(mod>9){
		newarr.push(mod%10)
		mod=parseInt(mod/10);
	}
	if(mod!=0)newarr.push(mod);
	return newarr;
}

//把多个数组对应的加起来 arr> [[1,2][1][300]]==>[302,2]
Calculator.prototype.arrplus=function(arr){
	var newarr=[];
	var start=0;
	var length=arr.length;
	var error=0;
	while(error<length){
		var num=0;
		error=0;
		for(var i=0;i<length;i++){
			if(!arr[i][start]&&arr[i][start]!=0)error++;
			num+=arr[i][start]?Number(arr[i][start]):0;
		}
		if(error<length)newarr.push(num);
		start++;
	}
	console.log('导出累加后的数组v');
	console.log(newarr);
	return newarr;
}

//把ARR格式改成每项都小于10 eg[10,2] > ][0,3]
//tosingle的升级，支持数组内是负数
Calculator.prototype.tosingle2=function(arr){
	var newarr=[];
	var mod=0;
	for(var i=0;i<arr.length;i++){
		var iNow=arr[i]+mod;
		if(iNow>=0){
			newarr.push(iNow%10);
			mod=parseInt(iNow/10);
		}else{
			if(iNow%10==0){
				newarr.push(iNow%10);
				mod=parseInt(iNow/10);
			}else{
				newarr.push(10+(iNow%10));
				mod=parseInt((iNow/10)-1);
			}
		}
	}
	while(mod>9||mod<-9){
		var iNow=arr[i]+mod;
		if(iNow>=0){
			newarr.push(iNow%10);
			mod=parseInt(iNow/10);
		}else{
			if(iNow%10==0){
				newarr.push(iNow%10);
				mod=parseInt(iNow/10);
			}else{
				newarr.push(10+(iNow%10));
				mod=parseInt((iNow/10)-1);
			}
		}
	}
	if(mod!=0)newarr.push(mod);
	while(newarr[newarr.length-1]==0){
		newarr.pop();
	}
	return newarr;
}

//把两个数组对应的数相减 arr> [[1,2][1][300][5][7]]
Calculator.prototype.arrminute=function(arr1,arr2){
	var newarr=[];
	var length=arr1.length>arr2.length?arr1.length:arr2.length;
	for(var i=0;i<length;i++){
		if(!arr1[i]&&arr1[i]!=0){
			var a=0;
		}else{
			var a=Number(arr1[i]);
		}
		
		if(!arr2[i]&&arr2[i]!=0){
			var b=0;
		}else{
			var b=Number(arr2[i]);
		}
		newarr.push(a-b);
	}
	return this.tosingle2(newarr);
}

//把两个数对比谁大谁小 > true  <= false 
Calculator.prototype.contrast=function(arrA,arrB){
	var aLength=arrA.length;
	var bLength=arrB.length;
	if(aLength<bLength){
		return false;
	}else if(aLength==bLength){
		for(var i=0;i<aLength;i++){
			if(Number(arrA[i])<Number(arrB[i])){
				return false;
			}
		}
	}
	return true;
}





