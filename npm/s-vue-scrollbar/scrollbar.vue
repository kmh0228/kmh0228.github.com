<!--
滚动条组件,create by zhaomingqiang 2019.1.21
高度100%
-->
<template>
    <div v-show="mshow" class="s5ming_scrollbar_container" ref="dom" @wheel.prevent="wheel" :style="containerStyle">
        <div class="box" ref="box" :style="{height:'calc(100% - '+mrollerHeight+'px)'}">
            <div class="roller" ref="roller" :style="rollerStyle"
                @mousedown="mousedown($event)" 
            ></div>
        </div>
    </div>
</template>
<script>
import {on,off} from '@s5ming/events'
import getStyle from 's-getstyle'
export default {
    name:'scrollbar',
    props:[
        'width',        //滚动条宽度,默认3
        'containerColor',   //滚轮槽颜色,默认#006
        'rollerBorder',     //滚动条边线样式 默认 '1px solid green'
        'rollerColor',      //滚动条颜色 默认 #fff
        'defalutScale', //默认滚动状态,默认0,取值: 0-1
		'rollerHeight', //滚动条高度，默认 20
        'rollerSen',    //滚动的灵敏度 默认 0.01
        'show'          //是否显示,默认 true
    ],
    data(){
        return {
            containerHeight:0,
            mTop:0
        }
    },
    computed:{
        mrollerSen:function(){return this.rollerSen || 0.001},          //滚动的灵敏度 默认0.01      
        mrollerHeight:function(){console.log('rollerHeight'+this.rollHeight);return this.rollerHeight || 20},
        mshow(){
            if(typeof this.show == 'undefined'){
                return true
            }else{
                return this.show
            }
        },
        mwidth(){
            return parseInt(this.width || 3)
        },
        containerStyle(){
            return {
                width:this.mwidth +'px',
                background: this.containerColor || '#006',
                borderRadius:parseInt(this.mwidth/2)+'px'
            }
        },
        rollerStyle(){
            return {
                height:this.mrollerHeight+'px',
                top:this.mTop*100+'%',
                borderRadius:parseInt(this.mwidth/2)+'px',
                border:this.rollerBorder || '1px solid green',
                background: this.rollerColor || '#fff'
            }
        }    
    },
    methods:{
        mousedown(arg){
            let _this = this                                                //定义this
            let oldY = arg.y                                                //存储当前鼠标y坐标
            let obj = arg.currentTarget                                     //定义当前元素
            let BoxHeight = $(this.$refs.box).height()                      //获取滚动条所在盒子的整体高度
            let rollTop = parseInt(getStyle(this.$refs.roller).top)         //获取当前滚动条的top值
            let mousemove=function(ev){
				let oEvent = ev||event;
                let newY = oEvent.clientY;
                let dy = newY - oldY;
                rollTop += dy;
                let pre = rollTop / BoxHeight
                _this.mTop = pre<0?0:(pre>1?1:pre)
                _this.$emit('scroll',_this.mTop);
				oldY=newY;
			};
			on(document,'mousemove',mousemove);			
			let mouseup=function(){
				off(document,'mousemove',mousemove);
				off(document,'mouseup',mouseup);
				obj.releaseCapture&&obj.releaseCapture();
			};
			on(document,'mouseup',mouseup);
			obj.setCapture&&obj.setCapture();
			arg.preventDefault();
        },
        wheel(arg){
            let val = this.mTop + arg.deltaY * this.mrollerSen
            this.setValue(val)
        },
        setValue(value){
            let val = value || 0
            let BoxHeight = getStyle(this.$refs.box).height
            if(val<0){
                this.mTop = 0
            }else if(val > 1){
                this.mTop = 1
            }else{
                this.mTop = val
            }
            this.$emit('scroll',this.mTop)
        },
        update(){
            this.$emit('scroll',this.mTop)
        }
    },
    mounted(){
        this.$nextTick(()=>{
            this.setValue(this.defalutScale || 0)
        })
        on(window,'resize',this.update)
    },
    beforeDestroy(){
        off(window,'resize',this.update)
    }
}
</script>
<style>
 .s5ming_scrollbar_container{
     height:100%;
 }
.s5ming_scrollbar_container .box{
    width:100%;position:relative;box-sizing:border-box;
}
.s5ming_scrollbar_container .box .roller{
    width:100%;position: absolute;top:0;left:0;
    box-sizing:border-box;cursor: pointer;
}
</style>
