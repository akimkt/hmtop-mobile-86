// 频道相关接口
import request from '@/utils/request'

export const getMyChannel = () => {
  return request('/app/v1_0/user/channels', 'get')
}
