module.exports = {
  // 代理服务器，临时解决跨域问题
  devServer: {
    open: true
    // proxy: 'http://ttapi.research.itcast.cn'
  },
  // 覆盖蓝色主题
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          blue: '#3296fa'
        }
      }
    }
  }

}
