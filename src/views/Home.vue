<template>
    <div style="height: 100%">
        <el-container style="height: 100%;">
            <el-header>
                <div style="text-align: right; float: left">
                    <label style="font-size: 30px; color: white">XXX系统</label>
                </div>
                <div style="text-align: right; float: right;">
                    <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link" style="color: white">您好：{{realName}}<i class="el-icon-arrow-down el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="pi">个人信息</el-dropdown-item>
                            <el-dropdown-item command="up">修改密码</el-dropdown-item>
                            <el-dropdown-item command="out">退出系统</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-container style="height: 100%">
                <el-aside width="200px" style="height: 100%">

                    <el-menu class="el-menu-vertical-demo">

                        <el-submenu :index="index+''" v-for="(item,index) in $router.options.routes" v-if="item.show">
                            <template slot="title">
                                <i :class="item.icon"></i>
                                <span>{{item.menuName}}</span>
                            </template>
                            <el-menu-item v-for="(item1, index1) in item.children" :index="item1.path" v-if="item1.show" @click="jumpPageFun">{{item1.menuName}}</el-menu-item>
                        </el-submenu>

                    </el-menu>

                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>

        <el-dialog title="修改密码" :visible.sync="user.update.visible" width="20%">
            <el-form class="demo-form-inline" label-width="100px">
                <el-form-item label="旧密码">
                    <el-input placeholder="旧密码" v-model="user.update.oldPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input placeholder="新密码" v-model="user.update.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="再次录入">
                    <el-input placeholder="再次录入" v-model="user.update.againNewPassword"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="user.update.visible = false">取 消</el-button>
                <el-button type="primary" @click="updatePasswordFun">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                realName: "",
                user:{
                    update:{
                        visible: false,
                        oldPassword: "",
                        newPassword: "",
                        againNewPassword: "",
                    },
                    personalInformation:{

                    }
                }
            };
        },
        methods: {
            handleCommand: function(v) {
                if(v == 'pi'){

                }else if(v == "up"){
                    this.user.update.visible = true;
                }else if(v == "out"){
                    sessionStorage.removeItem("realName");
                    sessionStorage.removeItem("token");
                    this.$router.push('/');
                }
            },
            jumpPageFun: function(v){
                this.$router.push(v.index);
            },
            updatePasswordFun: function(){
                if (this.user.update.newPassword != this.user.update.againNewPassword){

                }
            }
        },
        mounted: function(){
            let realName = sessionStorage.getItem("realName");
            this.realName = realName;
        }
    }
</script>
<style>
    .el-header {
        background-color: #495060;
        color: #333;
        line-height: 60px;
    }
    [role = menubar] {
        height: 100%;
    }
</style>