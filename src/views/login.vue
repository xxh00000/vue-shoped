<!--
 * @Author: your name
 * @Date: 2020-12-14 14:32:49
 * @LastEditTime: 2020-12-20 21:20:33
 * @LastEditors: Wang Jin
 * @Description: In User Settings Edit
 * @FilePath: \vue-shop\src\views\login.vue
-->
<template>
  <div class="login-container">
    <div class="login-left">
      <img src="../assets/login_img.png" alt="无法显示图片" />
    </div>
    <div class="login-box">
      <!-- 头像 -->
      <div class="login-logo">
        <img src="../assets/login_logo.png" alt="logo" />
      </div>
      <!-- 标题 -->
      <div class="login-title">
        <p>电商后台管理系统</p>
      </div>
      <!-- input表单 -->
      <div class="login-form">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" status-icon>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon=" iconfont icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" placeholder="请输入密码" prefix-icon=" iconfont icon-3702mima" type="password"></el-input>
          </el-form-item>
          <el-button type="primary" class="login-butn" @click="login">登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      //表单的校验规则,以对象形式
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录账户', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' },
        ],
        passward: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在6到10个字符', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        //发送请求是否登陆成功
        const { data: res } = await this.$http.post('login', this.loginForm)
        //登录判断
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败')
        }
        this.$message.success('登录成功')
        //将用户信息保存到sessionStorage中注意sessionStorage只能存储string字符串
        sessionStorage.setItem('userInfo', JSON.stringify(res.data))
        console.log(res)
        //路由跳转;防止没有获取token值，就进行了跳转，使得守护路由错误，所以要在sessionStorage后面
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style>
.login-container {
  height: 100%;
  background-color: #93defe;
  /* 实现元素的水平垂直居中 */
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-left {
  margin-right: 100px;
}
.login-box {
  height: 350px;
  width: 400px;
  background-color: white;
  border-radius: 6px;
  position: relative;
}
.login-logo {
  border: 4px #93defe solid;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  text-align: center;
  position: absolute;
  top: -60px;
  background-color: white;
  right: 140px;
}
.login-logo img {
  width: 70px;
  height: 70px;
}
.login-title {
  font-size: 20px;
  color: #444444;
  position: absolute;
  top: 80px;
  left: 115px;
}
.login-form {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  padding: 10% 20%;
  box-sizing: border-box;
  width: 400px;
}
.login-butn {
  width: 100%;
}
</style>
