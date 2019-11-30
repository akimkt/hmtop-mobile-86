module.exports = {
  plugins: {
    'autoprefixer': {
      // 我们采用.browserslistrc文件中的，设置，不用下面的浏览器适配设置
      // browsers: ['Android >= 4.0', 'iOS >= 7']
    },
    'postcss-pxtorem': {
      // 以宽度为375px的iphone6为基准
      rootValue: 37.5,
      propList: ['*'] // 属性的选择器，*表示通用

      // selectorBlackList:[]    忽略的选择器
    }
  }
}
