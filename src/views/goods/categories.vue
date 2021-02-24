<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialogVisible">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 树形表格 -->
      <tree-table class="tree-table" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" border>
        <!-- 是否有效自定义模板 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-error" style="color:red" v-if="scope.row.cat_deleted"></i>
          <i class="el-icon-success " style="color:Lightgreen" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="Order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="Operation" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" :close="addHandleClose">
      <!-- 可验证表单 -->
      <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="selectKeys" :options="parentCatList" :props="catCaderProps" @change="handleChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addclassify">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editDialogVisible" width="50%" :close="editHandleClose">
      <!-- 可验证表单 -->
      <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editclassify">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //查询分类页表的参数对象
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //分类列表
      cateList: [],
      //总记录数
      total: 0,
      //表格tree-table列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //将当前列设置为模板列
          type: 'template',
          //当前列使用的模板名称
          template: 'isOk'
        },
        {
          label: '排序',
          //将当前列设置为模板列
          type: 'template',
          //当前列使用的模板名称
          template: 'Order'
        },
        {
          label: '操作',
          //将当前列设置为模板列
          type: 'template',
          //当前列使用的模板名称
          template: 'Operation'
        }
      ],
      //添加分类对话框的显示隐藏
      addDialogVisible: false,
      //添加分类表单对象
      addForm: {
        cat_name: '',
        cat_pid: 0, //父级分类的id
        cat_level: 0 //父级分类等级
      },
      //添加分类表单对象验证
      addFormrules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      //父级分类的数据列表
      parentCatList: [],
      //级联选择器的配置对象
      catCaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true //可以选择任意项
      },
      //级联选择器选中的id数组
      selectKeys: [],
      editDialogVisible: false,
      editForm: {
        cat_name: ''
      },
      editFormrules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCartList()
  },
  methods: {
    async getCartList() {
      const { data: res } = await this.$http.get(`categories`, {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类页数据失败')
      }
      //console.log(res)
      this.cateList = res.data.result
      this.total = res.data.total
      console.log(this.cateList)
      console.log(this.total)
    },
    //改变展示页的大小
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getCartList()
    },
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getCartList()
    },
    //添加分类对话框的显示
    showAddDialogVisible() {
      this.getParentCatList()
      this.addDialogVisible = true
    },
    //获取父级分类的数据类表
    async getParentCatList() {
      const { data: res } = await this.$http.get(`categories`, {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类列表数据失败')
      }
      //console.log(res.data)
      this.parentCatList = res.data
    },
    //检测分类对话框关闭
    addHandleClose() {
      this.$refs.addFormRef.resetFields(), (this.addForm.cat_pid = 0), (this.addForm.cat_level = 0), (this.selectKeys = [])
    },
    //实现添加分类
    addclassify() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post(`categories`, this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.addDialogVisible = false
        this.getCartList()
        this.$message.success('添加分类成功')
      })
    },
    //监听级联选择器的改变
    handleChange() {
      //判断是否选择父级元素
      if (this.selectKeys.length > 0) {
        this.addForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addForm.cat_level = this.selectKeys.length
      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
    },
    //监听编辑对话框的关闭
    editHandleClose() {},
    //编辑分类
    editclassify() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(`categories/${this.editForm.cat_id}`, {
          cat_name: this.editForm.cat_name
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改分类失败')
        }
        this.editDialogVisible = false
        this.getCartList()
        this.$message.success('修改分类成功')
      })
    },
    //监听编辑分类对话框的显示隐藏
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`categories/${id}`)
      if (res.meta.status !== 200) {
        console.log(res)
        return this.$message.error('编辑对话框数据显示失败')
      }

      this.editForm = res.data
      this.editDialogVisible = true
    },
    removeById(id) {
      this.$confirm('是否要删除该分类', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then ( async () => {
        const {data:res} = await  this.$http.delete(`categories/${id}`)
        if(res.meta.status !== 200){
          return this.$message.error("删除分类失败")
        }
          this.$message.success("删除分类成功")
          this.getCartList()
        })
        .catch(() => {
          this.$message.info("已取消删除分类")
        })
    }
  }
}
</script>

<style>
.el-cascader {
  width: 100%;
}
.tree-table {
  margin-top: 15px;
}
</style>
