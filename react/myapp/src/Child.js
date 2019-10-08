
import React, {useContext } from 'react';
import {CountContext} from './App.js';
var Child = function(){
    var conunt = useContext(CountContext);
    return (<div>child:{conunt}</div>);
}
export default Child;
