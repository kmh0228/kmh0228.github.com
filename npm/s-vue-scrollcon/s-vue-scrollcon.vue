<template>
    <div class="regoinRoller_con_container" ref="regoinRoller_con_container"  @wheel.prevent="wheel" style="height:100%;">
        <div style="height:100%; overflow:hidden;">
            <div class="regoinRoller_con_content" ref="regoinRoller_con_content" :style="{marginTop:marginTop+'px'}">
                <!-- <div v-html="testHtml"></div> -->
                <slot></slot>
            </div>
        </div>
        <regoinRoller
            ref="regoinRoller"
            class="regoinRoller"
            :rollerHeight="rollerHeight"
            :show="containerHeight<conHeight"
            @scroll="scroll"
            :width="mrollerConfig.width"
            :containerColor="mrollerConfig.containerColor"
            :rollerBorder="mrollerConfig.rollerBorder"
            :rollerColor="mrollerConfig.rollerColor"
            :defalutScale="mrollerConfig.defalutScale"
            :rollerSen="mrollerConfig.rollerSen"
        ></regoinRoller>
    </div>
</template>
<script>
import regoinRoller from 's-vue-scrollbar'
import {on,off} from '@s5ming/events'
import {forEach} from '@s5ming/array'
import getStyle from 's-getstyle'
export default {
    name:'s-vue-scrollcon',
    props:['height','rollerConfig'],
    components:{
        regoinRoller
    },
    data(){
        return {
            containerHeight:null,
            conHeight:null,
            marginTop:0
        }
    },
    computed:{
        mrollerConfig(){
            return this.rollerConfig || {}
        },
        testHtml(){
            let html = ''
            forEach(25,(i)=>{
                html+=i+'</br>'
            })
            return html
        },
        rollerHeight(){
            let rh = this.containerHeight / this.conHeight * this.containerHeight
            if(rh < 20)return 20
            return rh
        },
        mheight:function(){
            if(typeof this.height == 'undefined'){
                return '100%'
            }else{
                return parseInt(this.height) + 'px'
            }
        }
    },
    watch:{
        height(val){
            this.update()
        }
    },
    methods:{
        wheel(arg){
            this.$refs.regoinRoller.wheel(arg)
        },
        scroll(pre){
            this.update()
            if(this.conHeight < this.containerHeight){
                this.marginTop = 0
            }else{
                this.marginTop = pre * (this.containerHeight - this.conHeight)
            }
        },
        update(){
            this.containerHeight = parseInt(getStyle(this.$refs.regoinRoller_con_container).height)
            this.conHeight = parseInt(getStyle(this.$refs.regoinRoller_con_content).height)
        }
    },
    mounted(){
        this.$nextTick(function(){
            this.update()
        })
    },
    beforeDestroy(){
    }
}
</script>
<style lang="less">
.regoinRoller_con_container{
    width:100%; height:100%; position: relative; 
    .regoinRoller_con_content{
        overflow: hidden;
    }
    .regoinRoller{
        position:absolute; top:0; right:-3px;
    }
}
</style>
