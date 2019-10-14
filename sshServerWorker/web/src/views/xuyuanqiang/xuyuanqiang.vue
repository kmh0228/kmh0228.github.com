<template>
    <div class="xuyuanqiang_container">
        <div class="bqcontainer" ref="bqcontainer"> 
        </div> 
        <input class="addbtn" type="button" @click="addWindowShow=true;" value="+"/>
        <div class="openWindow" v-show="addWindowShow">
            <div class="owin">
                <div class="clear">
                    <button class="fr delBtn" @click="addWindowShow=false;">X</button>
                </div>
                <div class="clear" style="margin-top:10px;">
                    <span class="fl title">你的愿望:</span>
                    <textarea class="fl con" v-model="addcontent">nerong</textarea>
                </div>
                <div class="clear" style="margin-top:20px;">
                    <span class="fl title">你的笔名:</span>
                    <input class="fl name" type="text" v-model="addname"/>
                </div>
                <button class="addBtn" @click="addxyqcontent()" style="margin-top:20px;">添加</button>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery'
import axios from 'axios'
$.fn.drag = function () {
    var $this = $(this);
    var parent = $this.parent();
    var pw = parent.width();
    var ph = parent.height();
    var thisWidth = $this.width() + parseInt($this.css('padding-left'), 10) + parseInt($this.css('padding-right'), 10);
    var thisHeight = $this.height() + parseInt($this.css('padding-top'), 10) + parseInt($this.css('padding-bottom'), 10);
    var x, y, positionX, positionY;
    var isDown = false; 
    var randY = parseInt(Math.random() * (ph - thisHeight), 10);
    var randX = parseInt(Math.random() * (pw - thisWidth), 10);
    parent.css({
        "position": "relative",
        "overflow": "hidden"
    });
    $this.css({
        "cursor": "move",
        "position": "absolute"
    }).css({
        top: randY,
        left: randX
    }).mousedown(function (e) {
        parent.children().css({
            "zIndex": "0"
        });
        $this.css({
            "zIndex": "1"
        });
        isDown = true;
        x = e.pageX;
        y = e.pageY;
        positionX = $this.position().left;
        positionY = $this.position().top;
        return false;
    });
    $(document).mouseup(function (e) {
        isDown = false;
    }).mousemove(function (e) {
        var xPage = e.pageX;
        var moveX = positionX + xPage - x;

        var yPage = e.pageY;
        var moveY = positionY + yPage - y;

        if (isDown == true) {
            $this.css({
                "left": moveX,
                "top": moveY
            });
        } else {
            return;
        }
        if (moveX < 0) {
            $this.css({
                "left": "0"
            });
        }
        if (moveX > (pw - thisWidth)) {
            $this.css({
                "left": pw - thisWidth
            });
        }
        if (moveY < 0) {
            $this.css({
                "top": "0"
            });
        }
        if (moveY > (ph - thisHeight)) {
            $this.css({
                "top": ph - thisHeight
            });
        }
    });
};

export default {
    name:'xuyuanqiang',
    data(){
        return {
            colors:['#96C2F1', '#BBE1F1', '#E3E197', '#F8B3D0', '#FFCC00'],
            addWindowShow:false,
            addcontent:'我希望',
            addname:'释迦摩尼'
        }
    },
    methods:{
        createItem(text,id){
            var color = this.colors[parseInt(Math.random() * 5, 10)]
            $('<div class="item" index="'+id+'"><p>'+ text +'</p><a href="#">关闭</a></div>').css({ 'background': color }).appendTo(this.$refs.bqcontainer).drag();
        },
        addxyqcontent(text,author){
            if(!this.addcontent){alert('老大，没写内容啊。');return;};
            if(!this.addname){alert('请留个美名，让后人瞻仰。');return;};
            var _this = this;
            var time = new Date().getTime();
            axios.post('/api/addxyqcontent',{
                content:this.addcontent,author:this.addname,time:time
            }).then(function(res){
                _this.createItem(_this.addcontent,time);
            }).catch(function(){
                console.log('false');
            });
        }
    },
    mounted(){
        this.$nextTick(function(){
            var container = $(this.$refs.bqcontainer);
            var _this = this;
            // 绑定关闭事件
            container.on('click','a',function () {
                $(this).parent().remove();
            }).height($(window).height());

            axios.post('/api/getxyqcontent',{
            }).then(function(res){
                res.data.forEach(function(item){
                    _this.createItem(item.content);
                });
            }).catch(function(){
                console.log('false');
            });
            // 绑定输入框
            // $('#input').keydown(function (e) {
            //     var $this = $(this);
            //     if(e.keyCode == '13') {
            //         var value = $this.val();
            //         if(value) {
            //             createItem(value);
            //             $this.val('');
            //         }
            //     }
            // });
        });
    }
}
</script>
<style lang="less">
.xuyuanqiang_container{
    width:100%; height:100%;
    background: linear-gradient(top, rgb(203, 235, 219) 0%, rgb(55, 148, 192) 100%);
    font-family: '微软雅黑', sans-serif;
    font-size: 16px;
    position: relative;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    .bqcontainer{
        width:100%; height:100%; overflow: hidden;
        .item {
            width: 200px;
            height: 200px;
            line-height: 30px;
            border-bottom-left-radius: 20px 500px;
            border-bottom-right-radius: 500px 30px;
            border-top-right-radius: 5px 100px;
            box-shadow: 0 2px 10px 1px rgba(0, 0, 0, 0.2);
            box-shadow: 0 2px 10px 1px rgba(0, 0, 0, 0.2);
            text-align: left;
            p{
            height: 80px;
            margin: 30px 10px;
            overflow: hidden;
            word-wrap: break-word;
            line-height: 1.5;
            }
            a{
                text-decoration: none;
                color: white;
                position: relative;
                left: 150px;
                //color: red;
                font-size: 14px;
            }
        }
    }  
    .addbtn{
        border: 0;
        border-radius: 5px;
        position:absolute;
        top:6px;
        right:6px;
        height: 24px;
        line-height: 24px;
        width: 24px;
        font-size: 14px;
        box-shadow: 2px 2px 1px 1px #ccc;
        cursor: pointer;
        outline: none;
    }
    .openWindow{
        position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(255,255,255,.2);
        .owin{
            margin:100px auto; background: #fff; width:300px; padding:20px; font-size: 14px; border-radius: 5px;
            .title{
                width:80px;
            }
            textarea{
                width:200px; height:100px; resize: none;
            }            
            .name{
                width:100px; height:20px;
            }
            .addBtn{
                width:200px; margin:10px auto; height:30px; cursor:pointer;
            }
            .delBtn{
                width:20px; height:20px; cursor:pointer;
            }
        }
    }
}
 
</style>
