const TokenKey = 'hm-toutiao-m-86-user'
// 注意！！！ 约定数据value格式{token:'',refresh_token:''}

// 获取token的方法
export const getToken = () => {
  return JSON.parse(window.localStorage.getItem(TokenKey) || '{}')
}
// 设置token的方法
export const setToken = value => {
  window.localStorage.setItem(TokenKey, JSON.stringify(value))
}
// 删除token的方法
export const delToken = () => {
  window.localStorage.removeItem(TokenKey)
}
