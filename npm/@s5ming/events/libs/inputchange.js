
import on from './on'
const inputchange = function (obj,fn){
    var oldval=obj.value;
    on(obj,'focus',function(){
        clearInterval(obj.timer);
        obj.timer=setInterval(function(){
            var newval=obj.value;
            //if(newval=='')return;
            if(!(newval===oldval)){
                oldval=newval;
                fn&&fn(newval);
            }
        },30);
    });
    on(obj,'blur',function(){
        clearInterval(obj.timer);
    });
}
export default inputchange
