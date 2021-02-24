<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div class="left">
        <img src="../assets/imgs/shop.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <div class="right">
        <span class="right-span">欢迎您：{{ userInfo.username }}</span>
        <el-button type="danger" size="mini" @click="loginout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 切换菜单的折叠和显示 -->
        <div class="toggle-button" @click="isCollapse = !isCollapse">|||</div>
        <el-menu :default-active="$route.path" unique-opened router :collapse="isCollapse" :collapse-transition="false">
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <i class="el-icon-menu"></i>
              {{ subItem.authName }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //用户信息对象
      userInfo: null,
      //左侧菜单列表
      menuList: [],
      //图像样式对象
      iconObj: {
        201: 'iconfont icon-shouye',
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
      },
      //是否折叠左侧菜单
      isCollapse: false,
    }
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.getMenuList()
  },
  methods: {
    loginout() {
      this.$confirm('此操作将退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '退出登录成功!',
          })
          sessionStorage.clear()
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    //获取左侧菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('res.meta.msg')
      }
      this.menuList = res.data
     // console.log(this.menuList)
    },
  },
}
</script>

<style>
.el-container {
  height: 100%;
}
.el-header {
  background: url('../assets/imgs/header_bg.gif') repeat-x center;
  height: 50px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}
.left {
  display: flex;
  align-items: center;
  font-size: 20px;
}
.el-header img {
  width: 40px;
  margin-right: 20px;
}
.right-span {
  margin-right: 40px;
}
.el-aside .el-menu {
  border-right: 0;
}
.el-aside .el-menu .iconfont {
  margin-right: 10px;
}
.el-aside .toggle-button {
  background-color: #60779d;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  color: white;
  letter-spacing: 0.2rem;
  cursor: pointer;
}
.el-main {
  background-color: #eaedf1;
}
</style>
