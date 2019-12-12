<template>
<div class="container">
<!-- @closed="editing=false" 关闭屉式菜单  重置编辑状态为不编辑 -->
<van-action-sheet :value="value" @closed="editing=false"
                  @input="$emit('input', $event)" title="编辑频道">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true"
                    size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false"
                    size="mini" type="danger"  plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,i) in channelList" :key="item.id">
          <span class="f12" :class="{red:activeIndex===i}" @click="goback(i)">{{item.name}}</span>
          <van-icon v-show="editing && i!=0" class="btn" name="cross" @click="delMyChannel(item.id,i)" ></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optiongChannelList" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon class="btn" name="plus" @click="addMyChannel(item)"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</div>
</template>

<script>
import { getAllChannel, addMyChannel, delMyChannel } from '@/api/channel'
export default {
  name: 'channel-edit',
  props: {
    channelList: {
      type: Array,
      default: () => []
    },
    value: {
      type: Boolean,
      default: false
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      editing: false,
      allChannels: []
    }
  },
  computed: {
    // 获取可选频道
    optiongChannelList () {
      // 过滤全部频道数据，每次遍历查找成员的id在我的频道里是否存在，不存在返回值为-1，就是可选的
      return this.allChannels.filter(item => this.channelList.findIndex(myItem => item.id === myItem.id) === -1)
    }
  },
  methods: {
    // 增
    async addMyChannel (thisChannel) {
      // 映射我的频道列表增加seq属性
      const orderChannels = this.channelList.map((item, i) => {
        return {
          id: item.id,
          name: item.name,
          seq: i
        }
      })
      // 将要添加的频道追加到数组中
      orderChannels.push({
        ...thisChannel,
        seq: orderChannels.length
      })
      // 删除第一条 ：推荐频道对应的数据
      orderChannels.shift()
      try {
        // 发送请求添加我的频道
        await addMyChannel(orderChannels)

        // 当前界面
        this.channelList.push({
          id: thisChannel.id,
          name: thisChannel.name,
          articleList: [],
          upLoading: false,
          downLoading: false,
          finished: false,
          scrollTop: 0,
          finishedText: '',
          timestamp: Date.now()
        })
        this.$toast.success('添加成功')
      } catch (e) {
        this.$toast.fail('添加失败')
      }
    },
    // 删
    async delMyChannel (thisChannelId, index) {
      try {
        // 掉接口，进行目标频道删除
        await delMyChannel(thisChannelId)
        // 删除成功，视图删除
        this.channelList.splice(index, 1)
        // 如果删除的频道索引小于当前激活频道，当前激活频道的索引减小一位
        // 如果删除的频道索引等于当前激活频道，原有激活频道删除，当前激活频道的索引减小一位
        // 通知父组件更改激活频道，此处用到了sync修饰符
        this.$emit('update', ((this.activeIndex) - 1))
        this.$toast.success('删除成功')
      } catch (e) {
        this.$toast.fail('删除失败')
      }
    },
    // 查
    async getAllChannelsList () {
      try {
        const { channels: data } = await getAllChannel()
        this.allChannels = data
      } catch (e) {
      }
    },
    goback (index) {
      // 点击关闭频道管理回到频道列表
      this.$emit('input', false)
      // 激活父组件的自定义事件，切换至被点击的频道列表
      this.$emit('update:activeIndex', index)
    }
  },
  created () {
    this.getAllChannelsList()
  }
}
</script>
<style lang='less' scoped>
.van-popup--bottom{
  &.van-popup--round{
    border-radius: 0;
  }
}
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.channel {
  padding: 10px;
  .tit{
    line-height: 3;
    .tip {
      font-size: 10px;
      color: #999;
    }
  }
  .van-button {
    float: right;
    margin-top: 7px;
  }
  .btn{
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12{
      font-size:12px;
      color: #555;
  }
  .red{
    color: red;
  }
}
</style>
