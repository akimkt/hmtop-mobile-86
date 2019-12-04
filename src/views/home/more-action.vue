<template>
<div>
    <!-- popup是弹出层
    value值是 父组件传过来的值控制当前组件的开启和关闭,
    input既可以监听close，又可以监听open，当关闭时，触发父组件的input事件，并传递当前的
    @open 打开弹出层时触发的代码，可以是钩子函数或表达式
    这里通过打开弹出层修改isReport的值，popup去显示或者隐藏内部的指定盒子 -->
<van-popup :value="value" @open="isReport=false" @input="$emit('input',$event)">
    <van-cell-group v-if="!isReport">
      <van-cell>不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell>侵权</van-cell>
      <van-cell>色情</van-cell>
      <van-cell>暴力</van-cell>
      <van-cell>低俗</van-cell>
      <van-cell>不适</van-cell>
      <van-cell>错误</van-cell>
      <van-cell>其他</van-cell>
    </van-cell-group>
  </van-popup>
</div>
</template>

<script>

export default {
  name: 'more-action',
  props: {
    // 接收父组件的value值并根据值的变化显示和隐藏当前组件
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: true,
      isReport: false
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
