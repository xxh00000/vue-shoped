<!--
 * @Author: Wang Jin
 * @Descripttion: 
 * @version: 
 * @Date: 2021-02-19 23:23:06
 * @LastEditors: Wang Jin
 * @LastEditTime: 2021-02-22 13:48:23
-->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎页</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 数据统计 -->
      <el-row :gutter="10">
        <el-col :span="6">
          <div style="background:#409eff" class="statistics">
            <div class="title">
              <p>用户统计</p>
              <el-tag size="mini" type="success">实时</el-tag>
            </div>
            <div class="num">7</div>
            <div class="tip">当前总用户数量</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="background:#E6A23C" class="statistics">
            <div class="title">
              <p>商品统计</p>
              <el-tag size="mini" type="info">实时</el-tag>
            </div>
            <div class="num">927</div>
            <div class="tip">当前总商品数量</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="background:#67C23A" class="statistics">
            <div class="title">
              <p>订单统计</p>
              <el-tag size="mini" type="warning">实时</el-tag>
            </div>
            <div class="num">24</div>
            <div class="tip">当前总订单数量</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="background:#909399" class="statistics">
            <div class="title">
              <p>销售统计</p>
              <el-tag size="mini" type="primary">实时</el-tag>
            </div>
            <div class="num">345</div>
            <div class="tip">当前总销售额</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.el-row {
  padding: 0 9px;
  .statistics {
    color: white;
    height: 100px;
    border-radius: 4px;
    padding: 0 8px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 13px;
        font-weight: bold;
      }
    }
    .num {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
    }
    .tip {
      font-size: 12px;
    }
  }
}
</style>
