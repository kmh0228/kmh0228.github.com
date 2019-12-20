<template>
    <div class="login_container container">
        <div class="login_box">
            <br><br><br>      <br><br>
            账号：<input type="text" v-model="username"><br>
            密码：<input type="text" v-model="password"><br>
            <button @click="login">登录</button>
            <button @click="registBoxShow=true">注册</button>
        </div>
        <div class="regist_box" v-show="registBoxShow">
            <div class="regist_con">
                账号:<input type="text" v-model="regist.username"><br>
                密码:<input type="password" v-model="regist.password"><br>
                重复密码:<input type="password" v-model="regist.repassword"><br>
                邮箱:<input type="text" v-model="regist.mail"><br>
                <button @click="registclick">注册</button>
                <button @click="registBoxShow=false">取消</button>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex'
import axios from '_l/axios'
export default {
    name:'login',
    data(){
        return {
            username:'admin',
            password:'admin',
            regist:{
                username:'www',
                password:'111',
                repassword:'111',
                mail:'111'
            },
            registBoxShow:true
        }
    },
    methods:{
        ...mapActions(['handleLogin']),
        registclick(){
            var regist = this.regist;
            if(!regist.username){alert('账号不能为空');return;}
            if(!regist.password){alert('密码不能为空');return;}
            if(regist.repassword!=regist.password){alert('两次密码不一致');return;}
            if(!regist.mail){alert('邮箱不能为空');return;}
            var axi = new axios();
            axi.request({
                url:'/api/user/regist',
                data:regist,
                method:'post'
            }).then(function(res){
                
            });
        },
        getUserInfo(token){
            console.log('getUserInfo');
            var axi = new axios;
            axi.request({
                url:'/api/user/getUserInfo',
                data:{token:token},
                method:'post'
            }).then(function(res){
                console.log(res);
            })
        },
        login(){
            var username = this.username,  password = this.password;
            var axi = new axios();
            var _this = this;
            axi.request({
                url:'/api/user/login',
                data:{username,password},
                method:'post'
            })
            .then(data=>{
                var state = data.data.state;
                if(state == 'ok'){
                    _this.getUserInfo(data.data.data.token);
                    // _this.$router.push({
                    //     path:'/'
                    // });
                }else if(state == 'none'){
                    alert('无此账号');
                }else if(state == 'password error'){
                    alert('密码错误');
                }
            }).catch(error=>{
                console.log(error);
            });
        }
    },
    mounted(){

       

    }
}
</script>
<style lang="less">
.login_container{
    position: relative;
    .regist_box{
        position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.3);
        .regist_con{
            width:300px; height:300px; background:#ccc; margin:100px auto;
        }
    }
}
</style>