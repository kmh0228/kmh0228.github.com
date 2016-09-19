window.onload=function(){
	//下拉替换
	xiala('jsxl1','column column1 fl clear cur posr','column column1 fl clear');
	xiala('jsxl2','colum                                                                                              n fl clear posr cur','column fl clear');
	xiala('jsxl3','column column3 fl clear cur posr','column column3 fl clear');
	xiala('jsth1','subnav subnav1 fl cur posr','subnav subnav1 fl')
	xiala('jsth2','subnav fl cur posr','subnav fl')
	xiala('jsth3','subnav fl cur posr','subnav fl')
	xiala('jsth4','subnav fl cur posr','subnav fl')
	xiala('jsth5','subnav fl cur posr','subnav fl')
	xiala('jsth6','subnav fl cur posr','subnav fl')
	xiala('jsth7','subnav fl cur posr','subnav fl')
	xiala('jsth8','subnav fl cur posr','subnav fl')
	xiala('jsth9','subnav fl cur posr','subnav fl')
	function xiala(id,cur,before){
		var oXiala1=document.getElementById(id);
		oXiala1.onmouseover=function(){
				this.className=cur;
		};
		oXiala1.onmouseout=function(){
				this.className=before;	
		};
	};
	
}