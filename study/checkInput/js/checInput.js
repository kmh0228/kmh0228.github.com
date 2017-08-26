function checkInput(obj,opts){
	var opts=opts||{};
	var showTBit=typeof opts.showTBit=='undefined'?true:opts.showTBit;
	var fixed=typeof opts.fixed=='undefined'?2:opts.fixed;
	var preventkey=false;
	obj.onfocus=function(){
		preventkey=true;
		this.value=this.value.replace(/,/g,'');
	};
	obj.onblur=function(){
		preventkey=false;
		var val=this.value.replace(/,/g,'');
		if(!val)return;
		var n=(Number(val).toFixed(fixed) + '');
		console.log(n);
		var ns=n.split('.');
		var z=ns[0],l=ns[1];
		console.log(z);
		console.log(l);
		var zl=z.length;
		console.log('zl'+zl);
		var zs=[];
		if(zl>3){
			while(zl>3){
				zs.unshift(z.substring(zl-3,zl));
				zl-=3;
			}		
		}
		zs.unshift(z.substr(0,zl));
		console.log(zs);
		var newval='';
		var zsl=zs.length;
		for(var i=0;i<zsl;i++){
			if(i){
				newval+=','+zs[i];
			}else{
				newval+=zs[i];
			}
		}
		console.log('l '+l);
		if(l)newval+='.'+l;
		this.value=newval;
		console.log('newval '+newval);
	};
	obj.onkeydown=function(e){
		if(preventkey){
			var oE=e||event;
			var c=oE.keyCode;
			var b1=c==110||c==190||c==8||c==37||c==39||c==38||c==40||c==13;
			var b2=c>95&&c<106;
			var b3=c>47&&c<56;
			var sb=b1||b2||b3;
			if(!sb)return false;
		};
	};
}