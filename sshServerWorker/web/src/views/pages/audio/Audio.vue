<template>
  <div class="audio_container">
    <div class="background">
      <div class="bg_b"></div>
      <div class="bg_f"></div>
    </div>
    <div class="content">
      <div class="content_video fl" style="width:calc(100% - 300px);height:calc(100% - 120px);">
        <p>&nbsp;{{curVideo}}&nbsp;</p>
        <video :src="videoSrc" width="90%" height="90%" controls style="object-fit:contain;">你的浏览器暂不支持video标签</video>
      </div>
      <div class="video_list fl" style="width:300px; height:calc(100% - 120px);">
        <p v-for="(item,i) in videoList" @click="selectVideo(item)">{{item}}</p>
      </div>
      <div class="log">aaaaaaaa</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'home',
  data(){
    return {
      videoList:['加载列表中。。。。。。'],
      videoSrc:'./test.mp4',
      curVideo:''
    }
  },
  methods:{
    selectVideo(item){
      this.curVideo = item;
      this.videoSrc = 'http://129.28.168.243/video/'+item;
    }
  },
  mounted(){
    var _this = this;
    axios.post('/getList',{
    }).then(function(res){
      _this.videoList = res.data.list;
    }).catch(function(){
      alert('与服务器无连接，请检查网络。');
    });
  }
}
</script>
<style lang="less">
.audio_container{
  width:100%;
  height:100%;
  background: rgb(23, 26, 64);
    .background{
    width:100%; height:100%; position: relative;
    .bg_b{
      width:100%; height:100%;
      background: rgba(0,0,0,.35);
      z-index:2;
    }
    .bg_f{
      width:100%;
      height:100%;
      position: absolute; top:0; left:0;
      background:url(https://y.gtimg.cn/music/photo_new/T002R300x300M000001bXqvq3xeTHJ.jpg?max_age=2592000);
      background-repeat: no-repeat;
      background-size:cover;
      background-position: 50%;
      -webkit-filter:blur(65px);
      filter:blur(65px);
      opacity:.6;
    }
  }
  .content{
    position: absolute; width:100%; height:100%; top:0; left:0;

    .log{
      opacity:0.3;
      height:21px;
      line-height: 21px;
      font-size: 18px;
      color:#eee;
      position:absolute;
      top:20px;
      left:20px;
    }

    .content_video{
      p{
        color:#ddd;
      }
      margin-top: 80px;
      text-align: center;
      overflow: hidden;
      text-align: center;
    }

    .video_list{
      margin-top:80px;
      color:#fff;
      p{
        text-align: left;
        text-indent: 4px;
        cursor:pointer;
      }
      p:hover{
        color:yellow;
      }
    }

  }
}

</style>

