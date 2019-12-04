<template>
  <div id="app">
    <keep-alive>
      <!-- 如果组件中有路由元信息并且有iskeepAlive属性，且值为true 包裹-->
    <router-view v-if="$route.meta.iskeepAlive"></router-view>
    </keep-alive>
    <!-- 如果组件中没路由元信息并且有iskeepAlive属性，不包裹 -->
    <router-view v-if="!$route.meta.iskeepAlive"></router-view>
  </div>
</template>
<script>

export default {

}
</script>
<style lang='less' scoped>

</style>
