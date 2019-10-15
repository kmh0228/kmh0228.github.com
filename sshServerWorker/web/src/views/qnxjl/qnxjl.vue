<template>
    <div class="qnxjl_container">
        <div class="container clear">
            
            <div class="inputs fl">
                <input id="searchBtn" type="text" value="plase putin" placeholder=""/>
            </div>
            <div class="con fl">
                <div class="lineback clear">
                    <div class="fl"></div><div class="fl"></div>
                </div>
                <ul class="con_list" ref="con_list">
                    <li class="con_item cur">sssss</li>
                    <li class="con_item">sssss</li>
                    <li class="con_item">sssss</li>
                    <li class="con_item">sssss</li>
                    <li class="con_item">sssss</li>
                    <li class="con_item">sssss</li>  
                    <li class="con_item">sssss</li>  
                    <li class="con_item">sssss</li>  
                    <li class="con_item">sssss</li>  
                    <li class="con_item">sssss</li>                
                </ul>
            </div>
        </div>
        <div class="other">
            <a class="help" href="./help.html" target="_blank" title="帮助">
                <img src="./images/说明.svg" alt="关于">
            </a>
            <a class="plus" href="./help.html" target="_blank" title="添加词语">
                <img src="./images/plusIcon.png" alt="关于">
            </a>
        </div>
    </div>
</template>
<script>
import $ from 'jquery'
export default {
    name:'qnxjl',
    mounted(){
        function rand(a,b){return parseInt(a+(Math.random()*(b-a)));}
        this.$nextTick(function(){
            $(this.$refs.con_list).find('li').each(function(i,e){
                $(e).css('transform','rotate('+rand(-3,3)+'deg)');
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
                    cursor: pointer; list-style: none; color:#eee; line-height: 40px; font-size: 24px; cursor: pointer;
                    background-size: cover; border-radius: 5px; height:40px; background: url(./images/listback.png);
                    box-shadow: 2px 2px 1px 1px #630; margin-top: 10px;
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
}

</style>