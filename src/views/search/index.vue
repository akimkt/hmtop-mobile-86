<template>
  <div class="container">
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <van-search
    v-model="value"
    placeholder="请输入搜索关键词"
    @search="onSearch"
  />
    <div class="history-box" v-show="!value.length && historyList.length">
      <div class="head">
        <span>历史记录</span>
        <van-icon name="delete" @click="clearSearchHistory"></van-icon>
      </div>
      <van-cell-group>
        <van-cell v-for="item in historyList" :key="item">
          <a class="word_btn" @click="onSearch(item)">{{item}}</a>
          <van-icon class="close_btn" slot="right-icon" name="cross" @click="delSearchHistory(item)"/>
        </van-cell>
      </van-cell-group>
    </div>
    <van-cell-group class="suggest-box" v-if="value.length">
      <van-cell icon="search" v-for="item in suggestList" :key="item"><p v-html="item"  @click="onSearch(item.replace(`<span>${value}</span>`,value))"></p></van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { getSearchHistory, setSearchHistory, clearSearchHistory, delSearchHistory, suggest } from '@/api/article'
export default {
  name: 'search-index',
  data () {
    return {
      value: '',
      historyList: [],
      suggestList: [],
      timer: null
    }
  },
  created () {
    this.getSearchHistory()
  },
  watch: {
    value () {
      // 如果输入的内容为空,不发请求
      if (!this.value.trim()) {
        // 清除延迟定时器结束监听
        window.clearTimeout(this.timer)
        return false
      }
      // 每次监听到value变化就先清空计时器，然后重新计时
      window.clearTimeout(this.timer)
      // 在500毫秒内value保持不变，
      this.timer = window.setTimeout(async () => {
        try {
          // 联想词条
          const res = await suggest(this.value)
          // 获取联想的数组，映射一个给关键字加span的数组，为了避免服务器返回的字符串有大写字母转换成小写
          this.suggestList = res.options.map(item => item.toLowerCase().replace(this.value, `<span>${this.value}</span>`))
        } catch (e) {
          throw e
        }
      }, 500)
    }
  },
  methods: {

    // 获取搜素历史列表
    async getSearchHistory () {
      const data = await getSearchHistory()
      this.historyList = data
    },
    // 确认搜索时添加关键词到搜索历史并跳转搜素结果页
    async onSearch (key) {
      if (!key.trim()) return false
      try {
        await setSearchHistory(key)
        this.$router.push({ path: '/search/result', query: { keyWord: key } })
      } catch (e) {
      }
    },
    // 删除单个搜索历史
    async delSearchHistory (keyWord) {
      try {
        const data = await delSearchHistory(keyWord)
        this.historyList = data
        this.$toast.success('删除成功')
      } catch (e) {
        this.$toast('删除失败')
      }
    },
    // 清空搜素历史
    async clearSearchHistory () {
      try {
        await clearSearchHistory()
        this.historyList = []
        this.$toast.success('清除成功')
      } catch (e) {
        this.$toast('清除失败')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
