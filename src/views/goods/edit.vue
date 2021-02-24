<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示信息 -->
      <el-alert title="修改商品信息" type="info" show-icon center :closable="false"> </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeInformation - 0" finish-status="success" align-center :space="200">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" label-position="top">
        <!-- 标签页 -->
        <el-tabs v-model="activeInformation" tab-position="left" :before-leave="beforeTabsLeave" @tab-click="tabsClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="editForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="editForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="editForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="editForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader v-model="editForm.goods_cat" :options="cateList" :props="cateListProps" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(value, i) in item.attr_vals" :key="i" :label="value" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action必须提供图片需要上传的服务器地址 -->
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headersObj" :on-success="handlesuccess" :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="editForm.goods_introduce" />
            <el-button type="primary" class="btn-add" @click="editGoods()">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览对话框 -->
    <el-dialog title="预览图片" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="预览图片" class="preview-img" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeInformation: '0',
      //表单对象
      editForm: {
        goods_name: '',
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        //商品所属分类的数组
        goods_cat: [],
        //商品图片数组
        pics: [],
        //商品内容
        goods_introduce: '',
        //商品的参数数据
        attrs: []
      },
      fileList:[],
      //表单对象验证
      editFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }]
      },
      //分类数据
      cateList: [],
      //级联选择器配置对象
      cateListProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      //动态参数
      manyData: [],
      //静态属性
      onlyData: [],
      //上传图片地址
      uploadURL: 'http://www.tangxiaoyang.vip:8888/api/v2/upload',
      //文件上传请求头
      headersObj: {
        Authorization: JSON.parse(sessionStorage.getItem('userInfo')).token
      },
      previewVisible: false,
      previewPath: ''
    }
  },
  created() {
    //根据id获取商品信息
    this.getGoodsList(),
    this.getCatList()
  },
  methods: {
    async getCatList() {
      const { data: res } = await this.$http.get(`categories`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类数据失败')
      }
      //this.$message.success("1111")
      this.cateList = res.data
      console.log(this.cateList)
    },
    //监听级联选择器的监听事件
    handleChange() {
      if (this.editForm.goods_cat.length !== 3) {
        this.editForm.goods_cat = []
      }
    },
    //tabs切换之前会触发
    beforeTabsLeave() {
      if (this.editForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    //tab被选中的时候调用
    async tabsClicked() {
      //判断是动态参数和静态属性
      if (this.activeInformation === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数失败')
        }
        // console.log(res.data)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })

        this.manyData = res.data
        console.log(this.manyData)
      } else if (this.activeInformation === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败')
        }
        // console.log(res.data)

        this.onlyData = res.data
        console.log(this.onlyData)
      }
    },
    //预览图片
    handlePreview(file) {
      this.previewPath = file.url
      this.previewVisible = true
      console.log(file)
      console.log(this.previewPath)
    },
    //移除图片
    handleRemove(file) {
      console.log(file)
      //获取将要删除的图片临时路径
      const filePath = file.response.data.tmp_path
      //从pics数组中，找到这个图片对应的索引值
      const i = this.editForm.pics.findIndex(item => {
        item.pic == filePath
      })
      //从pic数组中移除
      this.editForm.pics.splice(i, 1)
      console.log(this.editForm.pics)
    },
    //监听图片上传成功
    handlesuccess(response) {
      this.editForm.pics.push({
        pic: response.data.tmp_path
      })
      console.log(this.editForm)
      console.log(this.editForm.pics)
    },
    //修改商品按钮事件
    editGoods() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        //使用lodash工具完成深拷贝对象赋值
        const form = _.cloneDeep(this.editForm)
        form.goods_cat = form.goods_cat.join(',')
        //处理动态数组
        this.manyData.forEach(item => {
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          })
        })
        //处理静态属性
        this.onlyData.forEach(item => {
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          })
        })
        //  发送请求
        const { data: res } = await this.$http.put(`goods/${this.editForm.goods_id}`, form)
        if (res.meta.status !== 200) {
          return this.$message.error('修改商品失败')
        }
        this.$message.success('修改商品成功')
        this.$router.push('/goods')
      })
    },
    async getGoodsList(){
      const {data:res} = await this.$http.get(`goods/${this.$route.query.id}`)
      if(res.meta.status !== 200 ){
        return this.$message.error("获取商品信息失败")
      }
      //对分类数据进行处理
      res.data.goods_cat = res.data.goods_cat.split(',').map(item=>{
        return item*1
      })
      //对图片数据进行处理
      res.data.pics.forEach(item=>{
        this.fileList.push({
          name:item.pics_id,
          url:item.pics_big_url.replace('127.0.0.1','www.tangxiaoyang.vip')
        })
      })
      this.editForm = res.data
      console.log(this.editForm)
      
    }
  },
  computed: {
    cateId() {
      return this.editForm.goods_cat.length === 3 ? this.editForm.goods_cat[2] : null
    }
  }
}
</script>

<style>
.el-checkbox {
  margin-right: 10px;
}
.preview-img {
  width: 100%;
  height: 100%;
}
.btn-add {
  margin-top: 15px !important;
}
</style>
