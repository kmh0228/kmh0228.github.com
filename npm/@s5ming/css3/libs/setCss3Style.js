import {forEach} from '@s5ming/array'

const setCss3Style = function(obj,json){
    for(var name in json){        
        forEach([
            'Webkit',		// chrome，safari 内核
            'Moz',			// firefox 内核
            'Ms',			// ie 内核
            'O',			// opera 内核
        ],function(s){
            var val = s + name[0].toUpperCase() + name.substring(1);
            obj.style[val] = json[name];
        });
        obj.style[name] = json[name];	
    }
}
export default setCss3Style
