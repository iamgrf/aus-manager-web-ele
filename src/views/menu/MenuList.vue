<template>

    <div>
        <el-button type="primary" @click="openAddMenuDialogFun({id: -1})">添加菜单</el-button>
        <hr>
        <el-tree default-expand-all :expand-on-click-node="false" :data="tree.data" :props="tree.props" v-loading="tree.loading" element-loading-text="别急，数据在跑..."
                 element-loading-spinner="el-icon-loading">
            <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
                <el-button type="text" size="mini" @click="() => openAddMenuDialogFun(data)">添加子菜单</el-button>
                <el-button type="text" size="mini" @click="() => delMenuFun(data)">删除</el-button>
            </span>
          </span>
        </el-tree>

        <el-dialog title="添加菜单" :visible.sync="menu.add.visible" width="20%">
            <el-form ref="form" label-width="80px">
                <el-form-item label="菜单名称">
                    <el-input v-model="menu.add.menuName"></el-input>
                </el-form-item>
                <el-form-item label="菜单编码">
                    <el-input placeholder="模糊匹配加‘.*’" v-model="menu.add.menuCode"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="menu.add.visible = false">取 消</el-button>
                <el-button type="primary" @click="addMenuFun">确 定</el-button>
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
        data(){
            return {
                tree: {
                    loading: false,
                    data:[],
                    props:{
                        children: 'children',
                        label: 'title'
                    }
                },
                menu:{
                    add:{
                        visible: false,
                        parentId: "",
                        menuName: "",
                        menuCode: ""
                    }
                }
            }
        },
        methods:{
            cascadeMenuFun: function(){
                this.tree.loading = true;
                http.post(this, urls.cascadeMenu, {}, function(result){
                    this.tree.data = result.data;
                    this.tree.loading = false;
                }.bind(this))
            },
            openAddMenuDialogFun: function(v){
                this.menu.add.parentId = v.id;
                this.menu.add.menuName = "";
                this.menu.add.menuCode = "";
                this.menu.add.visible = true;
            },
            addMenuFun: function(){
                let data = {
                    parentId: this.menu.add.parentId,
                    menuName: this.menu.add.menuName,
                    menuCode: this.menu.add.menuCode
                };
                http.post(this, urls.addMenu, data, function(result){
                    this.menu.add.visible = false;
                    notice.success(this, result.msg);
                    this.cascadeMenuFun();
                }.bind(this));
            },
            delMenuFun: function(v){
                notice.confirm(this, function(){
                    http.post(this, urls.delMenu+"/"+v.id, {}, function (result) {
                        notice.success(this, result.msg);
                        this.cascadeMenuFun();
                    }.bind(this))
                }.bind(this))
            },
        },
        mounted: function(){
            this.cascadeMenuFun();
        }
    }
</script>

<style>

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

</style>