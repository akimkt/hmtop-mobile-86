// 各种插件

// 引入时间处理插件
import dayjs from 'dayjs'
// 引入 相对时间处理 的扩展插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 引入多语言插件 dayjs支持国际化I18n，只需要引入包
import 'dayjs/locale/zh-cn'
// 定义时间过滤插件
// 先进行扩展插件的注册
dayjs.extend(relativeTime)
const relTime = (value) => {
  // 返回过滤后的新值，返回值采用中文
  return dayjs().locale('zh-cn').from(value)
}

// 定义 延时加载函数
const sleep = () => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, 2500)
  })
}
// 全局注册
export default {
  install (Vue) {
    // 扩展原有的功能（插件）
    Vue.prototype.$sleep = sleep
    Vue.filter('relTime', relTime)
  }
}
