<template>
  <div class="goods_added">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品添加</span>
      </div>
      <div class="text item">
        <div id="main">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="商品名称">
              <el-input v-model="form.name" placeholder="商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-select v-model="form.category" placeholder="请选择商品分类">
                <el-option label="新品专享" value="新品专享"></el-option>
                <el-option label="营养适配" value="营养适配"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input-number
                v-model="form.price"
                @change="handleChange"
                :min="0"
                :max="9999"
                label="描述文字"
              ></el-input-number>
            </el-form-item>

            <el-form-item label="商品图片">
              <el-upload
                class="avatar-uploader"
                action="http://127.0.0.1:5000/goods/goods_img_upload"
                :data="picdata"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>

            <el-form-item label="商品描述">
              <el-input type="textarea" v-model="form.goodsDesc"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { API_GOODS_ADDED } from "@/api/apis"; //添加商品接口

export default {
  data() {
    return {
      form: {
        name: "",
        category: "",
        goodsDesc: "",
        price: 1
      },
      picdata: { imgUrl: "" },
      imgUrl: ""
    };
  },
  methods: {
    //   提交
    onSubmit() {
      API_GOODS_ADDED(
        this.form.name,
        this.form.category,
        JSON.stringify(this.form.price),
        this.imgUrl,
        this.form.goodsDesc
      ).then(res => {
        console.log(res);
      });
    },
    // 计数器
    handleChange(value) {
      console.log(value);
      //   this.num++;
    },
    // 上传图片方法
    handleAvatarSuccess(res) {
      this.imgUrl = "http://127.0.0.1:5000/upload/imgs/goods_img/" + res.imgUrl;
      console.log(res.imgUrl);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="less">
.goods_added {
  //   height: 100%;
  //   头像上传框样式
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>