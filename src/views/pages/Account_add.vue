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
            <el-form-item label="用户名" prop="username">
              <el-input type="username" v-model="ruleForm.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
              <el-input type="password" v-model="ruleForm.pwd" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户组">
              <el-select v-model="userGroups" placeholder="请选择用户组">
                <el-option
                  v-for="item in options"
                  :key="item.userGroups"
                  :label="item.label"
                  :value="item.userGroups"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm()">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { API_ADD_ACCOUNT } from "@/api/apis";//注册账号接口

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkpwd !== "") {
          this.$refs.ruleForm.validateField("checkpwd");
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
        username: "",
        pwd: ""
      },
      rules: {
        username: [{ validator: validatePass, trigger: "blur" }],
        pwd: [{ validator: validatePass, trigger: "blur" }],
        checkpwd: [{ validator: validatePass2, trigger: "blur" }]
      },
      options: [
        {
          userGroups: "普通管理员"
          // label: "普通管理员"
        },
        {
          userGroups: "超级管理员"
          // label: "超级管理员"
        }
      ],
      userGroups: ""
    };
  },
  methods: {
    // 注册账号
    submitForm() {
      API_ADD_ACCOUNT(
        this.ruleForm.username,
        this.ruleForm.pwd,
        this.userGroups
      ).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.$router.push('/index/account_list')
          console.log(res);
        } else {
          this.$message.error(res.data.msg);
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