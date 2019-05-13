import {
    forEach,
    forEachChildren,
    binaryPlus
} from '../index'

//forEach
var forEachContainer = document.getElementById('forEach')
var forEachInputs = forEachContainer.getElementsByTagName('input')
var forEachBtn = forEachContainer.getElementsByTagName('button')[0]
forEachBtn.onclick = function(){
    var params1 = (new Function('return '+forEachInputs[0].value))();
    var params2 = new Function('item','index',forEachInputs[1].value);
    forEach(params1,params2)
}

//forEachChildren
var forEachChildrenContainer = document.getElementById('forEachChildren')
var forEachChildrenInputs = forEachChildrenContainer.getElementsByTagName('input')
var forEachChildrenBtn = forEachChildrenContainer.getElementsByTagName('button')[0]
forEachChildrenBtn.onclick = function(){
    var params1 = (new Function('return '+forEachChildrenInputs[0].value))();
    var params2 = new Function('item','index',forEachChildrenInputs[1].value);
    var params3 = (new Function('return '+forEachChildrenInputs[2].value))();
    forEachChildren(params1,params2,params3)
}

//binaryPlus
var binaryPlusContainer = document.getElementById('binaryPlus')
var binaryPlusInputs = binaryPlusContainer.getElementsByTagName('input')
var binaryPlusBtn = binaryPlusContainer.getElementsByTagName('button')[0]
binaryPlusBtn.onclick = function(){
    var params1 = (new Function('return '+binaryPlusInputs[0].value))();
    var params2 = (new Function('return '+binaryPlusInputs[1].value))();
    binaryPlusInputs[2].value = binaryPlus(params1,params2)
}

