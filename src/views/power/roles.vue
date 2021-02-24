<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand" label="明细">
          <template slot-scope="scope">
            <!-- 渲染一级权限 -->
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="{ bdbottom: true, bdtop: i1 == 0, vertalgin: true }">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)"> {{ item1.authName }} </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="{ bdtop: i2 != 0, vertalgin: true }">
                  <el-col :span="6">
                    <el-tag closable type="success" @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 渲染三级权限 -->
                    <el-tag closable type="warning" v-for="item3 in item2.children" :key="item3.id" @close="removeRightById(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editRoleDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRoleDialog(scope.row.id)">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="SendDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addRolesClose">
      <!-- 表单 -->
      <el-form :model="addForm" :rules="addFormrules" ref="addFormref" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="50%" @close="editRolesClose">
      <!-- 表单 -->
      <el-form :model="editForm" :rules="editFormrules" ref="editFormref" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="SendDialogVisible" width="50%" @close="SendRolesClose">
      <el-tree ref="treeRef" :data="rightsList" show-checkbox node-key="id" :props="allortProps" default-expand-all :default-checked-keys="defaultArry"> </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SendDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="SendRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      //添加对话框显示隐藏
      addDialogVisible: false,
      //添加角色表单
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormrules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      //编辑对话框显示隐藏
      editDialogVisible: false,
      editForm: {},
      //编辑表单验证
      editFormrules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      //分配权限对话框显示隐藏
      SendDialogVisible: false,
      //权限树形列表
      rightsList: [],
      allortProps: {
        children: 'children',
        label: 'authName'
      },
      //默认选中权限数组
      defaultArry: [],
      //当前要分配角色权限的ID
      roleId: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    //获取角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get(`roles`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
      //console.log(this.roleList)
    },
    //添加角色条目
    addRole() {
      this.$refs.addFormref.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post(`roles`, this.addForm)
        if (res.meta.status !== 201) {
          //console.log(res)
          return this.$message.error('添加失败')
        }
        this.addDialogVisible = false
        this.$message.success('添加成功')
        this.getRoleList()
      })
    },
    //检测添加角色关闭对话框
    addRolesClose() {
      this.$refs.addFormref.resetFields()
    },
    //编辑角色对话框显示
    async editRoleDialog(id) {
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('编辑角色对话框显示失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //编辑角色
    editRole() {
      this.$refs.editFormref.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(`roles/${this.editForm.roleId}`, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色失败')
        }
        this.$message.success('修改角色成功')
        this.getRoleList()
        this.editDialogVisible = false
      })
    },
    editRolesClose() {
      this.$refs.editFormref.resetFields()
    },
    //删除角色条目
    deleteRoleDialog(id) {
      this.$confirm('是否要删除该角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除角色失败')
          }
          this.getRoleList()
          this.$message.success('删除角色成功')
        })
        .catch(() => {
          this.$message.info('已经取消删除')
        })
    },
    //根据id删除角色权限
    removeRightById(role, rightId) {
      this.$confirm('是否要继续删除该权限', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除角色权限失败')
          }
          this.$message.success('删除角色权限成功')
          // this.getRoleList() 不建议使用刷新整个列表
          role.children = res.data
        })
        .catch(() => {
          this.$message.info('已经取消删除')
        })
    },
    //检测分配权限对话框的关闭
    SendRolesClose() {
      this.defaultArry = []
    },
    //分配权限功能
   async SendRole() {
      const keys = this.$refs.treeRef.getCheckedKeys().concat(this.$refs.treeRef.getHalfCheckedKeys())
      const idStr = keys.join(',')
      //向后台发送请求
      const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{
        rids:idStr
      })
      if(res.meta.status !== 200){
        return this.$message.error("分配权限失败")
      }
      this.SendDialogVisible = false
      this.getRoleList()
      this.$message.success("分配权限成功")
      //console.log(keys)
    },
    //显示分配权限对话框
    async SendDialog(role) {
      this.SendDialogVisible = true
      const { data: res } = await this.$http.get(`rights/tree`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限树形列表失败')
      }
      this.rightsList = res.data
      //存储当前要分配权限角色的ID 
      this.roleId = role.id
      console.log(this.rightsList)
      //获取角色下所有角色的ID
      this.getLeafKeys(role)
      console.log(this.defaultArry)
    },
    //获取角色下所有角色的ID
    getLeafKeys(node) {
      //判断是否为三级权限
      if (!node.children) {
        return this.defaultArry.push(node.id)
      }
      //如果不是三级权限，则递归操作
      node.children.forEach(item => {
        this.getLeafKeys(item)
      })
    }
  }
}
</script>

<style>
.el-tag {
  margin: 6px;
}
.bdbottom {
  border-bottom: 1px #eee solid;
}
.bdtop {
  border-top: #eee 1px solid;
}
.vertalgin {
  /* 垂直居中 */
  /* vertical-align: center; */
  display: flex;
  align-items: center;
}
</style>
