import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  // { path: '/', redirect: '/Index' },
  { path: '/',
    component: () => import('@/views/Index'),
    children: [
      { path: '/', name: 'home', component: () => import('@/views/home'), meta: { iskeepAlive: true } },
      { path: '/question', name: 'question', component: () => import('@/views/question') },
      { path: '/video', name: 'video', component: () => import('@/views/video') },
      { path: '/user', name: 'user', component: () => import('@/views/user') }
    ]
  },
  { path: '/user/profile', name: 'profile', component: () => import('@/views/user/profile') },
  { path: '/user/chat', name: 'chat', component: () => import('@/views/user/chat') },
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  { path: '/search', name: 'search', component: () => import('@/views/search') },
  { path: '/search/result', name: 'result', component: () => import('@/views/search/result') },
  { path: '/article', name: 'article', component: () => import('@/views/article'), meta: { iskeepAlive: true } }
]

const router = new VueRouter({
  routes
})
// 定义路由守卫，在路由跳转前判断用户是否登录
router.beforeEach((to, from, next) => {
  // 获取用户登录的token信息
  const { UserToken } = store.state
  // 获取用户当前要访问的路由跳转信息
  const loginConfig = { path: '/login', query: { redirectUrl: to.path } }
  // 如果用户没有登录，并且用户要访问需要token的页面
  if (!UserToken.token && to.path.startsWith('/user')) {
    return next(loginConfig)
  }
  // 否则放行
  next()
})

export default router
