<template>
  <div class="account_add">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加账号</span>
      </div>
      <div class="text item">
        <div id="main">
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="原密码" prop="ex_password">
              <el-input type="password" v-model="ruleForm.ex_password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { API_CHECK_OLDPWD } from "@/api/apis"; //验证旧密码接口
import { API_CHANGE_PWD } from "@/api/apis"; //修改密码接口

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        ex_password: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        ex_password: [{ validator: validatePass, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      //从本地存储里面拿到id
      let id = parseInt(localStorage.getItem("id"));
      //验证并发送请求
      this.$refs[formName].validate(valid => {
        if (valid) {
          API_CHECK_OLDPWD(this.ruleForm.ex_password, id).then(res => {
            //若旧密码验证成功
            if (res.data.code == 0) {
              API_CHANGE_PWD(this.ruleForm.checkPass, id).then(res => {
                if (res.data.code == 0) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  // 修改成功 跳转至登录页面
                  this.$router.push("/");
                  console.log(res);
                } else {
                  // 修改密码失败
                  this.$message.error(res.data.msg);
                  this.ruleForm.ex_password = this.ruleForm.checkPass = "";
                }
              });
            } else {
              // 若旧密码验证失败 弹出消息
              this.$message.error(res.data.msg);
              this.ruleForm.ex_password = "";
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
.account_add {
  .el-input {
    width: 250px;
  }
}
</style>