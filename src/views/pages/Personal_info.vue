<template>
  <div class="personal_info">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Personal_info</span>
      </div>
      <div class="text item">
        <div id="main">
          <el-form>
            <!-- <el-form-item label="用户ID：">
              <el-form-item :label="JSON.stringify(infoList.id)"></el-form-item>
            </el-form-item>
            <el-form-item label="账号：">
              <el-form-item :label="infoList.account"></el-form-item>
            </el-form-item>
            <el-form-item label="用户组：">
              <el-form-item :label="infoList.userGroup"></el-form-item>
            </el-form-item>
            <el-form-item label="创建时间：">
              <el-form-item :label="infoList.ctime"></el-form-item>
            </el-form-item>-->
            <p>用户ID：{{infoList.id}}</p>
            <p>账号：{{infoList.account}}</p>
            <p>用户组：{{infoList.userGroup}}</p>
            <p>创建时间：{{infoList.ctime}}</p>
            <div class="head_Pic">
              <span>管理员头像：</span>
              <el-upload
                class="avatar-uploader"
                action="http://127.0.0.1:5000/users/avatar_upload"
                :data="data"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { API_ACCOUT_INFO } from "@/api/apis"; //修改密码接口
export default {
  data() {
    return {
      infoList: {
        id: "",
        account: "",
        userGroup: "",
        ctime: ""
      },
      imageUrl: "",
      data: { id: localStorage.id }
    };
  },
  created() {
    //获取个人信息
    let id = parseInt(localStorage.getItem("id"));
    API_ACCOUT_INFO(id).then(res => {
      // console.log(res);
      this.infoList = res.data.accountInfo;
      //截取时间格式
      this.infoList.ctime = this.infoList.ctime.slice(0, 10);
      this.imageUrl = res.data.accountInfo.imgUrl;
    });
    console.log(localStorage.id);
  },
  methods: {
    // 上传图片
    handleAvatarSuccess() {
      window.location.reload();
    },
    // 图片上传尺寸
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 5;

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
.personal_info {
  #main {
    p {
      border-bottom: 1px solid #ccc;
      line-height: 50px;
      margin-bottom: 10px;
    }
    div {
      vertical-align: middle;
      .avatar-uploader {
        display: inline;
        margin-left: 10px;
      }
    }
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
}
</style>