<template>
    <div class="piano_container">
        <audio :src="audioSrc" autoplay>你的浏览器不支持audio标签</audio>
        <div class="piano">
            <div class="paionWhiteKey" v-for="(item,i) in pianoWhiteKeys" :style="{width:100/pianoWhiteKeys.length+'%'}" @click="play(item.audio)">
                
            </div>
            <div class="painoBlankKey" v-for="(item,i) in pianoBlankKeys"
                :style="{width:200/3/pianoWhiteKeys.length+'%',left:item.i*100/pianoWhiteKeys.length+(200/3/pianoWhiteKeys.length)+'%'}"
                @click="play(item.audio)"
            >

            </div>
        </div>
        <div class="load" v-show="load"><br><br><br>{{loadHTML}}</div>
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
            audioSrc:'',
            load:true,
            loadHTML:'加载中。。。剩余0个音频'
        }
    },
    methods:{
        play(audio){
            if('fastSeek' in audio){
                audio.fastSeek(0);
            }else{
                audio.currentTime = 0;
            }
            audio.play();
        }
    },
    mounted(){
        this.pianoWhiteKeys = [];
        var loadNum=0;
        var _this = this;
        function loaded(){
            loadNum--;
            _this.loadHTML = '加载中。。。剩余'+loadNum+'个音频';
            if(!loadNum)_this.load = false;
        }
        for(var i = 0;i<52;i++){
            loadNum++;
            var chart = this.typeChats[i%7];
            var num = this.typeNums[parseInt((i+5)/7)];
            var audio = document.createElement('audio');
            audio.src = '/keySconds/'+chart+'/'+chart+num+'.MP3';
            audio.oncanplay = loaded;
            this.pianoWhiteKeys.push({audio:audio});

        }
        this.pianoBlankKeys = [];
        var indexs = [0,2,3,5,6,7,9,10,12,13,14,16,17,19,20,21,23,24,26,27,28,30,31,33,34,35,37,38,40,41,42,44,45,47,48,49];
        var indexsLength = indexs.length;
        for(var i = 0;i<indexsLength;i++){
            loadNum++;
            var chart = this.typeChats[indexs[i]%7];
            var num = this.typeNums[parseInt((indexs[i]+5)/7)];
            var audio = document.createElement('audio');
            audio.src = escape('/keySconds/#'+chart+'/#'+chart+num+'.MP3');
            audio.oncanplay = loaded;
            this.pianoBlankKeys.push({i:indexs[i],audio:audio});
        }
    }
}
</script>
<style lang="less">
.piano_container{
    width:100%; height:100%; overflow: hidden; position:relative;
    .piano:after{
        content:''; display:block; clear:both;
    }
    .piano{
        width:96%; margin: 20px auto; position:relative; cursor: pointer;
        .paionWhiteKey{
            float:left; border:1px solid #ccc; box-sizing: border-box; height:200px;
        }
        .painoBlankKey{
            position:absolute; top:0; height:100px; background: #000;
        }
    }
    .load{
        background: rgba(255,255,255,.6); position:absolute; top:0; left:0; height:100%; width:100%; text-align: center;
    }
}
</style>