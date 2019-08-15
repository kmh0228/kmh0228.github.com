<!--
    粮食的表单组件
    data的key请不要使用该组件的关键字  rowClassName
-->
<template>
    <div class="ls_table_container">
        <div class="table_container" :style="{height:mheight=='auto'?mheight:mheight+'px'}">
            <div  class="con" ref="table_container" style="height:100%;">
                <regoinRoller_con ref="regoinRoller_con" :height="mheight" :rollerConfig="rollerConfig||{}">
                    <table ref="table_con" :style="{marginTop:marginTop+'px'}">
                        <tr ref="conTableTr">
                            <th v-for="title in mcolumns">{{title.title}}</th>
                        </tr>
                        <tr v-for="rowdata in mdata" :class="mrowClassName(rowdata)">
                            <td v-for="key in mcolumns" :class="key.className" @click="dataClick(rowdata,key.key)">{{rowdata[key.key]}}</td>
                        </tr>
                    </table>
                </regoinRoller_con>
            </div>
            <div class="header">
                <table ref="headerTable">
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import regoinRoller_con from 's-vue-scrollcon'
import {forEach} from '@s5ming/array'
export default {
    name:'sVueTable',
    components:{
        regoinRoller_con
    },
    props:['columns','data','height','rowClassName','rollerConfig'],
    data(){
        return {
           marginTop:0,
           allHeight:0,
           pre:0,
           mheight:0
        }
    },
    computed:{
        mcolumns(){               
            let columns = this.columns || [{title:'请给个columns',key:'no1'},{title:'请给个columns',key:'no2'},{title:'请给个columns',key:'no3'}]
            forEach(columns,function(element,index){
                if(typeof element == 'string'){
                    columns[index] = {title:element,key:index}
                }
            })
            return columns
        },
        mrowClassName(){
            return this.rowClassName || function(){return null}
        },
        mdata(){
            return this.data || [{no1:'请给个data',no2:'请给个data',no3:'请给个data'},
            {no1:'请给个data',no2:'请给个data',no3:'请给个data'},
            {no1:'请给个data',no2:'请给个data',no3:'请给个data'}
            ]
        }
    },
    watch:{
        height(val){
            this.update()
            let height = val || 600
            let mt = this.pre * (height - this.allHeight)
            this.marginTop = mt > 0 ? 0 :mt
            this.mheight = height
        }
    },
    methods:{
        update(){
            this.allHeight = window.parseInt($(this.$refs.table_con).height())
            if(!this.mheight){this.mheight = this.allHeight}
        },
        dataClick(row,key){
            this.$emit('dataClick',row,key)
        }
    },
    mounted(){ 
        this.$nextTick(function(){
            //复制表头给header
            let con_trth = $(this.$refs.conTableTr)
            let header_trth = con_trth.clone()
            header_trth.appendTo($(this.$refs.headerTable))
            header_trth.find('th').each(function(i,e){
                let obj = con_trth.children('th:eq('+i+')')
                $(e).width(obj.width())
            })
            this.update()
        })

    }
}
</script>
<style lang="less">
.ls_table_container{
    width:100%; position: relative;
    .table_container{
        .header{
            position:absolute; top:0; left:0;width:100%;
        }
        .con{
            height:100%;
        }
        table{
            background: #093660;
            width:100%;
            border-collapse: collapse;
        }
        td,th{
            border:none;
            background: #0e5784;
            color:#a1ddfd;
            border-bottom:1px solid #0b305c;
            height:30px;
            text-align: right;
            padding:0 4px;
        }
        td{
            background: #093660;
        }
        tr td:nth-child(1),tr th:nth-child(1){
            text-align: left;
        }
    }
    
}
</style>