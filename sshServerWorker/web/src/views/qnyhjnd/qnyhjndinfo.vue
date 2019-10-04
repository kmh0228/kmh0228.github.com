<template>
    <div class="qnyhjndinfo_container">
        <div class="info">{{info}}<i>{{num}}</i></div>
        <div class="infobk">{{info}}<i>{{num}}</i></div>
    </div>
</template>
<script>
import $ from 'jquery'
import {imitateSelect} from '@s5ming/input'
export default {
    data(){
        return {
           info:'content',
           num:1
        }
    },
    mounted(){
        this.$nextTick(() => {
            
        });
          
    }
}
</script>
<style lang="less">
.qnyhjndinfo_container{
    .info,.infobk{
        padding:5px 10px; border: 1px solid #ccc; border-radius: 5px; position:relative; color:#000;
        i{
            position:absolute; top:-10px; left:2px; color:red; font-weight: bold;
        }
    }
    .infobk{
        transform: rotateX(180deg); mask-image:linear-gradient(transparent,#ccc);
    }
}
</style>
