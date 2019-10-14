<template>
    <div class="qnxjl_container">
        <div class="container">
            
            <div class="inputs">
                <input id="searchBtn" type="text" value="" placeholder=""/>
            </div>
            <div class="con">
                <ul class="con_list">
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
export default {
    name:'qnxjl'
}
</script>
<style lang="less">
.qnxjl_container{
    width:100%; height:100%; background:url(./images/back.jpeg); background-size: cover;
    .container{ width:800px; margin:0px auto; height: 100%; overflow: hidden;
        .inputs{
           input{ font-size: 18px; display: block; width:80%; height: 30px; line-height: 30px; margin: 10px auto 0; border-radius: 5px; text-indent: 10px;}
        }
        .con{ width:700px; padding:10px 0; margin: 10px auto; border-radius: 5px;
            .con_list{ overflow:auto; height: 100%;
                li{
                    cursor: pointer; list-style: none; overflow: hidden; padding:2px 6px; background:#963;
                    border-radius: 5px;
                }
                li span{width:300px; float:left;word-wrap : break-word;}
                li span.pinyin{display: none;}
                li span.shouzimu{display: none;}
                li .icon{float:left; width:0;height:0;border-top:6px solid transparent; border-bottom:6px solid transparent; border-left:8px solid blue; margin: 2px 4px;}
                li button{width:42px; float:right; height:100%;}            
            }
       }
    }
    .help{ width:20px; height:20px; position:absolute; top:20px; right:20px; background: #aaa; border-radius: 50%; box-shadow: 0 0 5px 5px #eee; cursor: pointer;} 
    .help img{ width:100%; height:100%;}
}

</style>