<template>
    <div class="sxdc_container">
        {{test}}
    </div>
</template>
<script>
// import axios from 'axios';
// import dic from './dic.js';
export default {
    name:'sxdc',
    data(){
        return {
            test:'aaaa',
            mydic:{}
        };
    },
    mounted(){
        this.$nextTick(function(){
            // for(var name in dic){
            //     var sp = dic[name];
            //     var json = {};
            //     var sparr = sp.split('');
            //     var length = sparr.length;
            //     for(var i = 0;i<length;i++){
            //         if(json[sparr[i]]){
            //             json[sparr[i]]++;
            //         }else{
            //             json[sparr[i]] = 1;
            //         }
            //     }
            //     this.mydic[name] = json;
            // }
            // console.log(this.mydic);
        });
    }
}
</script>
<style lang="less" scoped>

</style>