<template>
    <div class="qnxjl_container">
        <div class="container clear">
            
            <div class="inputs fl">
                <input id="searchBtn" type="text" value="" placeholder=""/>
            </div>
            <div class="con fl">
                <ul class="con_list" ref="con_list">
                    <li class="con_item">sssss</li>
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
        <a class="help" href="./help.html" target="_blank">
            <img src="./images/说明.svg" alt="关于">
        </a>
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
            input{font-size: 18px; display: block; width:400px; height: 50px; line-height: 50px; margin: 10px auto 0;
                border-radius: 5px; text-indent: 10px; outline: none; border:none; background:none;
            }
        }
        .con{ width:460px; padding:10px 0; margin: 10px auto;
            .con_list{height: 100%;
                li{
                    cursor: pointer; list-style: none; color:#eee; line-height: 40px; font-size: 24px; cursor: pointer;
                    background-size: cover; border-radius: 5px; height:40px; background: url(./images/listback.png);
                    box-shadow: 2px 2px 1px 1px #963; margin-top: 10px;
                } 
            }
       }
    }
    .help{ width:20px; height:20px; position:absolute; top:20px; right:20px; background: #aaa; border-radius: 50%; box-shadow: 0 0 5px 5px #eee; cursor: pointer;} 
    .help img{ width:100%; height:100%;}
}

</style>