import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import Routers from './router'
import App from './App.vue'


sessionStorage.setItem('srcRoutes', JSON.stringify(Routers));
Vue.use(VueRouter)
Vue.use(ElementUI)

const router = new VueRouter({
    routes: Routers
});

router.beforeEach((to, from, next) => {
    if (to.path == '/') {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('realName');
    }
    let token = sessionStorage.getItem('token');
    if (!token && to.path != '/') {
        next({ path: '/' })
    } else {
        var fiterRoutes = sessionStorage.getItem('fiterRoutes');
        fiterRoutes = JSON.parse(fiterRoutes);
        if (fiterRoutes != null) {
            router.options.routes = fiterRoutes;
        }
        next()
    }
})

new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
})
