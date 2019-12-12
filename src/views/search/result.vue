<template>
  <div class="container">
    <!-- 导航固定定位 fixed -->
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
    <!-- 文章列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了"  @load="onLoad">
      <van-cell-group>
        <van-cell v-for="item in articleList" :key="item.art_id.toString()" :to="{name:'article', params:{id:item.art_id.toString()}}" >
          <div class="article_item">
            <h3 class="van-ellipsis">{{item.title}}</h3>
            <div class="img_box" v-if="item.cover.type===3">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box" v-if="item.cover.type===1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <span>{{item.pubdate | relTime}}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import { getSearchList } from '@/api/article'
export default {
  name: 'result',
  data () {
    return {
      loading: false,
      finished: false,
      articleList: [],
      reqParams: {
        page: 1,
        perPage: 10,
        keyWord: this.$route.query.keyWord
      }
    }
  },
  methods: {
    async onLoad () {
      // 如果没有获取到要搜索的内容，则不搜索
      if (!this.reqParams.keyWord) return false
      // 开启加载中
      this.loading = true
      try {
        // 发请求获取搜索列表
        const data = await getSearchList({ ...this.reqParams })
        // 将获取的文章列表添加到数组中数据驱动视图渲染页面
        this.articleList.push(...data.results)
        // 结束加载中状态
        this.loading = false
        // 如果还有数据，就翻页，页码自增1，方便下次发送请求获取数据
        if (data.results.length) {
          this.reqParams.page++
        } else { // 如果没有数据了，滚动不再触发请求
          this.finished = true
          this.finishedText = '没找到您想要的，换个词找找吧'
        }
      } catch (e) {
        this.$toast.fail('没有找到你想要的')
      }
    }
  }
}
</script>
<style lang='less' scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
