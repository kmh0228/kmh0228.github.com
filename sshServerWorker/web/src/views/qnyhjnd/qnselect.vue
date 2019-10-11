<template>
    <div ref="qnselect_container" class="qnselect_container">
        <div class="xline clear" ref="xline">
            <div class="xline_l fl" ref="xline_l"></div>
            <div class="xline_r fl" ref="xline_r"></div>
            <div class="ding"><i></i></div>
        </div>
        <div ref="select" class="select"></div>
    </div>
</template>
<script>
import $ from 'jquery'
import {imitateSelect} from '@s5ming/input'
import {peos} from './data'
export default {
    data(){
        return {
            select:null,
            width:120,
            data:peos
        }
    },
    mounted(){
        this.$nextTick(() => {
            var _this = this;
            this.$refs.qnselect_container.style.width = this.width + 'px';
            this.$refs.xline.style.height = this.width / 2 * 0.8 + 'px';
            var tr = this.width / 4 * 0.8 * Math.sqrt(2);
            var deg = '45deg';
            this.$refs.xline_l.style.background='linear-gradient(-'+deg+',transparent '+(tr-1)+'px,#000,'+tr+'px,transparent '+(tr+1)+'px)';
            this.$refs.xline_r.style.background='linear-gradient('+deg+',transparent '+(tr-1)+'px,#000,'+tr+'px,transparent '+(tr+1)+'px)';
            imitateSelect($(this.$refs.select),this.data,function(json){
                _this.$emit('select',json);
            },{
                width:this.width,
                borderRadius:5,
                arrowBorderWidth:0,
                height:30,
                placeholder:'选择职业'
            });
        });
          
    }
}
</script>
<style lang="less">
.qnselect_container{
    .xline{
        position: relative; width:80%; margin: 0 auto;
        .xline_l{
            width:50%; height:100%;
        }
        .xline_r{
            width:50%; height:100%;
        }
        .ding{
            position: absolute; top:0; left:0; width:100%;
            i{
                display:block; width:10px; height:10px; background: #000; border-radius: 50%; margin:0 auto;box-shadow: 2px 2px 1px 1px #999;
            }
        }
    }
    .select{
        box-shadow: 2px 2px 1px 1px #999;
    }
}
</style>
