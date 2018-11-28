/**
 * create by zhaomingqiang 2017.12.15
 * 
 * HoverMessage对象 用于给overlay类加上hover上去的信息条
 */

define([
	'../../CMap/tools/inherit',
	'../../CMap/tools/Message',
	'../../CMap/tools/mouseFollow',
	'../../CMap/tools/extend'
],function(
	inherit,
	Message,
	mouseFollow,
	extend
){
	
	var HoverMessage = inherit(Message,function(opts){
		var defaul = extend({
			
			
			
		},this.opts);		
		this.opts = extend(opts,defaul);
		
		this.type = 'hoverMessage';
		
	});
		
	HoverMessage.prototype.addInOverlay = function(overlay){
		
		var _this = this;

		overlay.mouseenter(function(){
			_this.show();
		});

		overlay.mouseleave(function(){
			_this.hide();
		});

		mouseFollow(overlay.e,function(loc){
			_this.setPoint({
				x:loc.x + 4,
				y:loc.y + 4
			});
		});
	};
	
	return HoverMessage;
	
});
