<template>
  <div class='container'>
    <!--
        lazy-render关闭自动延迟加载，方便DOM获取后得到对应的scrollTop数据
      当前激活的标签改变时触发change事件
    -->
    <van-tabs swipeable
              v-model="activeIndex"
              :lazy-render="false"
              @change="channelChange">
      <!-- 遍历频道列表获取频道列表数据，展示 -->
      <van-tab :key="channel.id.toString()"
               v-for="channel in channelList"
               :title="channel.name">
        <div ref="scroll-wrapper"
             class="scroll-wrapper"
             @scroll="remember($event)">
          <!-- 下拉刷新功能 -->
          <van-pull-refresh v-model="channel.downLoading"
                            @refresh="onRefresh"
                            :success-text="channel.refreshSuccessText">
            <!-- 每个频道van-tab标签对应一组列表van-list
                  van-list的v-model 值upLoading为true表示加载进行中，为false时加载完毕
                  :finished全部数据加载完，没有可加载的数据时，true,如果还有数据就设置为false
                  finished-text="加载完成时的提示文字"
               -->
            <!-- 上拉加载更多内容 触发onLoad事件-->
            <van-list v-model="channel.upLoading"
                      :finished="channel.finished"
                      :finished-text="channel.finishedText"
                      @load="onLoad">
              <!-- 列表van-list中的单元van-cell
                      van-cell可以单用，也可以配合van-cell-group，van-cell-group可提供外框
                   -->
              <van-cell-group>
                <!-- // 遍历对应频道列表中的文章列表，展示 -->
                <van-cell v-for="item in channel.articleList"
                          :key="item.art_id.toString()">
                  <div class="article_item">
                    <h3 class="van-ellipsis">{{item.title}}</h3>
                    <div class="img_box"
                         v-if="item.cover.type===3">
                      <van-image class="w33"
                                 fit="cover"
                                 :src="item.cover.images[0]"
                                 lazy-load />
                      <van-image class="w33"
                                 fit="cover"
                                 :src="item.cover.images[1]"
                                 lazy-load />
                      <van-image class="w33"
                                 fit="cover"
                                 :src="item.cover.images[2]"
                                 lazy-load />
                    </div>
                    <div class="img_box"
                         v-if="item.cover.type===1">
                      <van-image class="w100"
                                 fit="cover"
                                 :src="item.cover.images[0]"
                                 lazy-load />
                    </div>
                    <div class="info_box">
                      <span>{{item.aut_name}}</span>
                      <span>{{item.comm_count}}评论</span>
                      <span>{{item.pubdate | relTime}}</span>
                      <!-- 点击弹出more-action组件 需要传值，修改 子组件 的显示和隐藏 -->
                      <span v-if="UserToken.token"
                            class="close"
                            @click="showMoreAction=!showMoreAction"
                            >
                        <van-icon name="cross"></van-icon>
                      </span>
                    </div>
                  </div>
                </van-cell>
              </van-cell-group>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <span class="bar_btn"
          slot="nav-right">
      <van-icon name="wap-nav"></van-icon>
    </span>
      <!-- 如果用户登录了才加载此组件
        在首页自定义value属性传值给子组件，决定子组件显示和隐藏
        给子组件定义方法input
       -->
    <!-- <more-action v-if="UserToken.token" :value="showMoreAction" @input="showMoreAction=$event"></more-action>
      因为，父给子传的值和子给父传的值是同一个值，所以可以简写成如下：
    -->
    <more-action v-if="UserToken.token" v-model="showMoreAction"></more-action>
  </div>
</template>

<script>
import { getMyChannel } from '@/api/channel'
import { getUserArticles } from '@/api/article'
import { mapState } from 'vuex'
import MoreAction from './more-action'
export default {
  name: 'home-index',
  components: {
    MoreAction
  },
  data () {
    return {
      activeIndex: 0,
      // 刷新完成提示文字
      refreshSuccessText: '',
      channelList: [],
      showMoreAction: false
    }
  },
  computed: {
    // 当前激活的频道列表
    activeChannel () {
      return this.channelList[this.activeIndex]
    },
    ...mapState(['UserToken'])
  },
  // 缓存组件keep-alive ，会触发 组件激活时执行的钩子activated
  activated () {
    // 如果能在组件切换激活时获取到目标dom元素，说明当前频道有缓存记录
    if (this.$refs['scroll-wrapper']) {
      // 给当前激活组件的文章列表卷起高度 赋值记忆的阅读位置
      const dom = this.$refs['scroll-wrapper'][this.activeIndex]
      dom.scrollTop = this.activeChannel.scrollTop
    }
  },
  watch: {
    // 监听token的变化
    'userToken.refresh': function () {
      this.activeIndex = 0
      this.getMyChannelList()
      this.onLoad()
    }
  },
  methods: {
    // 加载文章列表
    async onLoad () {
      // 显示加载中
      this.loading = true
      if (!this.activeChannel) return false
      try {
        await this.$sleep()
        //  发送请求，获取指定栏目的指定时间后的部分文章列表
        let res = await getUserArticles(
          this.activeChannel.id,
          this.activeChannel.timestamp
        )
        // 将获取的文章列表追加到当前激活的频道数据文章列表中容器中
        this.activeChannel.articleList.push(...res.results)
        // 并设置加载中为false
        this.activeChannel.upLoading = false
        // 如果获取到的文章列表中有时间戳数据，说明还有数据
        if (res.pre_timestamp) {
          // 将获取到的时间戳存入 当前频道列表方便上拉加载使用
          this.activeChannel.timestamp = res.pre_timestamp
        } else {
          // 如果没有时间戳说明没有更多数据了
          this.activeChannel.finished = true
          this.activeChannel.finishedText = '没有更多文章了'
        }
      } catch (e) {
        return e
      }
    },
    // 加载频道列表
    async getMyChannelList () {
      await this.$sleep()
      let data = await getMyChannel()
      this.channelList = []
      this.$nextTick(() => {
        this.channelList = data.channels.map(item => {
          return {
            id: item.id,
            name: item.name,
            articleList: [],
            upLoading: false,
            downLoading: false,
            finished: false,
            // 声明变量用以存储阅读位置
            scrollTop: 0,
            finishedText: '',
            // 设置默认时间戳，默认为最新时间的文章列表
            timestamp: Date.now()
          }
        })
      })
    },
    // 刷新事件 由于后端接口原因，只能重新请求刷新数据来实现，模拟请求文章列表
    async onRefresh () {
      this.activeChannel.downLoading = true
      this.activeChannel.timestamp = Date.now()
      await this.$sleep()
      const data = await getUserArticles(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      // 如果有请求到数据
      if (data.results.length) {
        this.activeChannel.articles = data.results
        this.activeChannel.downLoading = false
        this.refreshSuccessText = '更新成功'
        // 记录时间戳 下一次请求数据想需要
        this.activeChannel.timestamp = data.pre_timestamp
        this.activeChannel.finished = false
        // 防止不满一屏  主动去加载一次数据
        this.onLoad()
      } else {
        // 否则就提示暂无更新
        this.activeChannel.downLoading = false
        this.refreshSuccessText = '暂无更新'
      }
    },
    // 当切换频道时的钩子函数
    channelChange () {
      // 如果当前频道的文章列表中没有数据
      if (!this.activeChannel.articleList) {
        // 请求当前频道的文章列表数据
        this.activeChannel.upLoading = true
        this.activeChannel.finished = false
        this.onLoad()
      } else {
        // 否则说明
        this.$nextTick(() => {
          const dom = this.$refs['scroll-wrapper'][this.activeIndex]
          dom.scrollTop = this.activeChannel.scrollTop
        })
      }
    },
    // dom滚动的高度
    remember (e) {
      this.activeChannel.scrollTop = e.target.scrollTop
    }
  },
  created () {
    // this.onLoad()
    this.getMyChannelList()
  }
}
</script>

<style scoped lang='less'>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
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
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}

</style>
