<template>
    <div class="water_container" ref="water"></div>
</template>
<script>
import $ from 'jquery'
import WaterRippleEffect from './waterrippleeffect.js'
import imgUrl from '../img/timg3.jpeg'
export default {
    name:'water',
    data(){
        return {
            waterRippleEffect:null
        }
    },
    methods:{
        disturb(mouseX,mouseY){
            this.waterRippleEffect.disturb( mouseX, mouseY );
        }
    },
    mounted(){
        this.$nextTick(function(){
            var dom = this.$refs.water;
            var width = parseInt(dom.offsetWidth/2)*2;
            var height = parseInt(dom.offsetHeight/2)*2;
            var _this = this;
            
            
            _this.waterRippleEffect = new WaterRippleEffect(dom, {
                image: imgUrl,//image path
                rippleRadius: 6,//radius of the ripple
                width: width,//width
                height: height,//height
                delay: 1,//if auto param === true. 1 === 1 second delay for animation
                auto: true//if auto param === true, animation starts on it´s own
            });
            // dom.addEventListener( 'click', function( e ) {
            //     var mouseX = e.layerX;
            //     var mouseY = e.layerY;
            //     _this.waterRippleEffect.disturb( mouseX, mouseY );
            // });
            // dom.addEventListener( 'mousemove', function( e ) {
            //     console.log(e);
            //     var mouseX = e.layerX;
            //     var mouseY = e.layerY;
            //     _this.waterRippleEffect.disturb( mouseX, mouseY );
            // });
            
            
        });
        
    }
}
</script>
<style lang="less">
.water_container{
    width:100%; height:100%; overflow:hidden;
}
</style>