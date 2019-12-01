<template>
  <div class="page-user-chat">
    <van-nav-bar left-arrow
                 @click-left="$router.back()"
                 title="登录"></van-nav-bar>
    <van-cell-group>
      <van-field v-model="loginForm.mobile"
                 center
                 clearable
                 placeholder="请填写手机号"
                 :error-message="errMsg.mobile"
                 label="手机号码"
                 @blur="checkmobile"></van-field>
      <van-field v-model="loginForm.code"
                 placeholder="请填写验证码"
                  :error-message="errMsg.code"
                 label="验证码"
                 @blur="checkcode">
        <van-button slot="button"
                    size="small"
                    type="primary">发送验证码</van-button>
      </van-field>

    </van-cell-group>
    <van-button type="info" @click="userLogin" block round>登 录</van-button>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'user-chat',
  data () {
    return {
      // 对象形式双向绑定输入的手机号和验证码
      loginForm: {
        mobile: '13552399047',
        code: '246810'
      },
      // 验证手机号和验证码
      errMsg: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    checkmobile () {
      // 当输入框失去焦点，执行判断手机号
      if (!this.loginForm.mobile.trim()) {
        this.errMsg.mobile = '手机号码不能为空'
        // 返回给提交时判断
        return false
        // 如果正则匹配，输入的手机号不符合条件
        // \d 匹配数字 {9}必须且只能重复9次
      } else if (!(/^1[3-9]\d{9}$/).test(this.loginForm.mobile)) {
        this.errMsg.mobile = '手机号码格式错误'
        return false
      }
      this.errMsg.mobile = ''
    },
    checkcode () {
      // 当输入框失去焦点，执行判断验证码
      if (!this.loginForm.code.trim()) {
        this.errMsg.code = '验证码不能为空'
        // 返回给提交时判断
        return false
        // 如果正则匹配，输入的手机号不符合条件
        // \d 匹配数字 {9}必须且只能重复9次
      } else if (!(/^\d{6}$/).test(this.loginForm.code)) {
        this.errMsg.code = '验证码错误'
        return false
      }
      this.errMsg.code = ''
    },
    ...mapMutations(['setToken']),
    async userLogin () {
      // 点击登录后执行校验
      this.checkmobile()
      this.checkcode()
      // 如果两个都为空(取反为真)发送登录请求（调用封装好的api）
      if (!this.errMsg.mobile && !this.errMsg.code) {
        // 发送登录请求
        try {
          const data = await login(this.loginForm)
          this.setToken(data)
          // 跳转到login之前的路由地址this.$route.query.redirectUrl是在响应拦截中获取的
          // 如果没有之前的路由地址，就进入用户中心

          this.$router.push(this.$route.query.redirectUrl || '/user')
          // 提示登录成功，用的是vant自带的提示
          this.$toast.success('登录成功')
        } catch (e) {
          // 失败时什么都不做
          this.$toast.fail('用户名或验证码错误')
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
.page-user-chat{
  margin: 0 auto;
    .van-cell-group{
      .van-field{
        margin-top: 20px;

        /deep/
        .van-field__control{
          border-radius: 5px;
          height: 36px;
          background-color: #eee;
        }
      }
    }
  &>.van-button{
    margin: 0 auto;
    text-align: center;
    max-width: 80%;
    width:280px;
  }
}

</style>
