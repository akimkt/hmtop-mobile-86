// 文章相关接口

import request from '@/utils/request'
// 获取文章列表
export const getUserArticles = (channelId, timestamp) => {
  return request('/app/v1_1/articles', 'get', {
    channel_id: channelId,
    timestamp,
    with_top: 1
  })
}

// 获取文章详情
export const getArticle = (id) => {
  return request('/app/v1_0/articles/' + id, 'get')
}

// 举报文章
export const report = (articleId, type) => {
  return request('/app/v1_0/article/reports', 'post', {
    target: articleId,
    type
  })
}
// 点赞
export const likings = (articleId) => {
  return request('/app/v1_0/article/likings', 'post', { target: articleId })
}
// 取消点赞
export const unLikings = (articleId) => {
  return request('/app/v1_0/article/likings/' + articleId, 'delete')
}
// 不喜欢此文章
export const disLikeArticle = (clickId) => {
  return request('/app/v1_0/article/dislikes', 'post', { target: clickId })
}
// 取消对文章不喜欢
export const unDislikes = (articleId) => {
  return request('/app/v1_0/article/dislikes/' + articleId, 'delete')
}
/*  评论和回复 */
// 获取评论或回复
export const getCommentsOrReply = (type, source, offset, limit = 10) => {
  return request('/app/v1_0/comments', 'get', {
    type, source, offset, limit
  })
}
// 添加评论或回复

export const addCommentsOrReply = (target, content, art_id = null) => {
  return request('/app/v1_0/comments', 'post', {
    target, content, art_id
  })
}
// 搜索相关 约定本地存储的搜素历史搜索的key名称
const KEY = 'hm-toutiao-86-history-key'
export const getSearchHistory = () => {
  // 获取本地的历史记录
  return new Promise((resolve, reject) => {
    try {
      const data = JSON.parse(window.localStorage.getItem(KEY) || '[]')
      resolve(data)
    } catch (e) {
      reject(e)
    }
  })
}
// 添加历史记录
export const setSearchHistory = (keyWord) => {
  return new Promise((resolve, reject) => {
    try {
      // 获取本地存储历史数组，
      const data = JSON.parse(window.localStorage.getItem(KEY) || '[]')
      // 设置成set格式的数据，不会有重复的元素
      const set = new Set(data)
      set.add(keyWord)
      // 恢复成数组并返回
      const historyList = [...set]
      // 将数组存回本地
      window.localStorage.setItem(KEY, JSON.stringify(historyList))
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}
// 删除单条历史记录
export const delSearchHistory = (keyWord) => {
  return new Promise((resolve, reject) => {
    try {
      // 获取本地存储历史数组，
      const data = JSON.parse(window.localStorage.getItem(KEY) || '[]')
      // 设置成set格式的数据，不会有重复的元素
      const set = new Set(data)
      set.delete(keyWord)
      // 恢复成数组并返回
      const historyList = [...set]
      // 将数组存回本地
      window.localStorage.setItem(KEY, JSON.stringify(historyList))
      resolve(historyList)
    } catch (e) {
      reject(e)
    }
  })
}
// 清空历史记录
export const clearSearchHistory = () => {
  return new Promise((resolve, reject) => {
    try {
      window.localStorage.removeItem(KEY)
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}
// 联想词条
export const suggest = (keyWord) => {
  return request('app/v1_0/suggestion', 'get', { q: keyWord })
}
// 获取搜素结果
export const getSearchList = ({ page = 1, perPage = 10, keyWord }) => {
  return request('/app/v1_0/search', 'get', {
    page, per_page: perPage, q: keyWord
  })
}
