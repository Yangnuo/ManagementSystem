<template>
  <div class="shop_mage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>店铺管理</span>
      </div>
      <div class="text item">
        <div id="main">
          <el-form ref="form" :model="form" label-width="80px">
            <!-- 店铺名称 -->
            <el-form-item label="店铺名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>

            <!-- 店铺公告 -->
            <el-form-item label="店铺公告">
              <el-input type="textarea" v-model="form.bulletin"></el-input>
            </el-form-item>

            <!-- 店铺头像 -->
            <el-form-item label="店铺头像">
              <el-upload
                class="avatar-uploader"
                action="http://127.0.0.1:5000/shop/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="form.avatar" :src="shopimgApi+form.avatar" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>

            <!-- 店铺图片 -->
            <el-form-item label="店铺图片">
              <el-upload
                action="http://127.0.0.1:5000/shop/upload"
                list-type="picture-card"
                :file-list="pics"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="picSuccess"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt />
              </el-dialog>
            </el-form-item>

            <!-- 配送费 -->
            <el-form-item label="配送费">
              <el-input v-model="form.deliveryPrice"></el-input>
            </el-form-item>

            <!-- 配送时间 -->
            <el-form-item label="配送时间">
              <el-input v-model="form.deliveryTime"></el-input>
            </el-form-item>

            <!-- 配送描述 -->
            <el-form-item label="配送描述">
              <el-input v-model="form.description"></el-input>
            </el-form-item>

            <!-- 店铺评分 -->
            <el-form-item label="店铺评分">
              <el-input v-model="form.score"></el-input>
            </el-form-item>

            <!-- 销量 -->
            <el-form-item label="销量">
              <el-input v-model="form.sellCount"></el-input>
            </el-form-item>

            <!-- 活动 -->
            <el-form-item label="活动">
              <el-checkbox-group v-model="form.supports">
                <el-checkbox
                  v-for="(item,index) in supLabel"
                  :key="index"
                  :label="item.label"
                  name="type"
                >{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="活动时间">
              <div class="block">
                <el-date-picker
                  v-model="form.date"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy年MM月dd日HH小时mm分钟ss秒"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { API_SHOP_INFO } from "@/api/apis"; //获取店铺信息
import { API_SHOP_EDIT } from "@/api/apis"; //修改店铺信息接口
import { API_SHOPS_IMG } from "@/api/apis";

export default {
  data() {
    return {
      form: {
        id: 0,
        name: "",
        bulletin: "",
        avatar: "",
        deliveryPrice: 1,
        deliveryTime: 30,
        score: 90,
        sellCount: 100,
        supports: [],
        description: "",
        date: []
      },
      supLabel: [
        { label: "美食/餐厅线上活动" },
        { label: "地推活动" },
        { label: "线下主题活动" },
        { label: "单纯品牌曝光" }
      ],
      picName: [], //添加图片push成的数组
      pics: [], //上传完成的数组
      dialogImageUrl: "",
      dialogVisible: false,
      shopimgApi: API_SHOPS_IMG
    };
  },
  methods: {
    onSubmit() {
      console.log(this.form);
      
      let newEdit = { ...this.form };
      newEdit.supports = JSON.stringify(this.form.supports);
      newEdit.date = JSON.stringify(this.form.date);
      newEdit.pics = JSON.stringify(this.picName.concat(this.form.pics));
      this.$confirm("确认修改店铺信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API_SHOP_EDIT(
            newEdit
            // this.form.id,
            // this.form.name,
            // this.form.bulletin,
            // this.form.imgUrl,
            // this.form.deliveryPrice,
            // this.form.deliveryTime,
            // this.form.description,
            // this.form.score,
            // this.form.sellCount,
            // JSON.stringify(this.form.supports),
            // JSON.stringify(this.form.date),
            // JSON.stringify(this.picName.concat(this.from.pics))
          ).then(res => {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 图片上传成功
    picSuccess(res) {
      this.picName.push(res.imgUrl);
      console.log(this.picName);
    },
    // 头像上传成功
    handleAvatarSuccess(res) {
      this.form.avatar = res.imgUrl;
      // console.log(res);
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
    },

    // 图片移除
    handleRemove(file, fileList) {
      file, fileList;
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },
  created() {
    API_SHOP_INFO().then(res => {
      console.log(res);
      this.form = res.data.data;

      this.pics = res.data.data.pics.map(img => {
        return { url: this.shopimgApi + img };
      });
    });
  }
};
</script>

<style lang="less">
// 头像上传
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
.shop_mage {
  .el-input,
  .el-textarea {
    width: 400px;
  }
}
</style>