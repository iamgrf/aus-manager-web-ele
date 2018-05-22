<template>
    <div>

        <div id="tool" class="tool" style="margin-bottom: 8px">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="table.query.account" placeholder="帐号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                            v-model="table.query.date"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="listUserFun">查询</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="openDialogAddUserFun">添加</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table :data="table.data" style="width: 100%; height: 500px; overflow-y: auto" v-loading="table.loading" element-loading-text="拉取数据中..."
                  element-loading-spinner="el-icon-loading" size="mini" border stripe>
            <el-table-column prop="account" label="帐号"></el-table-column>
            <el-table-column prop="realName" label="真实姓名"></el-table-column>
            <el-table-column prop="createDate" label="录入时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="openDialogAuthorizedFun(scope.row)">授权</el-button>
                    <el-button type="text" size="small" @click="delUserFun(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="tool" style="margin-top: 8px; text-align: right">
            <el-pagination
                    @current-change="pageChangeFun"
                    @size-change="pageSizeChangeFun"
                    background
                    :page-sizes="[20, 50, 200, 300]"
                    :page-size="table.page.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :current-page="table.page.page"
                    :total="table.page.total">
            </el-pagination>
        </div>

        <el-dialog title="添加用户" :visible.sync="user.add.visible" width="20%">
            <el-form class="demo-form-inline" label-width="80px">
                <el-form-item label="帐号">
                    <el-input placeholder="帐号" v-model="user.add.account"></el-input>
                </el-form-item>
                <el-form-item label="登录密码">
                    <el-input placeholder="登录密码" v-model="user.add.password"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名">
                    <el-input placeholder="真实姓名" v-model="user.add.realName"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="user.add.visible = false">取 消</el-button>
                <el-button type="primary" @click="addUserFun">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="用户授权" :visible.sync="user.authorized.visible" width="30%">
            <div>
                <el-row v-for="roles in user.authorized.roles">
                    <el-col :span="6" v-for="role in roles"><el-radio v-model="user.authorized.roleid" :label="role.id">{{role.roleName}}</el-radio></el-col>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="user.authorized.visible = false">取 消</el-button>
                <el-button type="primary" @click="authorizedFun">确 定</el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>

    import notice from '../../common/notice'
    import http from '../../common/http'
    import urls from '../../common/urls'
    import util from '../../common/util'
    import md5 from '../../common/md5'

    export default {
        data() {
            return {
                table:{
                    loading: false,
                    data: [],
                    page:{
                        page: 1,
                        size: 20,
                        total: 0
                    },
                    query:{
                        account: "",
                        date: ""
                    }
                },
                user:{
                    add:{
                        visible: false,
                        account: "",
                        password: "",
                        realName: "",
                    },
                    authorized:{
                        visible: false,
                        roleid: "",
                        userid: "",
                        roles: []
                    }
                }
            }
        },
        methods: {
            /**
             * 页码改变的回调，返回改变后的页码
             * @param v 页码
             */
            pageChangeFun: function(v){
                this.table.page.page = v;
                this.listUserFun();
            },
            /**
             * 切换每页条数时的回调，返回切换后的每页条数
             * @param v 每页数据数量
             */
            pageSizeChangeFun: function(v){
                this.table.page.size = v;
                this.listUserFun();
            },
            listUserFun: function(){

                this.table.loading = true;

                let data = {
                    account: this.table.query.account,
                    startDate: util.ymd(this.table.query.date == null ? "" : this.table.query.date[0]),
                    endDate: util.ymd(this.table.query.date == null ? "" : this.table.query.date[1]),
                    page: this.table.page.page,
                    size: this.table.page.size,
                };

                http.post(this, urls.listUser, data, function(result){
                    this.table.page.total = result.data.total;
                    this.table.data = result.data.data;
                    this.table.loading = false;
                }.bind(this));
            },
            openDialogAddUserFun: function(){
                this.user.add.account = "";
                this.user.add.realName = "";
                this.user.add.visible = true;
            },
            addUserFun: function(){
                let data = {
                    account : this.user.add.account,
                    password : md5.hex_md5(this.user.add.password),
                    realName : this.user.add.realName,
                };
                http.post(this, urls.addUser, data, function(result){
                    notice.success(this, result.msg);
                    this.user.add.visible = false;
                    this.listUserFun();
                }.bind(this));
            },
            delUserFun: function(row){
                notice.confirm(this, function(){
                    http.post(this, urls.delUser + "/" + row.account, {}, function(result){
                        notice.success(this, result.msg);
                        this.listUserFun();
                    }.bind(this));
                }.bind(this))
            },
            openDialogAuthorizedFun: function(row){
                let data = {
                    page: 1,
                    size: 10000,
                };
                http.post(this, urls.listRole, data, function(result){
                    this.user.authorized.roles = [];
                    let group = 4;
                    let datas = result.data.data;
                    let len = datas.length % group > 0 ? Math.floor(datas.length / group) + 1 : datas.length / group;
                    for (var i = 0; i < len; i++) {
                        this.user.authorized.roles.push(datas.slice(i * group, i * group + group));
                    }
                }.bind(this));
                this.user.authorized.roleid = row.roleId;
                this.user.authorized.userid = row.id;
                this.user.authorized.visible = true;
            },
            authorizedFun: function(){
                let data = {id: this.user.authorized.userid, roleId: this.user.authorized.roleid};
                http.post(this, urls.authorizedUser, data, function(result){
                    this.user.authorized.visible = false;
                    notice.success(this, result.msg);
                }.bind(this));
            },
        },
        mounted: function(){
            this.listUserFun();
        }
    }
</script>

<style>
    .has-gutter > tr > th{
        background-color: #F3F3F3;
    }
    .tool > .el-form > .el-form-item{
        padding: 0px;
        margin: 0px;
    }
    label{
        font-weight: bold
    }

</style>