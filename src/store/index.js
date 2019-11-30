import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '../utils/auth.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 存储获取的token数据
    token: auth.getToken()
  },
  mutations: {
    // 定义 设置token的方法,向服务器请求token的情况下，接收到的数据传进来
    setToken (state, newtoken) {
      // 将ajax请求传输过来的新token替换state中的token
      state.token = newtoken
      // 更新state数据的同时，也更新本地的localStorage
      auth.setToken(newtoken)
    },
    // 定义清除token的方法
    delToken (state) {
      // 清除state中的token数据，同时清除本地的缓存
      state.token = {}
      auth.delToken()
    }
  },
  actions: {

  },
  modules: {
  }
})
