<template>
<div>
    <!-- popup是弹出层
    value值是 父组件传过来的值控制当前组件的开启和关闭,
    input既可以监听close，又可以监听open，当关闭时，触发父组件的input事件，并传递当前的
    @open 打开弹出层时触发的代码，可以是钩子函数或表达式
    这里通过打开弹出层修改isReport的值，popup去显示或者隐藏内部的指定盒子 -->
<van-popup :value="value" @open="isReport=false" @input="$emit('input',$event)">
    <van-cell-group v-if="!isReport">
      <van-cell @click="delArticle">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell v-for="item in reports" :key="item.value" @click="reportArticle(item.value)">{{item.label}}</van-cell>
    </van-cell-group>
  </van-popup>
</div>
</template>

<script>
// import request from '@/utils/request'
import { disLikeArticle, report } from '@/api/article'
import { reports } from '@/api/constants'
export default {
  name: 'more-action',
  props: {
    // 接收父组件的value值并根据值的变化显示和隐藏当前组件
    value: {
      type: Boolean,
      default: false
    },
    clickId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      show: true,
      isReport: false,
      reports
    }
  },
  methods: {
    async delArticle () {
      try {
        await disLikeArticle(this.clickId)
        this.$emit('input', false)
        this.$emit('dislikeThis')
        this.$toast.success('删除成功')
      } catch (e) {
        this.$toast.fail('删除失败')
      }
    },
    async reportArticle (type) {
      try {
        await report(this.clickId, type)
        this.$toast({ type: 'success', message: '举报成功' })
        this.$emit('input', false)
        this.$emit('reportThis')
      } catch (e) {
        this.$toast.fail('举报失败')
      }
    }
  }
}
</script>
<style lang='less' scoped>
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
