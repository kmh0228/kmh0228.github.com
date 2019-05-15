/**
 * 模拟下拉框组件
 */
/*
var select=new ImitateSelect(obj,data,fn,opts);//建立 select框对象
			参数说明  obj : jquery对象
					data : 下拉框里的数据(数据)，数组里可以是值，也可以是json，如果是json有对应的dataName和dataId
					fn  :  回掉函数 参数为 {name:name,id:id}//name是输入框内容  id是隐藏value
					opts:  {},设置参数
                        dataName:'name',//option的html
                        dataId:'id',//option的value						
                        fontSize:'14',//字体大小
                        optionFontSize:'14',//下拉框字体大小
                        textIndent:4,//字体缩进						
                        color:'#000',//输入框字体颜色
                        optionColor:'#000',//下拉框字体颜色
                        arrowColor:'green',//箭头颜色
                        backgroundColor:'#ccc',//背景色颜色
                        borderColor:'green',//边线颜色
                        hoverColor:'green',//下拉框HOVER颜色						
                        borderWidth:1,//边线宽度
                        arrowBorderWidth:0,//箭头左侧分割线宽度。如果为0则不显示
                        borderRadius:5,//边线圆角						
                        placeholder:'请输入文字',//默认提示
						defalut:'firstData',//默认显示内容。如果是'firstData',则默认显示第一个
						placeId:''	,//输入不是下拉框内容的值时返回的id
                        retur:false,//是否阻止在建立数据后调用回掉函数
                        allowInput:true,//是否允许输入						
                        width:130,//宽
                        height:26,//高
                        optionMaxHeight:500//下拉框最大高度
                        iwidth:height//右侧下拉按钮的宽度,默认跟高度一样
						
			方法  changeList(data,opts) 改变数据,data为数据，opts为参数{retur:false;//是否阻止在建立数据后调用回掉函数}
				changeFnBack(fn)  改变回掉函数
				getResult()       获取当前选择项	
				close()           隐藏下拉框
				setValue(name)		设置框内的值
*/	

//obj为jquery对象
import $ from 'jquery'
function ImitateSelect(obj,data,fn,opts){
	//储存信息
	var obj=this.obj=obj;
	var data=this.data=data||[];
	var opts=this.opts=opts||{};
	var dataName=this.dataName=opts.dataName||'name';
	var dataId=this.dataId=opts.dataId||'id';
	var placeId = this.placeId = opts.placeId || '';

	var fontSize=this.fontSize=opts.fontSize||'12';
	var optionFontSize=opts.optionFontSize||'12';
	var textIndent=this.textIndent=opts.textIndent||4;
	
	var color=this.color=opts.color||'#000';
	var optionColor=opts.optionColor||'#000';
	var arrowColor=opts.arrowColor||'#5c5c5c';
	var borderColor=opts.borderColor||'#969696';
	var hoverColor=this.hoverColor=opts.hoverColor||'#f5f5f5';
	var backgroundColor=opts.backgroundColor||'#fff';
	
	var placeholder=this.placeholder=opts.placeholder||'';
	var defalut=this.defalut=(typeof opts.defalut != 'undefined')?opts.defalut:'firstData';
	var width=this.width=opts.width||157;
	var height=this.height=opts.height||20;
	var optionMaxHeight=opts.optionMaxHeight||360;
	var iwidth=opts.iwidth||height;

	var borderWidth=this.borderWidth=opts.borderWidth||1;
	var borderRadius=opts.borderRadius||0;
	var arrowBorderWidth=typeof opts.arrowBorderWidth=='undefined'?borderWidth:opts.arrowBorderWidth;
	var allowInput=this.allowInput=typeof opts.allowInput=='undefined'?true:opts.allowInput;
		
	this.fnBack=fn;
	var _this=this;
	this.fn=function(result){
		_this.result=result;
		this.fnBack&&this.fnBack(result);
	};
	
//建立DOM
	obj.html('<input type="text" value="'+defalut+'" placeholder="'+placeholder+'"/>\
				<div class="overlay"></div>\
				<i><em></em></i>\
				<ul>\
				</ul>');
	var $ul=this.ul=obj.find('ul');
	var $input=this.input=obj.find('input');
	var retur=this.retur=opts.retur||false;
	this.changeList(data,{retur:retur});
	//设置样式	
	var pos=obj.css('position')=='static'?'relative':obj.css('position');
	obj.css({'width':width,'height':height,'position':pos,'border':borderWidth+'px solid '+borderColor,'border-radius':borderRadius+'px','background':backgroundColor});
	obj.find('*').css({'margin':0,'padding':0});
	$input.css({'color':color,'width':'100%','height':'100%','font-size':fontSize+'px','text-indent':textIndent+'px','border':'none','background':'none','outline':'none'});
	var overlay=obj.find('.overlay');
	overlay.css({'position':'absolute','top':0,'right':0,'width':'100%','height':'0'});
	obj.find('i').css({'width':iwidth,'height':'100%','position':'absolute','top':0,'right':0,'border-left':arrowBorderWidth+'px solid '+borderColor,'cursor':'pointer'});
	var arrBorder=parseInt(iwidth/4);
	var arrMarTop=parseInt(height/2-iwidth/8);
	obj.find('i em').css({'display':'block','width':'0px','border':arrBorder+'px solid transparent','border-top':arrBorder+'px solid '+arrowColor,'margin':arrMarTop+'px auto'});
	obj.find('ul').css({'position':'absolute','color':optionColor,'font-size':optionFontSize+'px','width':'100%','left':-borderWidth,'top':height+borderWidth,'border-left':borderWidth+'px solid '+borderColor,'border-right':borderWidth+'px solid '+borderColor,'border-bottom':borderWidth+'px solid '+borderColor,'background':backgroundColor,'z-index':999,'display':'none','max-height':optionMaxHeight+'px','overflow-y':'auto','overflow-Y':'auto','border-radius':borderRadius+'px'});	
	
	if(!allowInput){
		$input.on('focus',function(){
			$input.blur();
		});
		overlay.css({'cursor':'pointer','height':'100%'});
		overlay.on('click',function(){
			$ul.toggle();
		});
	}

	//添加事件
	this.addEvent();
}

ImitateSelect.prototype.addEvent=function(){
	var $ul=this.ul;
	var $input=this.input;
	var obj=this.obj;
	var _this=this;
	//添加事件

	//下拉框内容点击
	$ul.on('click','li',function(){
		$ul.hide();
		var html=$(this).html();
		var index_id=$(this).attr('index_id');
		$input.val(html).attr('index_id',index_id).attr('title',html);
		_this.fn&&_this.fn({name:html,id:index_id});
	});
	
	//下拉按钮点击
	obj.off('click');
	obj.on('click','i',function(){
		$ul.toggle();
	});
	//tab切换选框处理
	$(document).on('focus','input',function(){
		if(!obj.has($(this)).length){
			$ul.hide();
		}
	});
	//默认点其他按钮关掉下拉框
	$(document).on('click',function(e){
		var src=e.srcElement||e.target;
		if(!obj.has(src).length){
			$ul.hide();
		}
	});

	//输入事件
	this.allowInput&&$input.focus(function(){
		$ul.show();
		var $this=$(this);
		var $val=$this.val().replace(' ','');
		$this.timer=setInterval(function(){
			var inputval=$this.val().replace(' ','');
			if(inputval!=$val){
				$val=inputval;
				if(inputval==''){
					$ul.children().show();
					_this.fn&&_this.fn({name:'',id:_this.placeId});
					return;
				}else{
					$ul.children().hide();
					$ul.children(':contains('+$val+')').show();
					var finded=false;
					$ul.find('li').each(function(i,e){
						var html=e.innerHTML;
						if(html==$val){
							finded=true;
							var id=$(e).attr('index_id');
							_this.fn&&_this.fn({name:html,id:id});
							return false;
						}
					});
					if(!finded){_this.fn&&_this.fn({name:$val,id:'error'});}
				}
			}
		},100);
		var toblur=function(){
			clearInterval($this.timer);
			$this.off('blur');
			$this.off('keydown');
			//$ul.hide();
		};
		$this.on('blur',toblur);

		var tokeydown=function(event){
			var length=$ul.children('li:visible').length;
			switch(event.keyCode){
				case 40:
					_this.n++;
					if(_this.n>length){_this.n=length}
					var n=_this.n;
					$ul.children('li').css('background','none');
					$ul.children('li:visible').eq(n-1).css('background',_this.hoverColor);
					if(n*$ul.children('li:visible').height()>$ul.height()){
						$ul.scrollTop(n*$ul.children('li:visible').height()-$ul.height());
					}
					return false;
				break;
				case 38:
					_this.n--;
					if(_this.n<1){_this.n=1}
					var n=_this.n;
					$ul.children('li').css('background','none');
					$ul.children('li:visible').eq(n-1).css('background',_this.hoverColor);
					if((n-1)*$ul.children('li:visible').height()<$ul.scrollTop()){
						$ul.scrollTop((n-1)*$ul.children('li:visible').height()||0);
					}
					return false;
				break;
				case 13:
					if(_this.n){
						var index_id=$ul.children('li:visible').eq(_this.n-1).attr('index_id');
						var html=$ul.children('li:visible').eq(_this.n-1).html();
						$input.val(html).attr('index_id',index_id).attr('title',html);
						_this.fn&&_this.fn({name:html,id:index_id});						
					}
					$this.blur();
					$ul.hide();
					return false;
				break;
			}
		}
		$this.on('keydown',tokeydown);
		return false;
	});	
	
};

ImitateSelect.prototype.changeList=function(jsons,opts){
	if(!this.input)return;
	var opts=opts||{};
	var retur=opts.retur||false;//是否阻止后续事件
	var length=jsons.length;
	var $ul=this.ul;
	var lis='';
	var dataName=this.dataName;
	var dataId=this.dataId;	
	if(!length){	
		$ul.html(lis);
		this.input.val('').attr('index_id','');
		var empty = {};
		empty[dataName] = empty[dataId] = '';
		(!this.retur)&&this.fn&&this.fn(empty);
		return;
	}
	var _this=this;
	var obj=this.obj;
	
	if(jsons[0].constructor==Object){
		var data=this.data=jsons;
	}else{
		var arr=[];
		for(var i=0;i<length;i++){
			var json={};
			json[dataName]=jsons[i];
			json[dataId]=jsons[i];
			arr.push(json);
		}
		var data=this.data=arr;
	};
	
	//建立默认值
	var defalut={};
	switch(this.defalut){
		case '':defalut.name='';defalut.id='';break;
		case 'firstData':defalut.name=data[0][dataName];defalut.id=data[0][dataId];break;
		case 'secondData':defalut.name=data[1][dataName];defalut.id=data[1][dataId];break;
		default:
			defalut.name=this.defalut;
			defalut.id='';
			for(var i=0;i<length;i++){
				if(data[i][dataName]==this.defalut){
					defalut.id=data[i][dataId];
					break;
				}
			}
		break;
	}
	this.input.val(defalut.name).attr('index_id',defalut.id).attr('title',defalut.name);
	(!this.retur)&&this.fn&&this.fn(defalut);
	
	this.n=0;
	for(var i=0;i<length;i++){
		var one=data[i];
		lis+='<li index_id="'+one[dataId]+'" title="'+one[dataName]+'">'+one[dataName]+'</li>';		
	}
	$ul.html(lis);
	$ul.find('li').css({'list-style':'none','text-indent':this.textIndent+'px','height':this.height,'font-size':this.fontSize,'line-height':this.height+'px','white-space':'nowrap','cursor':'pointer','overflow':'hidden'});
	//下拉内容hover
	$ul.find('li').hover(function(){	
		$(this).css('background',_this.hoverColor).siblings().css('background','none');
		_this.n=obj.find('li:visible').index($(this))+1;
	},function(){
		$(this).css('background','none');
	});
};

ImitateSelect.prototype.changeFnBack=function(fnBack){
	this.fnBack=fnBack;
};

ImitateSelect.prototype.getResult=function(){
	return this.result;
};

ImitateSelect.prototype.close=function(){
	this.ul.hide();
};

ImitateSelect.prototype.setValue=function(name){
	var val=this.defalut;
	this.defalut=name;
	this.changeList(this.data);
	this.defalut=val;
};

export default function(){
    return new ImitateSelect(...arguments)
}

	
