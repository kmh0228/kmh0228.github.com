;function inputChange(obj,fn){
	var oldval=obj.val();
	obj.on('focus',function(){
		clearInterval(obj.timer);
		obj.timer=setInterval(function(){
			var newval=obj.val();
			if(!(newval===oldval)){
				oldval=newval;
				fn&&fn(newval);
			}
		},30);
	});
	obj.on('blur',function(){
		clearInterval(obj.timer);
	});
}

function getMin(){
	var arr = arguments;
	var min = arr[0];
	for(var i=1;i<arr.length;i++){
		if(arr[i]<min){min=arr[i];}
	}
	return min;
}

function getMax(){
	var arr = arguments;
	var max = arr[0];
	for(var i=1;i<arr.length;i++){
		if(arr[i]>max){max=arr[i];}
	}
	return max;
}

//RGB - HSL
//RGB更改
	var inputs1 = $('.con_l .color input');
	var inputs2 = $('.con_l .hsl input');
	var inputs3 = $('.con_r .color input');
	var inputs4 = $('.con_r .hsv input');
	
	inputChange(inputs1.eq(0),rgbhsl);
	inputChange(inputs1.eq(1),rgbhsl);
	inputChange(inputs1.eq(2),rgbhsl);
	function rgbhsl(){
		var r = (inputs1.eq(0).val()||0)/255;
		var g = (inputs1.eq(1).val()||0)/255;
		var b = (inputs1.eq(2).val()||0)/255;
		var min = getMin(r,g,b);
		var max = getMax(r,g,b);
		var delM = max-min;
		var h,s;
		var l = (max+min)/2;
		if(delM == 0){
			h = 0; s = 0;
		}else{
			if(l<0.5){
				s = delM / (max + min);
			}else{
				s = delM / (2 - max - min);
			}
			var dr = (((max - r) / 6.0) + (delM / 2.0)) / delM;
			var dg = (((max - g) / 6.0) + (delM / 2.0)) / delM;
			var db = (((max - b) / 6.0) + (delM / 2.0)) / delM;
			if(r == max){
				h = db = dg;
			}else if(g == max){
				h =  (1.0 / 3.0) + dr - db;
			}else if(b == max){
				h =  (2.0 / 3.0) + dg - dr;
			}
			if(h<0){h+=1;}
			if(h>1){h-=1;}
		}
		inputs2.eq(0).val(Math.round(h*100));
		inputs2.eq(1).val(Math.round(s*100));
		inputs2.eq(2).val(Math.round(l*100));
	}

	inputChange(inputs2.eq(0),hslrgb);
	inputChange(inputs2.eq(1),hslrgb);
	inputChange(inputs2.eq(2),hslrgb);
	function hue2RGB(v1,v2,vH){
	    if (vH < 0) vH += 1;
	    if (vH > 1) vH -= 1;
	    if (6.0 * vH < 1) return v1 + (v2 - v1) * 6.0 * vH;
	    if (2.0 * vH < 1) return v2;
	    if (3.0 * vH < 2) return v1 + (v2 - v1) * ((2.0 / 3.0) - vH) * 6.0;
	    return v1;
	}
	function hslrgb(){
		var h = (inputs2.eq(0).val()||0)/100;
		var s = (inputs2.eq(1).val()||0)/100;
		var l = (inputs2.eq(2).val()||0)/100;
		var r,g,b;
		var v1,v2;
		if(s==0){
			r=g=b=l*255;
		}else{
			if(l<0.5){
				v2 = l*(1+s);
			}else{
				v2 = (l+s) - (s*l);
			}
			v1 = 2*l - v2;
			r = 255.0 * hue2RGB(v1, v2, h + (1.0 / 3.0));
	        g = 255.0 * hue2RGB(v1, v2, h);
	        b = 255.0 * hue2RGB(v1, v2, h - (1.0 / 3.0));
		}
		inputs1.eq(0).val(r);
		inputs1.eq(1).val(g);
		inputs1.eq(2).val(b);
	}
