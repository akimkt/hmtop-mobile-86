<template>
  <div class="page-user-profile">
    <van-nav-bar left-arrow
                 @click-left="$router.back()"
                 title="编辑资料"
                 right-text="保存"
                 @click-right="save()"></van-nav-bar>
    <van-cell-group>
      <van-cell title="头像"
                is-link
                @click="showPhoto=true">
        <van-image slot="default"
                   width="1.5rem"
                   height="1.5rem"
                   fit="cover"
                   round
                   :src="photo" />
      </van-cell>
      <van-cell title="用户名"
                is-link
                :value="userInfo.name"
                @click="showName=true" />
      <van-cell title="性别"
                is-link
                :value="thisGender"
                @click="showGender=true" />
      <van-cell title="生日"
      @click="openDate()"
                is-link
                :value="userInfo.birthday" />
    </van-cell-group>
    <!-- 选择用户名 -->
    <van-popup v-model="showName"
               position="bottom"
               :style="{ height: '20%' }">
      <van-field v-model="userInfo.name"
                 placeholder="请输入用户名"
                 :border="true" />
    </van-popup>
    <!-- 选择性别 -->
    <van-action-sheet v-model="showGender"
                      :actions="gender"
                      @select="onSelect" />
    <!-- 选择生日 -->
    <van-popup v-model="showBirthday"
               position="bottom"
               :style="{ height: '40%' }">
      <van-datetime-picker v-model="nowDate"
                           type="date"
                           :min-date="minDate"
                           @confirm="dateSure"
                           @cancel="showBirthday=false"/>
    </van-popup>
    <div class="photoType">
    <van-popup v-model="showPhoto" position="bottom">
      <van-cell title="本地相册选择" @click="$refs.inputFile.click()" is-link/>
      <input type="file"  style="display:none"  ref="inputFile" @change="selectPhoto"/>
      <van-cell title="拍照" is-link/>
    </van-popup>
    </div>
  </div>
</template>

<script>
import { getUserInfo, editUserInfo, editUserPhoto } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'user-profile',
  data () {
    return {
      showName: false, // 弹出用户名编辑
      showGender: false, // 弹出性别选择
      showBirthday: false, // 弹出生日控件
      showPhoto: false, // 弹出图片上传框
      userInfo: {
        name: '',
        birthday: '1990-01-01',
        gender: 0
      },
      photo: null,
      file: '',
      minDate: new Date('1949-10-01'),
      maxDate: new Date(),
      nowDate: new Date(),
      gender: [{ name: '男', id: 0 }, { name: '女', id: 1 }]
    }
  },
  created () {
    this.getUserInfo()
  },
  computed: {
    thisGender () {
      return this.userInfo.gender === 0 ? '男' : '女'
    }
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      const data = await getUserInfo()
      this.userInfo = data
      this.photo = data.photo
    },
    // 选择性别后 关闭弹出框，赋值给用户性别
    onSelect ({ id }) {
      this.showGender = false
      this.userInfo.gender = id
    },
    // 点击打开日期选择窗口
    openDate () {
      // 如果之前设置过生日要把之前的生日显示出来
      if (this.userInfo.birthday) {
        this.nowDate = dayjs(this.userInfo.birthday).format('YYY-MM-DD')
      }
      // 显示生日框
      this.showBirthday = true
    },
    // 点击确认 选择日期
    dateSure (sDate) {
      this.userInfo.birthday = dayjs(sDate).format('YYYY-MM-DD')
      this.showBirthday = false
    },
    // 选择图片被文件域检测到后
    selectPhoto () {
      try {
      // 方式2

        this.file = this.$refs.inputFile.files[0]
        const fileReader = new FileReader()
        fileReader.readAsDataURL(this.file)
        // onload是读取文件成功后
        fileReader.onload = () => {
          this.photo = fileReader.result
          this.showPhoto = false
        }
      } catch (e) {
        throw e
      }
    },
    async editUserPhoto () {
      await editUserPhoto(this.$refs.inputFile.files[0])
    },
    async editUserInfo () {
      await editUserInfo(this.userInfo)
    },
    save () {
    // 点击保存，分别上传头像和修改个人资料
      try {
        // 如果选择过头像图片则发送修改头像请求
        if (this.file) {
          this.editUserPhoto()
        }
        this.editUserInfo()
        this.$toast.success('保存成功')
      } catch (e) {
        this.$toast.fail('保存失败')
        throw e
      }
    }
  }
}

</script>

<style scoped lang='less'>

</style>
