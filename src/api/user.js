import request from '@/utils/request'
/* @param {Object} loginForm */
// 导出成员login
export const login = (loginFrom) => {
  // 调用request中的函数并传三个参数过去,根据接口文档配置
  return request('/app/v1_0/authorizations', 'post', loginFrom)
}
