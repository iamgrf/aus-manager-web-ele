import Login from './views/Login.vue'
import Home from './views/Home.vue'
import PermissionDenied from './views/permission/PermissionDenied.vue'

import UserList from './views/user/UserList.vue'

import MenuList from './views/menu/MenuList.vue'

import RoleList from './views/role/RoleList.vue'

const routers = [
    {
        path: '/',
        component: Login,
        show: false,
    },{
    	path: '/home',
    	component: Home,
    	show: false,
	},{
        path: '/permissionDenied',
        component: PermissionDenied,
        show: false,
    },{
        path: '/',
        component: Home,
        menuName: '用户管理',
        icon: 'el-icon-goods',
        show: true,
        children: [
            {path: '/userList', component: UserList, menuName: '用户列表', show: true},
        ]
    },{
        path: '/',
        component: Home,
        menuName: '角色管理',
        icon: 'el-icon-goods',
        show: true,
        children: [
            {path: '/roleList', component: RoleList, menuName: '角色列表', show: true},
        ]
    },{
        path: '/',
        component: Home,
        menuName: '菜单管理',
        icon: 'el-icon-goods',
        show: true,
        children: [
            {path: '/menuList', component: MenuList, menuName: '菜单列表', show: true},
        ]
    }
];
export default routers