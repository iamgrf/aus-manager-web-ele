<template>
    <div>

        <div id="tool" class="tool" style="margin-bottom: 8px">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" @click="openAddRoleDialogFun">添加</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table :data="table.data" style="width: 100%; height: 500px; overflow-y: auto" v-loading="table.loading" size="mini" border stripe>
            <el-table-column prop="roleName" label="角色名"></el-table-column>
            <el-table-column prop="code" label="编码"></el-table-column>
            <el-table-column prop="createDate" label="录入时间"></el-table-column>
            <el-table-column prop="ordersTime" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="openAuthorizationDialogFun(scope.row)">授权</el-button>
                    <el-button type="text" size="small" @click="delRoleFun(scope.row)">删除</el-button>
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

        <el-dialog title="添加角色" :visible.sync="role.add.visible" width="20%">
            <el-form ref="form" label-width="80px">
                <el-form-item label="菜单名称">
                    <el-input v-model="role.add.roleName"></el-input>
                </el-form-item>
                <el-form-item label="菜单编码">
                    <el-input v-model="role.add.roleCode"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="role.add.visible = false">取 消</el-button>
                <el-button type="primary" @click="addRoleFun">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="角色授权" :visible.sync="authorization.visible" width="30%">
            <div style="height: 400px; overflow-y: auto; border: 1px solid #ebeef5">
                <el-tree
                        :data="authorization.tree.data"
                        node-key="id"
                        show-checkbox
                        default-expand-all
                        ref="tree"
                        :props="authorization.tree.props"
                        :check-strictly="true">
                </el-tree>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="authorization.visible = false">取 消</el-button>
                <el-button type="primary" @click="addAuthorizationFun">确 定</el-button>
            </span>
        </el-dialog>

    </div>

</template>

<script>

    import notice from '../../common/notice'
    import http from '../../common/http'
    import urls from '../../common/urls'
    import util from '../../common/util'

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
                role:{
                    add:{
                        visible: false,
                        roleName: "",
                        roleCode: ""
                    }
                },

                authorization:{
                    visible: false,
                    roleId: "",
                    tree:{
                        data:[],
                        props:{
                            children: 'children',
                            label: 'menuName'
                        }
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
                this.listRoleFun();
            },
            /**
             * 切换每页条数时的回调，返回切换后的每页条数
             * @param v 每页数据数量
             */
            pageSizeChangeFun: function(v){
                this.table.page.size = v;
                this.listRoleFun();
            },
            listRoleFun: function(){
                let data = {
                    page: this.table.page.page,
                    size: this.table.page.size,
                };

                http.post(this, urls.listRole, data, function(result){
                    this.table.page.total = result.data.total;
                    this.table.data = result.data.data;
                    this.table.loading = false;
                }.bind(this));
            },
            openAddRoleDialogFun: function(v){
                this.role.add.roleName = "";
                this.role.add.roleCode = "";
                this.role.add.visible = true;
            },
            addRoleFun: function(){
                let data = {
                    roleName: this.role.add.roleName,
                    code: this.role.add.roleCode
                };
                http.post(this, urls.addRole, data, function(result){
                    this.role.add.visible = false;
                    notice.success(this, result.msg);
                    this.listRoleFun();
                }.bind(this));
            },
            //打开授权界面
            openAuthorizationDialogFun:function(row){
                this.authorization.visible = true
                this.authorization.roleId = row.id;
                this.cascadeMenuFun();
            },
            cascadeMenuFun: function(){
                http.post(this, urls.cascadeMenuRole +"/"+ this.authorization.roleId, {}, function(result){
                    this.authorization.tree.data = result.data.menu;
                    this.$refs.tree.setCheckedKeys(result.data.check);
                }.bind(this))
            },
            //赋予角色权限
            addAuthorizationFun: function(){
                let keys = this.$refs.tree.getCheckedKeys();
                let data = {id: this.authorization.roleId, authorityCode: keys.toString()};
                http.post(this, urls.authorized, data, function(result){
                    notice.success(this, result.msg);
                    this.authorization.visible = false;
                    this.listRoleFun();
                }.bind(this));
            },
            //删除角色
            delRoleFun: function(row){
                notice.confirm(this, function(){
                    http.post(this, urls.delRole +"/"+ row.id, {}, function(result){
                        notice.success(this, result.msg);
                        this.listRoleFun();
                    }.bind(this))
                }.bind(this));

            }
        },
        mounted: function(){
            this.listRoleFun();
        }
    }
</script>

<style>
    .tool{
        background-color: #fff;
        border: 1px solid #d1dbe5;
        border-radius: 5px;
        padding: 8px;
    }
    .tool > .el-form > .el-form-item{
        padding: 0px;
        margin: 0px;
    }
    label{
        font-weight: bold
    }

</style>