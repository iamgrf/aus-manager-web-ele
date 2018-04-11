<template>
    <div style="text-align: center; padding-top: 20%; font-size: 50px">
        您没有权限访问此功能，<a href="#" @click="jumpToLoginPageFun">返回登录</a>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            };
        },
        methods: {
            jumpToLoginPageFun: function(){
                this.$router.push("/");
            }
        },
    };
</script>

<style>

</style>