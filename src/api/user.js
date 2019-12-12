import request from '@/utils/request'
/* @param {Object} loginForm */
// 导出成员login
export const login = (loginFrom) => {
  // 调用request中的函数并传三个参数过去,根据接口文档配置
  return request('/app/v1_0/authorizations', 'post', loginFrom)
}
// 关注用户
export const follow = (userId) => {
  return request('/app/v1_0/user/followings', 'post', { target: userId })
}
// 取消关注用户
export const unfollow = (userId) => {
  return request('/app/v1_0/user/followings/' + userId, 'delete')
}
// 获取用户信息
export const getUserInfo = () => {
  return request('/app/v1_0/user/profile', 'get')
}
// 修改用户头像
export const editUserPhoto = (photo) => {
  // 将base64位的头像信息存入formData中，上传图片
  const fd = new FormData()
  // debugger
  fd.append('photo', photo)
  return request('/app/v1_0/user/photo', 'patch', fd)
}
// 修改用户资料
export const editUserInfo = ({ name, gender, birthday }) => {
  return request('/app/v1_0/user/profile', 'patch', { name, gender, birthday })
}
