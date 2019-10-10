<template>
    <div class="Home_container">
        <div class="waterbox" style="width:100%; height:100%;">
            <water ref="watercomponent"></water>
        </div>
        <div class="collbox" ref="collbox" style="width:100%; height:100%; position:absolute;top:0;left:0; overflow:hidden;"></div>
    </div>
</template>
<script>
import {CollBox,Ball} from './collision.js'
import routes from '../../router/routers'
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
            var routesLength=routes.length;
            var mxwidth=oC.offsetWidth;
            var mxheight=oC.offsetHeight;
            var _this = this;
            for(var index=0;index<routesLength;index++){
                (function(i){
                    var b=rand(40,60);
                    var x=rand(b,mxwidth-b);
                    var y=rand(b,mxheight-b);
                    var html = '<div style="width:100%;height:100%;position:relative;">\
                                    <div style="width:100%;height:100%;background:url(./img/paopao'+rand(1,6)+'.png);opacity:0.3;background-size:cover;"></div>\
                                    <span class="ppfont">'+routes[i].title+'</span>\
                                </div>';
                    var ball=new Ball({
                        'b':b,
                        'x':x,
                        'y':y,
                        'sx':rand(2,3),
                        'sy':rand(2,3),
                        'html':html,
                        'click':function(){
                            _this.$router.push({
                                path:routes[i].path
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
                console.log(e);
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
    width:100%; height:100%;

    .collbox{
        .ppfont{
            font-size: 18px;
            
            color: transparent;
            //-webkit-text-fill-color: #fff;/*文字的填充色*/
            -webkit-text-stroke: 1px #fff;
            position:absolute;top:0;left:0;width:100%;
        }
    }
}
</style>
