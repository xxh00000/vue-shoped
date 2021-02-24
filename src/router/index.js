/*
 * @Author: your name
 * @Date: 2020-12-14 12:40:22
 * @LastEditTime: 2020-12-14 13:28:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-shop\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login.vue'
import Home from '../views/home.vue'
import Welcome from '../views/index/welcome.vue'
import User from '../views/user/users.vue'
import Right from '../views/power/rights.vue'
import Roles from '../views/power/roles.vue'
import Categories from '../views/goods/categories.vue'
import Params from '../views/goods/params.vue'
import List from '../views/goods/list.vue'
import Add from '../views/goods/add.vue'
import Edit from '../views/goods/edit.vue'
import Orders from '../views/orders/orders.vue'




Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome 
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/rights',
        component: Right
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Categories
      }, 
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/goods/edit',
        component: Edit
      },
      {
        path: '/orders',
        component: Orders
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// //配置路由守卫
router.beforeEach((to, from, next) => {
  //如果访问登录页直接放行
  if (to.path === '/login') {
    return next()
  }
  //如果用户不访问登录页，进行判断
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  if (!userInfo) {
    return next('/login')
  }
  next()
})

export default router