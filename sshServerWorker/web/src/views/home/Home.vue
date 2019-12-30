<template>
    <div class="Home_container">
        <div class="waterbox" style="width:100%; height:100%;">
            <water ref="watercomponent"></water>
        </div>
        <div class="collbox" ref="collbox" style="width:100%; height:100%; position:absolute;top:0;left:0; overflow:hidden;"></div>
         <a class="ban" href="http://beian.miit.gov.cn">
            个人前端代码存放  备案编号: 京ICP备18032050号-2
        </a>
    </div>
</template>
<script>
import {CollBox,Ball} from './collision.js'
import allroutes from '../../router/routers'
import ballElement from './ballElement'
import water from './water'
export default {
    name:'Home',
    components:{
        water
    },
    data(){
        return {
            oB:null,
            balls:[]
        }
    },
    mounted(){
        this.$nextTick(function(){
            var oC = this.$refs.collbox;
            var oB = this.oB = new CollBox(oC);
            oB.ballRun();

            function rand(m,n){return m+parseInt((n-m)*Math.random());}
            var routes = allroutes[2].children;
            var routesLength=routes.length;
            var mxwidth=oC.offsetWidth;
            var mxheight=oC.offsetHeight;
            var _this = this;
            for(var index=0;index<routesLength;index++){
                (function(i){
                    var b=rand(40,50);
                    var x=rand(b,mxwidth-b);
                    var y=rand(b,mxheight-b);
                    var html = '<div style="width:100%;height:100%;position:relative;">\
                                    <div style="width:100%;height:100%;background:url(./img/paopao'+rand(1,6)+'.png);opacity:0.4;background-size:cover;"></div>\
                                    <span class="ppfont">'+routes[i].title+'</span>\
                                </div>';
                    var ball=new Ball({
                        'b':b,
                        'x':x,
                        'y':y,
                        'sx':rand(5,10)/10,
                        'sy':rand(5,10)/10,
                        'html':html,
                        'runBack':function(mouseX,mouseY,sx,sy,w,h){
                            var sc = w/Math.sqrt(sx*sx+sy*sy)/2;
                            if(_this.$refs.watercomponent)_this.$refs.watercomponent.disturb( mouseX + sc*sx, mouseY + sc*sy );
                        },
                        'click':function(){
                            _this.$router.push({
                                path:'/pages/'+routes[i].path
                            });
                        } //点击跳转
                    });
                    oB.addBall(ball);
                })(index)
            }

            oC.addEventListener( 'click', function( e ) {
                var mouseX = e.layerX;
                var mouseY = e.layerY;
                _this.$refs.watercomponent.disturb( mouseX, mouseY );
            });
            oC.addEventListener( 'mousemove', function( e ) {
                var mouseX = e.layerX;
                var mouseY = e.layerY;
                _this.$refs.watercomponent.disturb( mouseX, mouseY );
            });

        });
    }
}
</script>
<style lang="less">
.Home_container{
    width:100%; height:100%; position: relative;

    .collbox{
        .ppfont{
            font-size: 18px;
            
            color: transparent;
            //-webkit-text-fill-color: #fff;/*文字的填充色*/
            -webkit-text-stroke: 1px pink;
            position:absolute;top:0;left:0;width:100%;
        }
    }
    .ban{
        position:absolute; bottom:0; left:0; width:100%;
        background:#fff;display:block;text-align:center; font-size:12px; color:#000;
    }
}
</style>
