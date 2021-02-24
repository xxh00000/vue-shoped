<!--
 * @Author: Wang Jin
 * @Descripttion: 
 * @version: 
 * @Date: 2021-02-20 21:52:33
 * @LastEditors: Wang Jin
 * @LastEditTime: 2021-02-20 21:53:00
-->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索和添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入订单编号" v-model="queryInfo.query" clearable >
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表 -->
      <el-table :data="OrderList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格（元）" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag effect="dark" size="mini" type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
             <el-tag effect="dark" size="mini" type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time"></el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改收货地址" placement="top" :enterable="false"> <el-button type="primary" size="mini" icon="el-icon-edit"></el-button></el-tooltip>
             <el-tooltip effect="dark" content="查看物流信息" placement="top" :enterable="false"> <el-button type="warning" size="mini" icon="el-icon-location"></el-button></el-tooltip>
          </template>
        </el-table-column>
      
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      OrderList: [],
      total: 0
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      res.data.goods.forEach(item =>{
        item.create_time = this.$utils.formatToDate(item.create_time)
      })
      this.OrderList = res.data.goods
      this.total = res.data.total
      console.log(this.OrderList)
    }
  }
}
</script>

<style></style>
