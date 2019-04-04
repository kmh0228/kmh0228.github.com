/**
 * create by s5ming 2019.3.25
 * qq 1150123276
 * @param opt { //配置项参数
 *      start: 起始数值
 *      end: 终止数值
 *      speed: 速度 (每30毫秒增加的数值),
 *      time:  动作总用时 单位毫秒
 *      cb:     数值改变时的回调函数,参数是当时数值
 *      endfn:    结束的时候的回调函数,参数是当前值
 *      loop:      是否循环
 * }
 * 
 * 注意: speed 与 time 只填写一个就可以了,因为他们之间是换算关系,如果填了两个则无视time
 */
import {extend} from '@s5ming/json'
var Interval = function(opt){
    var opt = this.opt = extend(opt,{
        start:0,
        end:100,
        //speed:1,
        time:3000,
        cb:null,
        endfn:null,
        loop:false
    });
    this.cur = opt.start;
    this.speed = opt.speed || ((opt.end - opt.start)/opt.time*30);
    //speed 和 time 参数错误处理
    if(!(this.speed&&opt.time)){
        throw('interval计时器参数 speed 或者 time 不可为0');
        return;
    }
    this.timer = null;
};
//  开始
Interval.prototype.start = function(){
    var _this = this;
    this.end();
    this.timer = setInterval(function(){
        _this.cur += _this.speed;
        if((_this.speed>0 &&_this.cur >= _this.opt.end)||(_this.speed < 0 && _this.cur <= _this.opt.end)){
            _this.cur = _this.opt.end; 
            _this.opt.endfn&&_this.opt.endfn(_this.cur);
            if(_this.opt.loop){
                _this.cur = _this.opt.start;
            }else{
                _this.end();
            }
        }
        _this.opt.cb && _this.opt.cb(_this.cur);
    },30);
};
//  暂停
Interval.prototype.pause = function(){
    clearInterval(this.timer);
};
//  结束
Interval.prototype.end = function(){
    clearInterval(this.timer);
};

var interval = function(opt){
    return new Interval(opt);    
};

export default interval
