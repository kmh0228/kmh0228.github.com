<template>
    <div class="qnyhjnd_container">
        <div class="back">
            <div class="back_t">
                <div class="clear">
                    <div class="selectBox fl" style="margin:20px 0 0 50px;">
                        <qnselect @select="getZy" :curzy="curzy"></qnselect>
                    </div>
                    <pre class="fl" style="margin:20px 50px 0 50px; text-align:left;">
                        左边牌子选职业，下面选技能等级。然后最下面就出来经验比最高的技能排序。
                        注意：别点那么快，人家要一点点计算的
                        没有学的技能空着，它不会算
                    </pre>
                </div>
                
                <div class="jinengs clear">
                    <div class="jineng fl" v-for="(item,i) in zyjns" :key="i">
                        <span>{{item}}:&nbsp;</span>
                        <input type="number" value="0" step="1" min="0" max="40" v-model="jnd[item]">
                    </div>
                </div>
                
                <button class="jisuan" @click="jndchange">开始计算</button>
                <span style="font-size:10px;">
                    你已经在修为中花费了 {{used.mon}} 银两和 {{used.exp}} 经验,
                    &nbsp;&nbsp;还需 {{toused.mon}} 银两和 {{toused.exp}} 经验就可以把所有修为点满。
                </span>
            </div>
            <div class="back_b clear">
                <div v-for="(item,key) in result" class="selectBox fl" :key="key">
                    <qnyhjndinfo :info="item.name+': '+(item.level-1) + ' - ' + item.level" :num="key+1"></qnyhjndinfo>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import qnselect from './qnselect.vue';
import qnyhjndinfo from './qnyhjndinfo.vue';
import {attrs,expmonscales} from './data';
export default {
    components:{
        qnselect,
        qnyhjndinfo
    },
    data(){
        return {
            curzy:'',       //当前职业
            jnd:{},         //技能点
            result:[],      //计算结果集
            used:{
                mon:0,      //你已经投入在修为中的银两
                exp:0,      //你已经投入在修为中的钱
            },
            toused:{
                mon:0,      //你还需投入在修为中的银两
                exp:0,      //你还需投入在修为中的钱
            }
        }
    },
    computed:{
        zyjns(){
            return attrs[this.curzy];        //职业属性
        }
    },
    methods:{
        getZy(data){
            var curzy = this.curzy = localStorage.curzy = data.name;
            localStorage.jnd = '';
        },
        jndchange(){
            var alldata = expmonscales[this.curzy];
            var jnddata = this.jnd;
            localStorage.jnd = JSON.stringify(jnddata);
            console.log(alldata);
            //把学过的与没学的拆分
            var yes = {}; var no = {}; var havenot = {};
            for(var name in alldata){
                var value = jnddata[name];
                if(value === '' || ( typeof value == 'undefined')){
                    havenot[name] = alldata[name].slice(1);
                    continue;
                }
                value = Number(value);
                if(value%1 != 0){
                    alert('请填写整数');return;
                }else if(value>40){
                    alert('点数不能大于40');return;
                }else if(value<0){
                    alert('点数不能小于0');return;
                }else{
                    var alljndata = alldata[name];
                    yes[name] = []; no[name] = [];
                    alljndata.forEach(element => {
                        if(element&&element.level>1){
                            if(element.level <= value){
                                yes[name].push(element);
                            }else{
                                no[name].push(element);
                            }
                        }
                    });
                }
            }
            //获取已经使用的mon,exp
            console.log('yes',yes);
            console.log('no',no);
            console.log('havenot',havenot);
            var usedmon = 0; var usedexp = 0;
            for(var name in yes){
                yes[name].forEach(function(element){
                    usedmon += Number(element.mon);
                    usedexp += Number(element.exp);
                });
            }
            this.used = {mon:usedmon,exp:usedexp};
            //获取还需要的mon和exp
            var tousedmon = 0; var tousedexp = 0;
            for(var name in no){
                no[name].forEach(function(element){
                    tousedmon += Number(element.mon);
                    tousedexp += Number(element.exp);
                });
            }
            for(var name in havenot){
                havenot[name].forEach(function(element){
                    tousedmon += Number(element.mon);
                    tousedexp += Number(element.exp);
                });
            }
            this.toused = {mon:tousedmon,exp:tousedexp};

            //获取结果
            var result = [];
            var resultLength = 20;
            for(var i=0;i<resultLength;i++){
                var datas = [];
                for(var name in no){
                    datas.push(no[name][0]?no[name][0].scale:0);
                }
                datas.sort(function(a,b){
                    return b-a;
                });
                console.log(i,datas);
                var find = false;
                for(var name in no){
                    if(no[name][0]&&no[name][0].scale == datas[0]&&!find){
                        result.push(no[name].shift());
                        find = true;
                    }
                }
            }
            this.result = result;
        }
    },
    mounted(){
        //数据本地缓存取出来
        this.curzy = localStorage.curzy?localStorage.curzy:'';
        this.jnd = localStorage.jnd?JSON.parse(localStorage.jnd):{};
    }
}
</script>
<style lang="less">
.qnyhjnd_container{
    width:100%; height:100%;
    .back{
        height:100%;
        .back_t{
            height:50%; background: #dfe0e5; position: relative; overflow:hidden; text-align: left;
            .jinengs{
                margin:30px 30px 0 80px;
                .jineng{
                    border:1px solid #999; border-radius: 8px; padding:5px; box-shadow: 2px 2px 1px 1px #999; margin:0 20px 20px 0;
                    span{
                        font-size:14px; line-height: 24px;
                    }
                    input{
                        height:24px; width:40px; text-indent: 6px; border-radius: 5px;
                    }
                }
            }
            .jisuan{
                padding: .5em 2em;
                background-image: linear-gradient(#ddd, #bbb);
                border: 1px solid rgba(0,0,0,.2);
                border-radius: .3em;
                box-shadow: 0 1px white inset;
                text-align: center;
                text-shadow: 0 1px 1px black;
                color:#666; cursor: pointer;
                font-weight: bold;
                outline: none; margin-left:30px; margin-right:30px;
            }
            .jisuan:active{
                box-shadow: .05em .1em .2em rgba(0,0,0,.6) inset;
                border-color: rgba(0,0,0,.3);
                background: #bbb;
            }
        }
        .back_b{
            height:50%; background: #edeef2; position: relative;
            .selectBox{
                margin:20px;
            }
        }
    }
}
</style>
