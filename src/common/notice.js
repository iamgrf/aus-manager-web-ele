export default {

    success: function(self, msg){
        self.$notify({
            title: '系统提示',
            message: msg,
            type: 'success'
        });
    },

    error: function(self, msg){
        self.$notify.error({
            title: '系统提示',
            message: msg
        });
    },

    confirm: function(self, callBack, msg = "确认此操作吗?"){
        self.$confirm(msg, '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            callBack()
        }).catch(() => {

        });
    },

    openLoad: function(self){
        return self.$loading({
            lock: true,
            text: '别急，数据在跑...',
            spinner: 'el-icon-loading',
        });
    },

    closeLoad: function(self){
        self.close();
    }

}