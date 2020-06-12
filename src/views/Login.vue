<template>
  <div class="login">
    <section>
      <h1>系统登陆</h1>
      <el-form ref="loginForm" :model="form" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="form.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input v-model="form.pwd" show-password prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" style="width:100%">登录</el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import { API_LOGIN } from "@/api/apis";

export default {
  data() {
    return {
      form: {
        username: "",
        pwd: "",
        isreqflag: true
      },
      //声明规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" }
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 12, message: "长度在 5 到 12 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    onSubmit() {
      if (this.isreqflag == false) return;
      this.isreqflag = false;

      API_LOGIN(this.form.username, this.form.pwd).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: "登录成功",
            type: "success"
          });

          // 本地存储id,用户名,token
          localStorage.setItem("id", res.data.id);
          localStorage.setItem("userName", this.form.username);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("role", res.data.role);

          // console.log(res);
          // 验证成功进入主页
          this.$router.push("/index");
        } else {
          this.$message.error("登录失败,账号或密码错误");
        }
      });
      setTimeout(() => {
        this.isreqflag = true;
      }, 2000);
    }
  }
};
</script>
<style lang='less'>
.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #2d3a4b;
  section {
    width: 320px;
  }
  h1 {
    color: #eee;
    text-align: center;
    margin-bottom: 30px;
  }
}
</style>