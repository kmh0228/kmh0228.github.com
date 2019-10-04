<template>
    <div class="qnyhjnd_container">
        <div class="back">
            <div class="back_t">
                <div class="selectBox" style="top:20px; left:100px;">
                    <qnselect></qnselect>
                </div>
                
            </div>
            <div class="back_b">
                <div class="selectBox" style="top:20px; left:100px;">
                    <qnyhjndinfo></qnyhjndinfo>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import qnselect from './qnselect.vue';
import qnyhjndinfo from './qnyhjndinfo.vue';
export default {
    components:{
        qnselect,
        qnyhjndinfo
    }
}
</script>
<style lang="less">
.qnyhjnd_container{
    width:100%; height:100%;
    .back{
        height:100%;
        .back_t{
            height:50%; background: #dfe0e5; position: relative;
            .selectBox{
                position: absolute;
            }
        }
        .back_b{
            height:50%; background: #edeef2; position: relative;
            .selectBox{
                position: absolute;
            }
        }
    }
}
</style>
