// 频道相关接口
import request from '@/utils/request'
// 准备存储频道列表到本地浏览器缓存
import store from '@/store'
const KEY = 'hm-toutiao-m-86-channel'
// 1.查
/*
1.如果用户登录了，每次都发请求拿数据
2.如果用户没登陆，如果本地没数据，就发请求拿数据，拿到数据存入本地并返回
3.用户没登陆，但本地有数据，就取本地数据
  接口应该返回Promise对象，但拿本地数据后不是promise对象，创建promise对象
*/
export const getMyChannel = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { UserToken } = store.state
      // 1.用户登录，直接发送请求获取数据
      if (UserToken.token) {
        const data = await request('/app/v1_0/user/channels', 'get')
        resolve(data)
      } else {
        // 获取本地数据
        const localChannels = JSON.parse(window.localStorage.getItem(KEY) || '[]')

        // 本地没有数据，发送请求获取数据
        if (!localChannels.length) {
          const data = await request('/app/v1_0/user/channels', 'get')
          window.localStorage.setItem(KEY, JSON.stringify(data.channels))
          resolve(data)
        } else {
          // 将本地数据以服务端响应数据相同格式返回
          resolve({ channels: localChannels })
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}
// 获取所有频道列表的接口
export const getAllChannel = () => {
  return request('/app/v1_0/channels', 'get')
}

// 2.增  接口文档中叫 批量修改用户频道列表（重置式）
export const addMyChannel = (orderChannels) => {
  return new Promise(async (resolve, reject) => {
    const { UserToken } = store.state
    try {
      // 有token 用户已登录，发送请求获取
      if (UserToken.token) {
        console.log(orderChannels)
        await request('/app/v1_0/user/channels', 'put', {
          channels: orderChannels
        })
        resolve()
      } else { // 未登录使用本地数据
        const localChannels = JSON.parse(window.localStorage.getItem(KEY) || '[]')
        // 取出要添加的频道
        const { id, name } = orderChannels[orderChannels.length - 1]
        // 添加到数组中
        localChannels.push({ id, name })
        // 存回本地浏览器
        window.localStorage.setItem(KEY, JSON.stringify(localChannels))
        resolve()
        // 如果本地有数据
      }
    } catch (e) { reject(e) }
  })
}

// 3. 删除
export const delMyChannel = (thisChannelId) => {
  return new Promise(async (resolve, reject) => {
    const { UserToken } = store.state
    try {
      // 有token 用户已登录，发送请求删除
      if (UserToken.token) {
        await request('/app/v1_0/user/channels/' + thisChannelId, 'delete')
        resolve()
      } else { // 未登录使用本地数据，获取当前要删除id的索引值
        const localChannels = JSON.parse(window.localStorage.getItem(KEY) || '[]')
        const index = localChannels.findIndex(item => item.id.toString() === thisChannelId)
        // 删除这条频道
        localChannels.splice(index, 1)
        // 存回本地浏览器
        window.localStorage.setItem(KEY, JSON.stringify(localChannels))
        resolve()
        // 如果本地有数据
      }
    } catch (e) {
      reject(e)
    }
  })
}
