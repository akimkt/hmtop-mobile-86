<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref="list">
        <!--
          遍历消息列表插入页面中
          小智的消息就用类名left，自己发的就用right -->
      <div class="chat-item" :class="{left:item.name==='xz',right:item.name==='self'}" v-for="(item,i) in list" :key="i">
        <!-- 如果是小智发的消息，显示此头像标签 -->
        <van-image fit="cover" round :src="xzPhoto" v-if="item.name==='xz'" />
        <div class="chat-pao">{{item.msg}}</div>
        <!-- 如果是自己发的消息，显示此头像标签 -->
        <van-image fit="cover" round :src="userInfo.photo" v-if="item.name==='self'" />
      </div>
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么..." @keyup.enter="send()">
        <span @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import xzPhoto from '@/assets/xz.png'
export default {
  name: 'user-chat',
  data () {
    return {
      value: '',
      xzPhoto,
      userInfo: null,
      list: [], // 约定聊天记录{name:'xz',msg:'',timestamp:new Date()}
      socketIO: null// 为了方便全局使用声明在data中
    }
  },
  async created () {
    // 取出vuex中存储的用户名和用户头像信息
    this.userInfo = await this.$store.state.userInfo
    // 初始化的时候连接服务器
    this.socketIO = io('http://ttapi.research.itcast.cn', {
      token: this.$store.state.UserToken.token// 需要携带token
    })
    // 连接成功主动打招呼
    this.socketIO.on('connect', () => {
      this.list.push({ name: 'xz', msg: '您好，很高兴为您服务！' })
    })
    // 用以接收服务端消息的事件方法
    this.socketIO.on('message', data => {
      this.list.push({ name: 'xz', msg: data.msg, timestamp: new Date() })
      this.scrollBottom()//  // 优化体验，每次收发消息 成功后再滚动 向下滚动到可滚动的高度
    })
  },
  methods: {
    send () {
      if (this.value) {
        // 发送请求给服务器
        this.socketIO.emit('message', { msg: this.value, timestamp: Date.now() })
        this.list.push({ name: 'self', msg: this.value, timestamp: new Date() })
        this.scrollBottom()
        this.value = ''
      }
    },
    scrollBottom () {
      this.$nextTick(() => {
        // list可滚动的高度scrollHeight赋值给当前滚动高度
        this.$refs.list.scrollTop = this.$refs.list.scrollHeight
      })
    }
  },
  // 结束通讯在实例销毁前（关闭对话窗口）
  beforeDestroy () {
    this.socketIO.close()
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
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
}
</style>
