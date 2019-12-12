<template>
  <div  class='container' @scroll="remember($event)" ref="container">
        <van-nav-bar fixed :title="detail.title" left-arrow @click-left="$router.back()" />
        <div class="detail">
          <h3 class="title">{{detail.title}}</h3>
          <div class="author">
            <van-image round width="1rem" height="1rem" fit="fill" :src="detail.aut_photo" />
            <div class="text">
              <p class="name">{{detail.aut_name}}</p>
              <p class="time">{{detail.pubdate | relTime}}</p>
            </div>
            <van-button round size="small" type="info" @click="toggleFollowed">{{detail.is_followed ? '已关注' : '+ 关注' }}</van-button>
          </div>
          <div class="content">
            <p v-html="detail.content"></p>
          </div>
          <div class="zan">
            <van-button round size="small" :class="{active:detail.attitude===1}" plain icon="like-o" @click="likeOrUnlike(1)" >点赞</van-button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <van-button round size="small" plain icon="delete" :class="{active:detail.attitude===0}" @click="likeOrUnlike(0)">不喜欢</van-button>
          </div>
          <comment></comment>
        </div>
  </div>
</template>

<script>
import { getArticle, likings, unLikings, unDislikes, disLikeArticle } from '@/api/article'
import { follow, unfollow } from '@/api/user'
//
import Comment from './comment'
export default {
  name: 'index-article',
  components: {
    Comment
  },
  data () {
    return {
      detail: {
        art_id: 0, // 文章id
        aut_id: 0, // 作者id
        aut_name: '', // 作者姓名
        aut_photo: '', // 作者头像
        content: '', // 内容
        pubdate: '', // 发布日期
        is_collected: false, // 是否收藏文章
        is_followed: false, // 是否关注作者
        title: '', // 文章标题
        attitude: -1 // 状态用户对文章的态度
      },
      scrollTop: 0// 卷起高度
    }
  },
  // 因为有组件缓存，所以在组件激活时，
  activated () {
    // 如果阅读的文章和之前的文章不一样
    if (this.$route.params.id !== this.detail.art_id.toString()) {
      // 重置阅读位置加载文章
      this.scrollTop = 0
      this.getArticle()
    } else { // 如果阅读的是同一篇 滚动到记忆高度
      this.$refs.container.scrollTop = this.scrollTop
    }

    this.$refs['container'].scrollTop = this.scrollTop
  },
  methods: {
    // 记忆阅读位置
    remember (e) {
      this.scrollTop = e.target.scrollTop
    },
    // 获取文章详情页
    async getArticle () {
      const data = await getArticle(this.$route.params.id)
      this.detail = data
    },
    // 关注和取消关注
    async toggleFollowed () {
      try {
        // 如果已关注，就取消关注，如果未关注，就进行关注
        if (this.detail.is_followed) {
          await unfollow(this.detail.aut_id)
        } else {
          await follow(this.detail.aut_id)
        }
        this.detail.is_followed = !this.detail.is_followed
      } catch (e) {
        this.$toast.fail('操作失败')
      }
    },
    async likeOrUnlike (type) {
      try {
        if (type) {
          // 如果是点击的点赞
          if (this.detail.attitude === 1) {
            await unLikings(this.detail.art_id)
            this.detail.attitude = -1
          } else {
            await likings(this.detail.art_id)
            this.detail.attitude = 1
          }
        // 如果点击的是不喜欢
        } else {
        // 如果现在是不喜欢状态,点击取消不喜欢
          if (this.detail.attitude === 0) {
            await unDislikes(this.detail.art_id)
            this.detail.attitude = -1
          // 如果现在是喜欢状态，点击提交不喜欢
          } else {
            await disLikeArticle(this.detail.art_id)
            this.detail.attitude = 0
          }
        }
        this.$toast.success('操作成功')
      } catch (e) {
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  // 内容中包含：img 特别宽  code pre 不能换行
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
    /deep/ pre{
      white-space: pre-wrap;
    }
  }
}
</style>
