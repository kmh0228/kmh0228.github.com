<template>
    <div class="qnyhjnd_container">
        <div class="back">
            <div class="back_t">
                <div class="clear">
                    <div class="selectBox fl" style="margin:20px 0 0 50px;">
                        <qnselect @select="getZy"></qnselect>
                    </div>
                    <pre class="fl" style="margin:20px 50px 0 50px; text-align:left;">
                        左边牌子选职业，下面选技能等级。然后最下面就出来经验比最高的技能排序。
                        注意：别点那么快，人家要一点点计算的
                        没有学的技能空着，它不会算
                    </pre>
                </div>
                
                <div class="jinengs clear">
                    <div class="jineng fl" v-for="item in zyjns">
                        <span>{{item}}:&nbsp;</span>
                        <input type="number" value="0" step="1" min="0" max="40" v-model="jnd[item]" @change="jndchange">
                    </div>
                </div>
                
            </div>
            <div class="back_b clear">
                <div v-for="(item,key) in result" class="selectBox fl">
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
            result:[]
        }
    },
    computed:{
        zyjns(){
            return attrs[this.curzy];        //职业属性
        }
    },
    methods:{
        getZy(data){
            var curzy = this.curzy = data.name;
        },
        jndchange(){
            var alldata = expmonscales[this.curzy];
            var jnddata = this.jnd;
            //把学过的与没学的拆分
            var yes = []; var no = [];
            for(var name in jnddata){
                var value = jnddata[name];
                if(value === ''){
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
                    for(var name2 in alljndata){
                        if(Number(name2) <= value){
                            yes.push(alljndata[name2]);
                        }else{
                            no.push(alljndata[name2]);
                        }
                    }
                }
            }
            no.sort(function(a,b){
                return b.scale - a.scale;
            });
            this.result = no.slice(0,no.length>20?20:no.length);
        }
    }
}
</script>
<style lang="less">
.qnyhjnd_container{
    width:100%; height:100%;
    .back{
        height:100%;
        .back_t{
            height:50%; background: #dfe0e5; position: relative; overflow:hidden;
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
