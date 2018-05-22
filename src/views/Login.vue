<template>
    <div class="container">
        <div class="login-container">
            <h1 class="title">XXX系统欢迎您</h1><br>
            <el-input v-model="username" placeholder="工号" @keyup.enter.native="loginFun">
                <i slot="suffix" class="el-input__icon el-icon-service"></i>
            </el-input>
            <br>
            <br>
            <el-input v-model="password" placeholder="密码" type="password" @keyup.enter.native="loginFun">
                <i slot="suffix" class="el-input__icon el-icon-view"></i>
            </el-input>
            <br>
            <br>
            <el-button type="primary" @click="loginFun" style="width: 100%" :icon="loginBut.icon" :disabled="loginBut.disabled">登录</el-button>
        </div>
    </div>
</template>
<script>

    import http from '../common/http'
    import md5 from '../common/md5'

    export default {
        data() {
            return {
                username: 'admin',
                password: '123456',
                loginBut:{
                    icon: '',
                    disabled: false
                }
            };
        },
        methods: {
            loginFun:function() {

                this.loginBut.icon = 'el-icon-loading';
                this.loginBut.disabled = true;

                let data = {account: this.username, password: md5.hex_md5(this.password)};
                http.post(this, '/user/login', data, function(result){

                    //设置菜单
                    let routes = JSON.parse(sessionStorage.getItem("srcRoutes"));
                    let menusPool = [];
                    let menus = result.data.role.menus;
                    for (var i = 0; i < menus.length; i++) {
                        menusPool.push(menus[i].menuCode);
                    }

                    for (var i = 0; i < routes.length; i++) {
                        if(routes[i].children != undefined){
                            for (var j = 0; j < routes[i].children.length; ) {
                                if (!this.contains(menusPool, routes[i].children[j].path)) {
                                    this.remove(routes[i].children, j);
                                }else{
                                    j++;
                                }
                            }
                        }
                    }

                    for (var i = 0; i < routes.length; ) {
                        if(routes[i].children != undefined){
                            if(routes[i].children.length == 0){
                                this.remove(routes, i);
                            }else{
                                i++;
                            }
                        }else{
                            i++;
                        }
                    }

                    this.$router.options.routes = routes;
                    sessionStorage.setItem('fiterRoutes', JSON.stringify(routes));
                    //设置菜单

                    sessionStorage.setItem('token', result.data.token);
                    sessionStorage.setItem('realName', result.data.realName);
                    this.$router.push('/home');
                    this.loginBut.icon = '';
                    this.loginBut.disabled = false;
                }.bind(this), function () {
                    this.loginBut.icon = '';
                    this.loginBut.disabled = false;
                }.bind(this))
            },
            contains: function(arr, obj) {
                var i = arr.length;
                while (i--) {
                    if (arr[i] == obj) {
                        return true;
                    }
                }
                return false;
            },
            remove: function(arr, index) {
                if(isNaN(index)|| index>arr.length){
                    return false;
                }
                for(var i=0,n=0; i<arr.length; i++){
                    if(arr[i]!=arr[index]){
                        arr[n++]=arr[i];
                    }
                }
                arr.length-=1;
            },
        }
    }
</script>

<style>
    .container {
        text-align: center;
        background-size: 100% 100%;
        height: 100%;
        width: 100%;
    }

    .login-container {
        width: 350px;
        position: fixed;
        top: 56%;
        left: 50%;
        -webkit-transform: translateX(-50%) translateY(-72%);
    }
</style>
