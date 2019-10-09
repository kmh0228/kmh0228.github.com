<template>
    <div class="Home_container">
        <div class="waterbox" style="width:100%; height:100%;">
            <water></water>
        </div>
        <div ref="collbox" style="width:100%; height:100%; position:absolute;top:0;left:0;"></div>
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

            // var oC = this.$refs.collbox;
            // var oB = this.oB = new CollBox(oC);
            // oB.ballRun();

            // function rand(m,n){return m+parseInt((n-m)*Math.random());}
            // var routesLength=routes.length;
            // var mxwidth=oC.offsetWidth;
            // var mxheight=oC.offsetHeight;
            // var _this = this;
            // for(var index=0;index<routesLength;index++){
            //     (function(i){
            //         var b=rand(40,60);
            //         var x=rand(b,mxwidth-b);
            //         var y=rand(b,mxheight-b);
            //         var ball=new Ball({
            //             'b':b,
            //             'x':x,
            //             'y':y,
            //             'sx':rand(1,4)/10,
            //             'sy':rand(1,4)/10,
            //             //'opa':rand(60,100)/100,
            //             e:ballElement(routes[i].title),
            //             'click':function(){
            //                 _this.$router.push({
            //                     path:routes[i].path
            //                 });
            //             } //点击跳转
            //         });
            //         oB.addBall(ball);
            //     })(index)
            // }

        });
    }
}
</script>
<style lang="less">
.Home_container{
    width:100%; height:100%; background: #000;

}
</style>
