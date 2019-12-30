<template>
    <div class="login_container container">
        <login-background></login-background>
        <div class="login_content container">
            <div class="login_box opaBox" v-show="!registBoxShow">
                <span class="title">欢迎登陆</span>
                <div class="inputitem">
                    账号：<input type="text" v-model="username" placeholder="请输入账号"><br>
                </div>
                <div class="inputitem">
                    密码：<input type="text" v-model="password" placeholder="请输入密码"><br>
                </div>
                <div class="buttons clear">
                    <button @click="login" class="fl">登录</button>
                    <button @click="registBoxShow=true" class="fl">注册</button>
                </div>
                <a style="display:block;text-align:center; font-size:12px; color:#ccc; margin-top:20px;" href="http://beian.miit.gov.cn">
                    备案编号: 京ICP备18032050号-2
                </a>
            </div>
            <div class="regist_box opaBox" v-show="registBoxShow">
                <span class="title">欢迎注册</span>
                <div class="inputitem">
                    账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号:<input type="text" v-model="regist.username" placeholder="请输入账号"><br>
                </div>
                <div class="inputitem">
                    密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码:<input type="password" v-model="regist.password" placeholder="请输入密码"><br>
                </div>
                <div class="inputitem">
                    重复密码:<input type="password" v-model="regist.repassword" placeholder="请重复输入密码"><br>
                </div>
                <div class="inputitem">
                    邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱:<input type="text" v-model="regist.mail" placeholder="请输入邮箱"><br>
                </div>
                <div class="buttons clear">
                    <button @click="registclick" class="fl">注册</button>
                    <button @click="registBoxShow=false" class="fl">取消</button>
                </div>
            </div>
        </div> 
    </div>
</template>
<script>
import {mapActions} from 'vuex'
import axios from '_l/axios'
import loginBackground from './loginBackground'
export default {
    name:'login',
    components:{
        loginBackground
    },
    data(){
        return {
            username:'',
            password:'',
            regist:{
                username:'',
                password:'',
                repassword:'',
                mail:''
            },
            registBoxShow:false
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
                var status = res.data.state;
                if(status == 'error'){
                    alert('用户已经存在');
                }else if(status == 'success'){
                    alert('用户创建成功');
                }
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
                    _this.$router.push({
                        path:'/'
                    });
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
    overflow:hidden;
    .login_content{
        position: absolute; top:0; left:0;
        .opaBox{
            width:290px; height:300px; position:absolute; top:0; left:0; right:0; bottom:0; margin:auto;
            background:linear-gradient(230deg,rgba(53,57,74,0) 0%,rgb(0,0,0) 100%);
            box-shadow: -15px 15px 15px rgba(6,17,47,.7); padding:80px 40px 40px;
            .title{
                display:block; color:#d3d7f7; height:60px; font-size:23px; text-align: center;
            }
            .inputitem{
                height:52px; line-height: 52px; color:#d3d7f7;
                input{
                    background:none; font-size:16px; color:#61bfff; outline:none; border:none;
                }
            }
            .buttons{
                margin:27px 10px 0;
                button{
                    border-radius:50px; padding:10px 40px; border:2px solid #4fa1d9; color:#4fa1d9;
                    font-size:14px; background:none; outline:none; margin:0 10px;
                }
                button:hover{
                    background:#4fa1d9; color:#fff;
                }
            }
        }
        .login_box{
            
        }
        .regist_box{
            height:350px;
        }

    }
}
</style>