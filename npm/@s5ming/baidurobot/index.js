/**
 * 百度的人工智能封装, 注意此插件只能在服务器上使用,因为需要跨域
 */
var baiduocr = require('./libs/baiduocr');
var baiduunit = require('./libs/baiduunit');

module.exports = {
    baiduocr:baiduocr,
    baiduunit:baiduunit
}