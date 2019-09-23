<template>
    <div class="piano_container">
        <audio :src="audioSrc" autoplay controls>你的浏览器不支持audio标签</audio>
        <div class="piano">
            <div class="paionWhiteKey" v-for="(item,i) in pianoWhiteKeys" :style="{width:100/pianoWhiteKeys.length+'%'}" @click="whiteClick(i)">
                
            </div>
            <div class="painoBlankKey" v-for="(item,i) in pianoBlankKeys" :style="{width:200/3/pianoWhiteKeys.length+'%',left:item.i*100/pianoWhiteKeys.length-(100/3/pianoWhiteKeys.length)+'%'}">

            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'piano',
    data(){
        return {
            pianoWhiteKeys:[
                {},
                {}
            ],
            pianoBlankKeys:[
                {}
            ],
            typeChats:['A','B','C','D','E','F','G'],     //七个音标
            typeNums:[0,1,2,3,4,5,6,7,8],
            audioSrc:''
        }
    },
    methods:{
        whiteClick(index){
            var chart = this.typeChats[index%7];
            var num = this.typeNums[parseInt((index+5)/7)];
            this.audioSrc = '/keySconds/'+chart+'/'+chart+num+'.MP3';
        }
    },
    mounted(){
        this.pianoWhiteKeys = [];
        for(var i = 0;i<52;i++){
            this.pianoWhiteKeys.push({});
        }
        this.pianoBlankKeys = [];
        var indexs = [1,3,4,6,7,8,10,11,13,14,15,17,18,20,21,22,24,25,27,28,29,31,32,34,35,36,38,39,41,42,43,45,46,48,49,50];
        var indexsLength = indexs.length;
        for(var i = 0;i<indexsLength;i++){
            this.pianoBlankKeys.push({i:indexs[i]});
        }
    }
}
</script>
<style lang="less">
.piano_container{
    width:100%; height:100%; overflow: hidden;
    .piano:after{
        content:''; display:block; clear:both;
    }
    .piano{
        width:96%; margin: 20px auto; position:relative;
        .paionWhiteKey{
            float:left; border:1px solid #ccc; box-sizing: border-box; height:200px;
        }
        .painoBlankKey{
            position:absolute; top:0; height:100px; background: #000;
        }
    }
}
</style>