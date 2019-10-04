<template>
    <div ref="qnselect_container" class="qnselect_container">
        <div class="xline clear" ref="xline">
            <div class="xline_l fl" ref="xline_l"></div>
            <div class="xline_r fl" ref="xline_r"></div>
            <div class="ding"><i></i></div>
        </div>
        <div ref="select"></div>
    </div>
</template>
<script>
import $ from 'jquery'
import {imitateSelect} from '@s5ming/input'
export default {
    data(){
        return {
            select:null,
            width:120,
            data:[{name:'hehe',value:'hehe'}]
        }
    },
    mounted(){
        this.$nextTick(() => {
            this.$refs.qnselect_container.style.width = this.width + 'px';
            this.$refs.xline.style.height = this.width / 2 * 0.8 + 'px';
            var tr = this.width / 4 * 0.8 * Math.sqrt(2);
            var deg = '45deg';
            this.$refs.xline_l.style.background='linear-gradient(-'+deg+',transparent '+(tr-1)+'px,#000,'+tr+'px,transparent '+(tr+1)+'px)';
            this.$refs.xline_r.style.background='linear-gradient('+deg+',transparent '+(tr-1)+'px,#000,'+tr+'px,transparent '+(tr+1)+'px)';
            imitateSelect($(this.$refs.select),this.data,function(){},{
                width:this.width,
                borderRadius:5,
                arrowBorderWidth:0,
                height:30
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
                display:block; width:10px; height:10px; background: #000; border-radius: 50%; margin:0 auto;
            }
        }
    }
}
</style>
