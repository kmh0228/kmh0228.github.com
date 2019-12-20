/*
**	author:	kmh0228
**	time:	2017/01/05
**	QQ:		1150123276
**  说明:    计算器类，共有五个方法 加 减 乘 除 次方。 可计算超大数据
*	使用方法
*
*	建立计算器对象,计算结果可达千位
*	var calculator=new Calculator();
*
*	方法
*	calculator.plus(a,b);//计算两个数的和
*	calculator.minus(a,b);//返回两个数的差
*	calculator.multiply(a,b);//返回两个数的积
*	calculator.divide(a,b,fix);//返回两个数的商,fix是保留的小数位
*	calculator.power(a,b);//返回a的b次方
*/

//创建类
function Calculator(opts){
	var opts = this.opts = opts || {};
	this.fix = (typeof opts.fix == 'undefined')?10:opts.fix;  //商的默认小数位
	this.maxOrd = opts.maxOrd || 10000;							//次方的时候结果的最大位数，超出时会警告
	
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
	fix2 = (typeof fix2 == 'undefined')?this.fix:fix2;
	if(b == 0){alert('被除数不可以为0');return '';}
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
	if(fix>0){
		for(var i=0;i<fix;i++){arrB.unshift(0);}
	}else if(fix<0){
		for(var i=0;i<-fix;i++){arrA.unshift(0);}
	}
	//过滤掉后面的0
	while(arrA[arrA.length-1] == 0){
		arrA.pop();
	}
	while(arrB[arrB.length-1] == 0){
		arrB.pop();
	}
	
	var fixto=fix2;
	var fixtab=fixto;
	for(var i=0;i<fixtab;i++){
		arrA.unshift(0);
	}
	var bOk=true;
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
		}else if(lengthA==lengthB){
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
					sum.push([0]);
					break;
				}
			}
			if(eqnum==lengthA){
				sum.push([1]);
				arrA=this.tosingle2(this.arrminute(arrA,arrB));
				bOk=false;
			}
		}else if(lengthA<lengthB){
			sum.push([0]);
			bOk=false;
		}
	}
	var resultarr=this.tosingle2(this.arrplus(sum));
	var tab=fixto-resultarr.length+1;
	if(tab>0){
		for(var i=0;i<tab;i++){
			resultarr.push(0);
		}
	}
	if(fixto){
		resultarr.splice(fixto,0,'.');
		var t=0;
		for(var i=0;i<fixto;i++){
			if(!resultarr[0]){
				resultarr.shift();
				t++;
			}else{
				break;
			}
		}
		if(t==fixto){resultarr.shift();}
	}
	resultarr.reverse();
	result=resultarr.join('');
	if(sign==-1){result='-'+result;}
	if(result==''){return 0;}else{return result;}
}

//次方计算，返回a的b次方
Calculator.prototype.power=function(a,b){
	a=''+a;b=''+b;
	if(!this.numRegExp.test(a)){alert(a+'不是一个数字');return '';}
	if(!/^\d+$/.test(b)){alert(b+'不是一个正整数');return '';}
	b=Number(b);
	var arr=[1];
	var json={1:a};
	if(b==0){return 1;}
	var maxOrd = this.maxOrd;
	var isGo = true;
	do{
		var t=b-arr[0];
		for(var i=0;i<arr.length;i++){
			if(t>=arr[i]){
				var newp=arr[0]+arr[i];
				var re = this.multiply(json[arr[0]],json[arr[i]]);
				if(maxOrd<re.length){
					if(isGo&&confirm('输出结果超出最大位数'+maxOrd+'位,终止运算请点击确认,继续运算请点击取消(可能导致页面卡死)。最大位数警告可通过Calculator的参数maxOrd修改。')){
						return '';
					}else{
						isGo = false;
					};
				}
				json[newp] = re;
				arr.unshift(newp);
				break;
			}
		}
	}while(b!=arr[0]);
	if(b==arr[0]){return json[arr[0]];}
};

function w(arr){
	var arr2=arr.slice(0);
	arr2.reverse();
	return arr2.join('');
}
//开平方计算，返回平方根值,fix为保留小数位数
Calculator.prototype.sqr=function(a,fix){
	//待完善！脑子疼，不写了
	alert('暂不支持开方');
	return;
	a=''+a;
	if(!this.numRegExp.test(a)){alert(a+'不是一个数字');return '';}
	if(/^-/g.test(a)){alert(a+'不是一个正数');return '';}
	var fix=fix||0;
	var randa=a.indexOf('.');
	var arrA=a.split('').reverse();
	var fixtab;
	var pushfix=0;
	if(randa!=-1){
		var fixa=a.length-randa-1;
		arrA.splice(fixa,1);
		fixtab=Math.ceil(fixa/2)>fix?Math.ceil(fixa/2):fix;
		pushfix=fixtab*2-fixa;
	}else{
		fixtab=fix;
		pushfix=fixtab*2;
	}
	//for(var i=0;i<pushfix;i++){
	//	arrA.unshift("0");
	//}
	//把arrA后面的0干掉
	var last;
	do{
		last=arrA.pop();
	}while(last==0);
	last&&arrA.push(last);
	
	var sqLength=Math.ceil(arrA.length/2);
	var sq=[];
	for(var i=0;i<sqLength;i++){
		sq.push('0');
	}
	
	var result=[0];
	var rest=arrA;
	for(var i=sqLength-1;i>-1;i--){
		console.log('开始测试第'+i+'位');
		console.log('当前平方值'+w(result));
		rest=this.tosingle2(this.arrminute(arrA,result));
		console.log('还差'+w(rest));
		if(rest.length==0){
			for(var j=0;j<i;j++){
				sq[j]=0;
			}
			break;
		}
		var sq2=sq.slice(0);
		//假定第一个数字是5
		var t=5;
		console.log('此位先写个5');
		var dir=0;
		console.log('定义数字增减方向');
		for(;;){
			sq2[i]=t;
			//增加的数字为
			var plus=[sq2[i]];
			for(var j=0;j<i;j++){
				plus.unshift('0');
			}
			console.log('增加的数字为'+w(plus));
			//结果为
			var add = this.arrMul(this.arrplus([sq,sq2]),plus);
			console.log('增加的平方值为'+w(add));
			
			var tit='';
			if(dir==0){tit='没定义方向';}else if(dir==-1){tit='减向'}else if(dir==1){tit='加向'}
			console.log('之前的dir方向为'+tit);
			if(this.contrast(rest,add)){
				console.log(w(rest)+'>='+w(add));
				if(dir&&dir==-1){break;}
				t++;
				dir=1;
			}else{
				console.log(w(rest)+'<'+w(add));
				t--;
				if(dir&&dir==1){break;}
				dir=-1;
			}
		}
		sq[i]=t;
		result=this.tosingle(this.arrMul(sq,sq));
	}
	sq.splice(fixtab,0,'.');
	sq.reverse();
	return sq.join('');
};

//a数组*b数组的积   for sqr方法
Calculator.prototype.arrMul=function(a,b){
	var sum=[];
	for(var i=0;i<a.length;i++){
		var arr=[];
		for(var j=0;j<i;j++){
			arr.push(0);
		}
		for(var j=0;j<a.length;j++){
			arr.push(b[i]*a[j])
		}
		sum.push(this.tosingle(arr))
	}
	return this.tosingle(this.arrplus(sum));
};

//把ARR格式改成每项都小于10 eg[10,2] > ][0,3]	
Calculator.prototype.tosingle=function(arr){
	var newarr=[];
	var mod=0;
	for(var i=0;i<arr.length;i++){
		newarr.push((arr[i]+mod)%10);
		mod=parseInt((arr[i]+mod)/10);
	}
	while(mod>9){
		newarr.push(mod%10);
		mod=parseInt(mod/10);
	}
	if(mod!=0)newarr.push(mod);
	return newarr;
};

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

//把两个反向数组对比谁大谁小 >= true  < false  
Calculator.prototype.contrast=function(arrA,arrB){
	var aLength=arrA.length;
	var bLength=arrB.length;
	if(aLength<bLength){
		return false;
	}else if(aLength==bLength){
		for(var i=aLength-1;i>-1;i--){
			if(Number(arrA[i])<Number(arrB[i])){
				return false;
			}else if(Number(arrA[i])>Number(arrB[i])){
				return true;
			}
		}
	}
	return true;
}





