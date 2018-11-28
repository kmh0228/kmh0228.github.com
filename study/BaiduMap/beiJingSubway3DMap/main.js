requirejs.config({
	baseUrl:'CMap',
	paths:{
		"log":'tools/log',
		"CMap":'CMap',
		"forEach":'tools/forEach'
	}
});

requirejs([
	'log',
	'CMap',
	'forEach'
	],
	function(log,CMap,forEach){
		//mapPicSrc:'CMap/images/大屏首页_BG.jpg'
		var cMap = new CMap.Map('CMapContainer',{
			//mapPicSrc:'CMap/images/大屏首页_BG.jpg'
		});


		var Rectangle = new CMap.Rectangle({x:200,y:600,l:10,w:10,h:100});
		cMap.addOverlay(Rectangle);


		var Rectangle2 = new CMap.Rectangle({x:200,y:200,l:10,w:10,h:50});
		cMap.addOverlay(Rectangle2);

		var Rectangle3 = new CMap.Rectangle({x:300,y:300,l:10,w:10,h:75});
		cMap.addOverlay(Rectangle3);

		var Rectangle4 = new CMap.Rectangle({x:400,y:400,l:10,w:10,h:124});
		cMap.addOverlay(Rectangle4);

		var Rectangle5 = new CMap.Rectangle({x:200,y:400,l:10,w:10,h:100});
		cMap.addOverlay(Rectangle5);

		var Message = new CMap.HoverMessage({inner:'出客量:100'});
		
		var arr = [Rectangle,Rectangle2,Rectangle3,Rectangle4,Rectangle5];
		forEach(arr,function(Rectangle){
			Rectangle.mouseenter(function(){
				this.setColor('green');
			});
			Rectangle.mouseleave(function(){
				this.setColor('blue');
			});
			Rectangle.addHoverMessage(Message);
		});


	}
);