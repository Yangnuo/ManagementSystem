import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import { API_CHEAK_TOKEN } from '@/api/apis'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/index', component: () => import('../views/Index.vue'),
    children: [
      { path: '', component: () => import('../views/pages/Homepage.vue'), meta: { role: ['super', 'normal'] } },
      { path: '/index/order_mage', component: () => import('../views/pages/Order_mage.vue'), meta: { breadcrumb: ["订单管理"], role: ['super', 'normal'] } },
      { path: '/index/goods_list', component: () => import('../views/pages/Goods_list.vue'), meta: { breadcrumb: ["商品管理", "商品列表"], role: ['super', 'normal'] } },
      { path: '/index/goods_added', component: () => import('../views/pages/Goods_added.vue'), meta: { breadcrumb: ["商品管理", "商品添加"], role: ['super', 'normal'] } },
      { path: '/index/goods_cify', component: () => import('../views/pages/Goods_cify.vue'), meta: { breadcrumb: ["商品管理", "商品分类"], role: ['super', 'normal'] } },
      { path: '/index/shop_mage', component: () => import('../views/pages/Shop_mage.vue'), meta: { breadcrumb: ["店铺管理"], role: ['super'] } },
      { path: '/index/account_list', component: () => import('../views/pages/Account_list.vue'), meta: { breadcrumb: ["账号管理", "账号列表"], role: ['super'] } },
      { path: '/index/account_add', component: () => import('../views/pages/Account_add.vue'), meta: { breadcrumb: ["账号管理", "添加账号"], role: ['super'] } },
      { path: '/index/change_pwd', component: () => import('../views/pages/Change_pwd.vue'), meta: { breadcrumb: ["账号管理", "修改密码"], role: ['super'] } },
      { path: '/index/goods_statistics', component: () => import('../views/pages/Goods_statistics.vue'), meta: { breadcrumb: ["销售统计", "商品统计"], role: ['super'] } },
      { path: '/index/orders_statistics', component: () => import('../views/pages/Orders_statistics.vue'), meta: { breadcrumb: ["销售统计", "订单统计"], role: ['super'] } },
      { path: '/index/Personal_info', component: () => import('../views/pages/Personal_info.vue'), meta: { breadcrumb: ["个人中心"], role: ['super'] } },
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  to, from, next
  if (to.path != '/') {
    API_CHEAK_TOKEN(localStorage.token).then(res => {
      if (res.data.code == 0) {
        next()
        if (to.meta.role.includes(localStorage.role)) {
          next()
        } else {
          next(from.path)
        }
      } else {
        next('/')
      }
    })
    // console.log(to.meta.role.includes(localStorage.role), from);

  } else {
    next()
  }
  // console.log(to.path); 


})

export default router

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
