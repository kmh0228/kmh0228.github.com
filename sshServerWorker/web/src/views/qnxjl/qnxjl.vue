<template>
    <div class="qnxjl_container">
        <div class="container clear">
            
            <div class="inputs fl">
                <input id="searchBtn" ref="searchBtn" type="text" value="plase putin" placeholder=""/>
            </div>
            <div class="con fl">
                <div class="lineback clear">
                    <div class="fl"></div><div class="fl"></div>
                </div>
                <ul class="con_list" ref="con_list">
                    <li v-for="item in list" class="con_item cur"  data-clipboard-text="item.opt1">
                        <p style="display:none;" class="shouzimu">{{item.shouzimu}}</p>
                        <p class="p1">{{item.question}}</p>
                        <p class="p2">{{item.opt1}}</p>
                    </li>         
                </ul>
            </div>
        </div>
        <div class="other">
            <a class="help" title="帮助">
                <img src="./images/说明.svg" alt="关于">
            </a>
            <a class="plus" target="_blank" title="添加词语"  @click="showAddWin=true">
                <img src="./images/plusIcon.png" alt="关于">
            </a>
        </div>
        <div class="addalert" v-show="showAddWin">
            <div class="owin">
                <div class="clear">
                    <button class="fr delBtn" @click="showAddWin=false;">X</button>
                </div>
                <div class="clear" style="margin-top:10px;">
                    <span>各位帮会的兄弟姐妹们，听好了，”</span><br/>
                    <input v-model="addquestion" class="name"/><br/>
                    <span>”的下一句歌词是？</span>
                </div>
                <div class="clear" style="margin-top:20px;">
                    <span class="fl title">答案:</span>
                    <input class="fl name" type="text" v-model="addopt"/>
                </div>
                <button class="addBtn" @click="addxyqcontent()" style="margin-top:20px;">添加</button>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery'
import xjlData from './data/xjlData'
import wordToShouzimu from './wordToShouzimu'
export default {
    name:'qnxjl',
    data(){
        return {
            showAddWin:false,
            addquestion:'',
            addopt:'',
            list:xjlData
        }
    },
    methods:{
        inputChange(obj,fn){    //监控表单方法
            var oldval=obj.val();
            obj.on('focus',function(){
                clearInterval(obj.timer);
                obj.timer=setInterval(function(){
                    var newval=obj.val();
                    if(!(newval===oldval)){
                        oldval=newval;
                        fn&&fn(newval);
                    }
                },30);
            });
            obj.on('blur',function(){
                clearInterval(obj.timer);
            });
        }
    },
    mounted(){
        function rand(a,b){return parseInt(a+(Math.random()*(b-a)));}
        this.$nextTick(function(){
            var _this = this;
            //木牌随机倾斜效果
            $(this.$refs.con_list).find('li').each(function(i,e){
                $(e).css('transform','rotate('+rand(-3,3)+'deg)');
            });
            //整理数据信息
            this.list.forEach(function(item){
                item.shouzimu = wordToShouzimu(item.question);
                item.show = true;
            });
            //表单筛选效果
            this.inputChange($(this.$refs.searchBtn),function(val){
                $(_this.$refs.con_list).find('li').hide();
                $(_this.$refs.con_list).find('.shouzimu:contains("'+val+'")').parent().show();
            });
        });
    }
}
</script>
<style lang="less">
.qnxjl_container{
    width:100%; height:100%; background:url(./images/back.jpeg); background-size: cover;
    .container{ width:800px; margin:0px auto; height: 100%; overflow: hidden;
        .inputs{
            background:url(./images/arrow.png) no-repeat;background-size:cover; width:274px; height:136px; margin-right:40px;
            input{
                font-size: 24px; display: block; width:200px; height: 30px; line-height: 30px; margin: 55px 0 0 20px;
                text-indent: 10px; outline: none; background:none; border:none; font-weight: bold; color:#c96; cursor:pointer;
            }
        }
        .con{ width:460px; position:relative; height:100%;
            .lineback{
                height:100%;
                >div{
                    height:100%; width:15px; background: url(./images/line.png) repeat-y; background-size:contain;
                    margin-left:140px;
                }
            }
            .con_list{height: 100%; position:absolute; top:0; left:0; width:100%; height:100%;
                li{
                    cursor: pointer; list-style: none; color:#eee; cursor: pointer;
                    background-size: cover; border-radius: 5px; background: url(./images/listback.png);
                    box-shadow: 2px 2px 1px 1px #630; margin-top: 10px;
                    p.p1{
                        height:24px; line-height: 24px; text-align: left; padding-left:40px; font-size: 16px;
                    }
                    p.p2{
                        height:16px; line-height: 14px; text-align: right; padding-right:40px; font-size: 14px;
                    }
                }
                li.cur{
                    box-shadow: 2px 2px 1px 1px #963; margin-top: 10px; color:red;
                }
            }
       }
    }
    .other{
        position:absolute; top:20px; right:20px;
        .help{ display: block; width:20px; height:20px;  background: #aaa; border-radius: 50%; box-shadow: 0 0 5px 5px #eee; cursor: pointer;
            img{ width:100%; height:100%;}
        } 
        .plus{display: block; width:20px; height:20px; border-radius: 50%; box-shadow: 0 0 5px 5px #eee; cursor: pointer; margin-top:10px;
            img{ width:100%; height:100%;}
        } 
        
    } 
    .addalert{
        position:absolute; top:0; left:0; width:100%; height:100%; background: rgba(255,204,153,0.6); color:#630;
        .owin{
            margin:100px auto; background: rgba(255,204,153); width:300px; padding:20px; font-size: 14px; border-radius: 5px;
            .title{
                width:50px;
            }
            textarea{
                width:200px; height:100px; resize: none;
            }            
            .name{
                width:200px; height:20px;
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