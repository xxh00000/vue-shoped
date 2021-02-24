<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索和添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格展示 -->
      <el-table :data="usersList" border stripe>
        <el-table-column type="index" label="索引"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <!-- 自定义列表模板 ，使用作用域插槽，通过scope.row获取当前行的数据-->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserById(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="allotRoll(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="提示" :visible.sync="editDialogVisible" @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="rollDialogVisible" @close="setRoleDialogClose">
      <p>当前用户:{{ this.UserInfo.username }}</p>
      <p>当前角色:{{ this.UserInfo.role_name }}</p>
      <p>
        分配角色:
        <el-select v-model="selectRollsById" placeholder="请选择">
          <el-option v-for="item in rollsList" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
        </el-select>
      </p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="rollDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //查询用户列表的参数对象
      queryInfo: {
        //参数名都是后台接口所规定的名称
        query: '', //指定查询条件
        pagenum: 1, //页码
        pagesize: 5 //每页取多少条
      },
      //用户列表数据
      usersList: [],
      //总的记录数
      total: 0,
      //添加对话框的显示和隐藏
      addDialogVisible: false,
      //添加用户的表单数据对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加用户的校验规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { pattern: /\w+@[a-z0-9]+\.[a-z]{2,4}/, message: '邮箱格式不正确', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号', trigger: 'blur' },
          { pattern: /^1[3|4|5|7|8][0-9]{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ]
      },
      //修改对话框的显示和隐藏
      editDialogVisible: false,
      //修改用户的表单数据对象
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      //修改用户的校验规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { pattern: /\w+@[a-z0-9]+\.[a-z]{2,4}/, message: '邮箱格式不正确', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号', trigger: 'blur' },
          { pattern: /^1[3|4|5|7|8][0-9]{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ]
      },
      //分配角色对话框的显示和隐藏
      rollDialogVisible: false,
      //分配角色的用户信息
      UserInfo: {},
      //用户分配角色列表
      rollsList: [],
      //用户分配角色数据
      selectRollsById: null
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    //获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo //传递参数
      })
      //console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.usersList = res.data.users
      this.total = res.data.total
      //console.log(this.usersList)
    },
    // 监听pagesize改变事件
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getUserList()
    },
    //监听pagenum改变事件
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getUserList()
    },
    //监听switch开关状态改变
    async userStateChange(userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      console.log(userinfo.id)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新状态失败')
      }
      this.$message.success('更新状态成功')
      //console.log(userinfo)
    },
    //监听添加用户对话框关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        //关闭添加对会话框
        this.addDialogVisible = false
        //刷新用户列表
        this.getUserList()
        //给出提示
        this.$message.success('添加用户成功')
      })
    },
    //修改用户
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        //console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户信息失败')
        }
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改用户信息成功')
      })
    },
    //显示编辑的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      //console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('查询失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //监听添加用户对话框关闭
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    //删除用户
    deleteUserById(id) {
      this.$confirm('是否确定删除该用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`users/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除用户失败')
          }
          this.$message.success('删除用户成功')
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    //显示分配角色对话框
    async allotRoll(UserInfo) {
      this.UserInfo = UserInfo
      this.rollDialogVisible = true
      const { data: res } = await this.$http.get(`roles`)
      if (res.meta.status !== 200) {
        return this.$message.error('分配用户角色失败')
      }
      this.rollsList = res.data
      //console.log(this.rollsList)
    },
    //分配角色
    async allotRole() {
      //判断是否选择角色
      if (!this.selectRollsById) {
        return this.$message.error('请选择用户角色')
      }
      const { data: res } = await this.$http.put(`users/${this.UserInfo.id}/role`, { rid: this.selectRollsById })
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败')
      }
      this.$message.success('更新角色成功')
      this.getUserList()
      this.rollDialogVisible = false
    },
    setRoleDialogClose() {
      this.selectRollsById = null
      this.UserInfo = {}
    }
  }
}
</script>

<style></style>
