import axios from 'axios'
import JSONBIGINT from 'json-bigint'
import store from '@/store'

const instance = axios.create({
  baseURL: 'http://ttapi.rearch.itcast.cn/',
  transformResponse: [data => {
    try {
      return JSONBIGINT.parse(data)
    } catch (e) {
      return data
    }
  }]
  // 可以这么写，但是如果本地没有token就会引起错误，所以写成下面的格式
/*   headers: {
    Authorization: `Bearer ${store.state.token.token}`,
    'Cookie': 'sessionId=' + sessionId + '; recId=' + recId//Cookie的写法
  } */
})

instance.interceptors.request.use(
  // 拦截成功时
  config => {
  // 在请求拦截器中配置，如果本地有token数据
    if (store.state.token.token) {
    // 将token信息添加到请求头的认证信息中
      config.headers.Authorezation = `Bearer ${store.state.token.token}`
    }
  },
  // 拦截失败时 返回promise对象的reject属性，并携带错误信息
  err => Promise.reject(err)
)
