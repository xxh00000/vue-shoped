<!--
 * @Author: Wang Jin
 * @Descripttion: 
 * @version: 
 * @Date: 2021-01-17 16:45:06
 * @LastEditors: Wang Jin
 * @LastEditTime: 2021-01-25 13:35:44
-->
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="注意：只允许为第三分级设置参数" type="warning" show-icon :closable="false"> </el-alert>
      <el-row class="cat_list">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader v-model="selectedKeys" :options="cateList" :props="catListProps" @change="handleChange" clearable></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="btndisAbabled" @click="showDialog">添加参数</el-button>
          <el-table :data="paramsData" border stripe>
            <el-table-column label="明细" type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag组件，显示参数明细 -->
                <el-tag :key="i" v-for="(item, i) in scope.row.attr_vals" closable @close="handleClose(scope.row, i)">
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDialary(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="btndisAbabled" @click="showDialog">添加属性</el-button>
          <el-table :data="paramsData" border stripe>
            <el-table-column label="明细" type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag组件，显示参数明细 -->
                <el-tag :key="i" v-for="(item, i) in scope.row.attr_vals" closable @close="handleClose(scope.row, i)">
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDialary(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog :title="'添加' + title" :visible.sync="addDialogVisible" width="50%" @close="addHandleClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="title" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCanShu">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog :title="'添加' + title" :visible.sync="editDialogVisible" width="50%" @close="editHandleClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="title" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCanShu">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类列表
      cateList: [],
      catListProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      //级联选择器选中的id
      selectedKeys: [],
      activeName: 'many',
      //分类参数
      paramsData: [],
      //添加参数对话框
      addDialogVisible: false,
      //添加参数对象
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      },
      //修改参数对话框
      editDialogVisible: false,
      //修改参数对象
      editForm: {
        attr_name: ''
      },
      editFormRules: {
        attr_name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCatList()
  },
  methods: {
    async getCatList() {
      const { data: res } = await this.$http.get(`categories`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.cateList = res.data
      //console.log(this.cateList)
      return this.$message.success('获取分类列表成功')
    },
    //监听级联选择器的改变
    handleChange() {
      this.getParamsData()
    },
    //tag导航的改变
    handleClick() {
      this.getParamsData()
    },
    //获取分类参数的数据
    async getParamsData() {
      //判断是否选择的三级分类，如果不是则重置
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.paramsData = []
        return
      }

      //根据所选参数，确定动态参数or静态属性
      const { data: res } = await this.$http.get(`categories/${this.catId}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      //对参数的明细进行处理按空格进行拆分为数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      this.paramsData = res.data
    },
    //监听添加对话框的关闭事件
    addHandleClose() {
      this.$refs.addFormRef.resetFields()
    },
    //添加参数事件
    addCanShu() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post(`categories/${this.catId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          //console.log(res.data)
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    //监听添加按钮
    showDialog() {
      this.addDialogVisible = true
    },
    //删除动态参数
    removeDialary(id) {
      this.$confirm('是否要删除该动态参数?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${this.catId}/attributes/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除动态参数失败')
          }
          this.$message.success('删除动态参数成功')
          this.getParamsData()
        })
        .catch(() => {
          this.$message.info('已取消删除动态参数')
        })
    },
    //编辑对话框的显示隐藏
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`categories/${this.catId}/attributes/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('编辑对话框显示失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //监听编辑对话框的关闭事件
    editHandleClose() {
      this.$refs.editFormRef.resetFields()
    },
    //编辑功能实现
    editCanShu() {
      //表单验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(`categories/${this.catId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName,
          attr_vals: this.editForm.attr_vals
        })
        if (res.meta.status !== 200) {
          return this.$message.error('编辑失败')
        }
        this.$message.success('编辑成功')
        this.editDialogVisible = false
        this.getParamsData()
      })
    },
    //检听tag标签的关闭
    handleClose(row, i) {
      row.attr_vals.splice(i, 1)
      this.updataParamsDetial(row)
    },
    //监听添加tag按钮
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    //监听input失去焦点或者回车
    handleInputConfirm(row) {
      if (row.inputValue.trim()) {
        row.attr_vals.push(row.inputValue.trim())
        this.updataParamsDetial(row)
      }
      row.inputVisible = false
      row.inputValue = ''
    },
    //更新参数明细
    async updataParamsDetial(row) {
      const { data: res } = await this.$http.put(`categories/${this.catId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('更新参数明细失败')
      }
      this.$message.success('更新参数明细成功')
    }
  },
  computed: {
    catId() {
      return this.selectedKeys.length === 3 ? this.selectedKeys[2] : null
    },
    //是否禁用按钮
    btndisAbabled() {
      return this.selectedKeys.length === 3 ? false : true
    },
    //添加对话框名称
    title() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  }
}
</script>

<style>
.cat_list {
  margin: 15px 0;
}
.el-cascader {
  width: 200px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px !important;
}
</style>
