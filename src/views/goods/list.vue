<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索和添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入商品名称" class="input-with-select" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="150px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="105px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="170px"></el-table-column>
        <el-table-column prop="goods_name" label="操作" width="135px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRoter(scope.row.goods_id)"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="reMoveById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 25]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodstotals"
      >
      </el-pagination>
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
      //商品列表数据
      goodsList: [],
      goodstotals: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get(`goods`, {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      for (let item of res.data.goods) {
        item.add_time = this.$utils.formatToDate(item.add_time)
      }
      console.log(res.data)
      ;(this.goodsList = res.data.goods), (this.goodstotals = res.data.total)
      console.log(this.goodsList)
      console.log(this.goodstotals)
    },
    handleSizeChange(pagesize){
      this.queryInfo.pagesize =pagesize
      this.getGoodsList()
    },
    handleCurrentChange(pagenum){
      this.queryInfo.pagenum = pagenum
      this.getGoodsList()
    },
    //根据id删除记录
    reMoveById(id){
       this.$confirm('是否删除该记录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
         const {data:res} = await this.$http.delete(`goods/${id}`)
         if(res.meta.status !== 200){
           return this.$message.error("删除操作失败")
         }
         this.$message.success("删除操作成功")
         this.getGoodsList()
        }).catch(() => {
          this.$message.info("已取消删除")        
        });
    },
    //跳转添加商品页面
    addGoods(){
      this.$router.push(`goods/add`)
    },
    //跳转编辑页面
    editRoter(id){
      this.$router.push(`/goods/edit?id=`+id)
    }
  }
}
</script>

<style lang="less" scoped></style>
