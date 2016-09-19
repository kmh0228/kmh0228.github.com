// JavaScript Document
//选项卡
function getStyle(obj,name){
	return obj.currentStyle?obj.currentStyle[name]:getComputedStyle(obj,false)[name];
}

	function Tab(box,btn,con){
		if(!(btn||con)){return false;}
		this.obox=box;
		this.ocon=con;
		this.aBtn = btn.children;
		this.aDiv = con.children;
		this.iNow = 0;	
		this.init();
	}
	Tab.prototype.init = function(){
		var _this = this;
		for(var i =0 ;i<this.aBtn.length;i++){
				this.aBtn[i].index=i;
				this.aBtn[i].onclick = function(){
					_this.iNow = this.index;
					_this.tab();
				};
		}
	};
	Tab.prototype.tab = function(){
		for(var i =0 ;i<this.aBtn.length;i++){
			this.aBtn[i].className = '';
			this.aDiv[i].style.display = 'none';
		}	
		this.aBtn[this.iNow].className = 'cur';
		this.aDiv[this.iNow].style.display = 'block';
	};
//自动播放选项卡	
	function autoTab(){
		Tab.apply(this,arguments);
		this.autotab();
		this.autostog();
	}
	autoTab.prototype=new Tab();
	autoTab.prototype.constructor=autoTab;
	autoTab.prototype.autotab=function(){
		var _this=this;
		clearInterval(this.obox.timer);
		this.obox.timer=setInterval(function(){
			_this.iNow++;
			if(_this.iNow==_this.aBtn.length){_this.iNow=0}
			_this.tab();
		},1000);
	};
	autoTab.prototype.autostog=function(){
		var _this=this;
		this.obox.onmouseover=function(){
			clearInterval(_this.obox.timer);
		};
		this.obox.onmouseout=function(){
			if(getStyle(_this.ocon,'height')!='0px'){
				clearInterval(_this.obox.timer);
				_this.obox.timer=setInterval(function(){
					_this.iNow++;
					if(_this.iNow==_this.aBtn.length){_this.iNow=0}
					_this.tab();
				},1000);
			}
		};
	};