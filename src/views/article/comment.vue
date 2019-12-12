<template>
  <div class="comment">
    <!-- 评论列表 -->
    <van-list v-model="loading"
              :finished="finished"
              finished-text="没有更多了" @load="getCommentsOrReply" :immediate-check="false">
      <div class="item van-hairline--bottom van-hairline--top"
           v-for="item in comments" :v-if="comments.length"  :key="item.com_id.toString()">
        <van-image round
                   width="1rem"
                   height="1rem"
                   fit="fill"
                   :src="item.aut_photo" />
        <div class="info">
          <p>
            <span class="name">{{item.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{item.reply_count}}</span>
            </span>
          </p>
          <p>{{item.content}}</p>
          <p>
            <span class="time">{{item.pubdate |relTime}}</span>&nbsp;
            <van-tag plain
                     @click="clickReply(item.com_id.toString())">{{item.reply_count}}回复</van-tag>
          </p>
        </div>
      </div>
      <!-- 底部输入框 -->
      <div class="reply-container van-hairline--top">
        <van-field v-model.trim="value"
                   :placeholder="show ? '写回复':'写评论'">
          <van-loading v-if="submiting"
                       slot="button"
                       type="spinner"
                       size="16px">
          </van-loading>
          <span class="submit"
                v-else
                slot="button" @click="submit">提交</span>
        </van-field>
      </div>
    </van-list>
    <!-- 回复列表 -->
    <van-action-sheet v-model="show" title="回复评论" :round="false" close-icon="close">
    <van-list
    v-model="reply.loading"
    :finished="reply.finished"
    finished-text="没有更多了"
    @load="getReplys()" :immediate-check="false"
  >
    <van-cell v-for="item in reply.list" :key="item.com_id.toString()">
            <van-image round
                   width="1rem"
                   height="1rem"
                   fit="fill"
                   :src="item.aut_photo" />
        <div class="info">
          <p style="color:blue">{{item.aut_name}}</p>
          <p  style="float:right" class="van-icon van-icon-good-job-o zan"></p>
          <p>{{item.content}}</p>
          <p>{{item.pubdate |relTime}}</p>
        </div>
    </van-cell>
  </van-list>
</van-action-sheet>
  </div>
</template>

<script>
import { getCommentsOrReply, addCommentsOrReply } from '@/api/article'
export default {
  name: 'comment',
  data () {
    return {
      loading: false, // 加载中
      finished: false, // 加载完成
      last_id: null,
      comments: [],
      reply: {
        loading: false, // 回复加载中
        finished: false, // 回复加载完了
        last_id: null,
        list: []
      },
      value: '', // 要提交的文字
      submiting: false,
      show: false, // 上拉框的显示和隐藏
      commentId: null, // 点击的评论id
      aId: this.$route.params.id
    }
  },
  activated () {
  // 激活组件的时候清空评论，开启加载效果，重置finished为false
    this.comments = []
    this.last_id = null
    this.loading = true
    this.finished = false
    // 获取评论
    this.getCommentsOrReply()
  },
  methods: {
    // 获取评论列表
    async getCommentsOrReply () {
      this.$sleep()
      try {
        const data = await getCommentsOrReply('a', this.aId, this.last_id)
        this.comments.push(...data.results)
        this.loading = false// 关闭加载
        // 如果最后一条评论的id大于截至id值 ，说明还有数据
        if (data.last_id > data.end_id) {
          this.last_id = data.last_id
        } else {
          this.finished = true
        }
      } catch (e) {
        throw e
      }
    },
    // 点击某条评论的回复位置，获取当前评论id的回复列表
    clickReply (commentId) {
      this.show = true// 显示回复框
      this.commentId = commentId // 存储当前评论id
      this.reply.list = [] // 清空之前的回复列表数据
      this.finished = false // 加载完成设为false
      this.loading = true // 加载中
      this.reply.last_id = null // 初始加载lastId为空
      this.getReplys() // 加载回复列表
    },
    // 加载回复函数
    async getReplys () {
      try {
        // 发送请求获取指定id评论的回复
        const data = await getCommentsOrReply('c', this.commentId)
        this.reply.list.push(...data.results)
        this.reply.loading = false// 关闭加载中
        // 如果最后一条回复的id大于截至id值 ，说明还有数据
        if (data.last_id > data.end_id) {
          this.reply.last_id = data.last_id
        } else {
          this.reply.finished = true
        }
      } catch (e) {
        throw e
      }
    },
    // 点击提交按钮,如果内容不为空
    async submit () {
      if (this.value) {
        // 开启提交中状态
        this.submiting = true
        try { // 如果上拉框关闭，则为文章添加评论
          if (!this.show) {
            const data = await addCommentsOrReply(this.aId, this.value)
            this.comments.unshift(data.new_obj)
          } else { // 否则为评论添加回复
            const data = await addCommentsOrReply(this.commentId, this.value, this.aId)
            this.reply.list.unshift(data.new_obj)
            // 获取当前点击的评论id在评论列表中的索引值，对应的自增1
            this.comments[this.comments.findIndex(item => { return item.com_id.toString() === this.commentId })].reply_count++// 评论的回复个数自增1
          }
          this.$toast.success('提交成功')// 提示成功
          this.value = ''// 清空输入框
        } catch (e) {
          this.$toast.fail(e)
        }
        this.submiting = false
      }
    }
  }

}
</script>
<style lang='less' scoped>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    align-items: center;
    .info {
      flex: 1;
      padding-left: 10px;
      .name {
        color: #069;
      }
      .zan {
        vertical-align: middle;
        padding-right: 2px;
      }
      .count {
        vertical-align: middle;
        font-size: 10px;
        color: #666;
      }
      .time {
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }

}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
  /deep/ .van-action-sheet{
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
    .van-list{
      .van-cell{
        /deep/ .van-cell__value{
        display: flex;
        align-items: center;
        .info{
          padding-left: 20px;
          flex: 1;
        }
        }

      }
    }
  }
</style>
