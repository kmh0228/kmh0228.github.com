/*
 * create by kmh0228
 * 2018.10.18
 * 
 */
;var CPD;

(function(){
	
	function extend(opts,defaul){
		var opts = opts || {};
		for(var name in defaul){
			if(typeof opts[name] == 'undefined'){
				opts[name] = defaul[name];
			}
		}
		return opts;
	}
	
	function forEach(arr,fn){
		var length = arr.length;
		for(var i = 0; i < length; i ++){
			fn && fn (arr[i],i);
		}
	}
	
	function setStyle(dom,style){
		for(var name in style){
			dom.style[name] = style[name];
		}
	}
	
	function createDom(type,style,className){
		var dom = document.createElement(type);
		if(className)dom.className = className;
		var style = style || {};
		//公用样式
		var defaultStyle = {
			'box-sizing':'border-box',margin:0,default:0
		}
		if(type == 'li'){defaultStyle.listStyle = 'none';}
		setStyle(dom,defaultStyle);
		setStyle(dom,style);
		return dom;
	}
	
	//createInfo
	function appendChilds(obj,childs){
		var length = childs.length;
		for(var i=0;i<length;i++){
			obj.appendChild(childs[i]);
		}
	}
	
	function rightClick(obj,fn){
		obj.addEventListener('contextmenu',function(ev){
			var ev = ev||Event;
			fn&&fn(ev.clientX,ev.clientY);
			ev.cancelBubble=true; ev.preventDefault();return false;
		});
	}
	
	CPD = function(id,data,opts){
		this.obj = document.getElementById(id);
		this.data = data || [];
		this.opts = extend(opts,{
			title:'构建文档',
			titleHeight:50,				//页面主题高度
			menuWidth:'20%',			//左侧菜单栏宽度
			contentWidth:'80%',			//右侧内容栏宽度
			
			colors:{					//颜色搭配
				titleBackColor:'#ccc',	//标题背景颜色
				menuBackColor:'#ddd',	//左侧菜单背景颜色
				infoBackColor:'#eee',	//右侧信息框背景颜色
			},
			gradeColor:['#ddf','#dee','#dfd','#dff'],
			gradePaddingLeft:10
		});
		this.initDom();
		this.initStyle();
		var _this = this;
		window.addEventListener('resize',function(){
			_this.initStyle();
		});
	};
	
	CPD.prototype.initDom = function(){
		var opts = this.opts;
		var colors = opts.colors;
		this.obj.innerHTML = '';
		var _this = this;
		//添加title和内容的容器
		this.title = createDom('div',{background:colors.titleBackColor,height:opts.titleHeight+'px',
			'line-height':opts.titleHeight+'px','text-indent':'10px','font-weight':'bold'});
		this.title.innerHTML = opts.title;
		//添加内容容器
		this.box = createDom('div',{width:'100%',overflow:'hiden',border:'1px solid #fff'});
		appendChilds(this.obj,[this.title,this.box]);
		//添加左侧菜单容器和右侧内容容器
		this.menuBox = createDom('div',{background:colors.menuBackColor,width:opts.menuWidth,height:'100%',float:'left','overflow-y':'auto'});
		this.infoBox = createDom('div',{position:'relative',background:colors.infoBackColor,width:opts.contentWidth,height:'100%',float:'left','overflow-y':'auto'});
		appendChilds(this.box,[this.menuBox,this.infoBox]);
		//添加右键窗口
		this.rightClickBox = createDom('div',{display:'none',position:'absolute',background:'#fff',padding:'5px',borderRadius:'4px'});
		this.rightClickBox.innerHTML = '右键弹出窗口';
		document.body.appendChild(this.rightClickBox)
		//添加左侧菜单
		function createMenu(parent,data,id,grade){
			var ul = createDom('ul',{'padding-left':grade*opts.gradePaddingLeft+'px'});
			forEach(data,function(oneData,i){
				var li = createDom('li',{background:opts.gradeColor[grade]});
				//左侧菜单内容
				var tit = createDom('div',{'border-bottom':'1px solid #fff',cursor:'pointer','text-indent':'4px','line-height':'18px','font-size':'14px'},'cpd_title');
				tit.innerHTML = oneData.name;
				tit.id = id + '_' + i;
				tit.addEventListener('click',function(){
					var id = this.id.replace('menu','info');
					_this.infoBox.scrollTop = document.getElementById(id).offsetTop;
				});
				rightClick(tit,function(x,y){
					setStyle(_this.rightClickBox,{
						display:'block',left:x+5+'px',top:y+5+'px'
					});
				});
				if(oneData.childrens && oneData.childrens.length > 0){
					var con = createDom('div',{display:'none'},'cpd_con');
					con.index = 0;
					appendChilds(li,[tit,con]);
					createMenu(con,oneData.childrens,id + '_' + i,grade+1);
					tit.addEventListener('click',function(ev){
						con.index ++;
						setStyle(con,{display:['none','block'][con.index%2]});
					});
				}else{
					appendChilds(li,[tit]);
				}
				ul.appendChild(li);
			});
			parent.appendChild(ul);
		}
		createMenu(this.menuBox,this.data,'menu',0);	
		//添加右侧内容
		function createCon(data,id,grade){
			forEach(data,function(oneData,i){
				var oDiv = createDom('div',{'margin':'5px',border:'1px solid #666','margin-left':grade*10+'px'});
				var conTit = createDom('div',{background:opts.gradeColor[grade],'text-indent':'4px','line-height':'20px','font-size':'14px'});
				conTit.innerHTML = oneData.name;
				var conCon = createDom('div',{background:'#fff'});
				conCon.innerHTML = oneData.info;
				oDiv.id = id + '_' + i;
				appendChilds(oDiv,[conTit,conCon])
				_this.infoBox.appendChild(oDiv);
				if(oneData.childrens && oneData.childrens.length > 0){
					createCon(oneData.childrens,id + '_' + i,grade+1);
				}
			});
		}
		createCon(this.data,'info',0);	
	};
	
	
	
	CPD.prototype.initStyle = function(){
		var opts = this.opts;
		var objStyle = getComputedStyle(this.obj,false);
		var objWidth = parseInt(objStyle.width);
		var objHeight = parseInt(objStyle.height);
		
		setStyle(this.menuBox,{height:objHeight - opts.titleHeight + 'px'});
		setStyle(this.infoBox,{height:objHeight - opts.titleHeight + 'px'});
	};
		
})();
