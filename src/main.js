import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// vant默认集成了懒加载功能Lazyload，但是默认导入没有注册，需要单独导入
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.less'
import 'amfe-flexible'
import './styles/index.less'
import plugin from '@/utils/plugin'
Vue.config.productionTip = false
Vue.use(Vant)
Vue.use(plugin)
// 将懒加载插件注册成全局可用
Vue.use(Lazyload)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
