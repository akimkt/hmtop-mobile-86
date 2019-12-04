import axios from 'axios'
import JSONBIGINT from 'json-bigint'
import store from '@/store'
import router from '@/router'

const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn',
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
    if (store.state.UserToken.token) {
    // 将token信息添加到请求头的认证信息中
      config.headers.Authorezation = `Bearer ${store.state.UserToken.token}`
    }
    // 处理后要请求返回，继续发送
    return config
  },
  // 拦截失败时 返回promise对象的reject属性，并携带错误信息
  err => Promise.reject(err)
)
// 响应拦截器
instance.interceptors.response.use(
  res => {
  // 拦截成功时尝试简化数据，
    try {
      return res.data.data
    // 如果不是res.data.data的格式就直接返回res
    } catch (e) {
      return res
    }
  // 如果拦截到错误信息
  }, async err => {
  // 通过touer获取当前路由跳转对象信息
    const loginconfig = { path: '/login', query: { redirectUrl: router.currentRoute.path } }
    // 路由跳转到login页面时并将当前操作所在的路由地址信息通过地址栏redirectUrl的值传过去
    // 在错误信息时，尝试更新token的代码块
    try {
    // 如果 有响应错误信息并且响应状态码是401
      if (err.response && err.response.status === 401) {
      // 获取vuex中的token
        const { UserToken } = store.state
        // 如果没有token,说明没有登录，请跳转
        // 或没有refresh_token数据，就无法刷新token
        if (!UserToken.token || !UserToken.refresh_token) {
          router.push(loginconfig)
          // 不再执行下面的代码，返回错误信息
          return Promise.reject(err)
        }
        // 到达这里说明有token也有refresh_token，是token失效了，需要刷新token

        // 发送请求申请新token
        // 有两个axios实例，axios和instance
        // 因为instance的header中携带的是token，无法再携带refresh_token数据，所以用axios

        const res = await axios({
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          method: 'put',
          headers: {
            Authrization: `Bearer ${UserToken.refresh_token}`
          }
        })
        // 重新请求token成功后，调用vuex的方法，更新本地token
        store.commit('setToken', {
          token: res.data.data.token,
          // 请求回来的数据没有refresh_token，如果不传refresh_token，会refresh_token丢失，需要把之前的获取到重新存一遍
          refresh_token: UserToken.refresh_token
        })
        // 更新token后要继续去做之前的请求
        // instance是当前request要导出的封装好的axios请求
        // err.config是之前的请求配置信息
        return instance(err.config)
      }
    } catch (e) {
    // 如果刷新token出错，跳转到登录页面,并返回错误信息
      router.push(loginconfig)
      return Promise.reject(e)
    }
    return Promise.reject(err)
  })

/* // 导出一个封装好的axios请求函数，类似jquery发送ajax
export default (url, method, data) => {
  return instance({
    // 简易赋值
    url,
    method,
    // 对象属性名声明方式，如果是get属性名params,否则
    [ method.toLowerCase() === 'get' ? 'params' : 'data' ]: data
  })
} */
export default (url, method, data) => {
  return instance({
    // headers:{} 请求头传参
    url,
    method,
    // 当请求方式是get 是params来传参
    // 其他请求方式   是data来传参
    // 动态插入 属性 params|data
    // [] 写任意表达式  返回结果一定要是字符串类型
    // 不够严谨：用户传入请求方式 get Get GET
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
