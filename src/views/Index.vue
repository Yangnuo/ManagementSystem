<template>
  <div class="index">
    <el-container>
      <!----- 左侧导航栏 ----->
      <el-aside width="200px">
        <img src="../assets/img/logo.jpg" alt />
        <el-col :span="12">
          <el-menu
            router
            :default-active="this.$route.path"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="gold"
            :unique-opened="true"
          >
            <!-- 树菜单 -->
            <div v-for="item in newtreeList" :key="item.index">
              <el-submenu v-if="item.children" :index="item.index">
                <template slot="title">
                  <i :class="item.icons"></i>
                  <span>{{item.title}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    v-for="child in item.children"
                    :key="child.index"
                    :index="child.index"
                  >{{child.title}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <el-menu-item v-else :index="item.index">
                <i :class="item.icons"></i>
                <span slot="title">{{item.title}}</span>
              </el-menu-item>
            </div>
          </el-menu>
        </el-col>
      </el-aside>
      <el-container>
        <!------ 头部 ------>
        <el-header>
          <!-- 面包屑导航 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/Index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(v,i) in this.$route.meta.breadcrumb" :key="i">{{v}}</el-breadcrumb-item>
          </el-breadcrumb>

          <!-- 下拉菜单 -->
          <el-dropdown>
            <span class="el-dropdown-link">
              <span v-html="isLogin"></span>
              <!-- <span v-show="notLogin">欢迎你，请登录</span> -->
              <el-avatar :size="50" :src="circleUrl"></el-avatar>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <a href="#/index/Personal_info">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </a>
              <a @click="exit">
                <el-dropdown-item>退出账号</el-dropdown-item>
              </a>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>

        <!-- 主界面 容器 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { API_CHEAK_TOKEN } from "@/api/apis"; //检查token接口
import { API_ACCOUT_INFO } from "@/api/apis"; //获取用户信息接口
export default {
  data() {
    return {
      // 导航栏数据
      treeList: [
        {
          title: "后台首页",
          icons: "el-icon-s-home",
          index: "/index",
          role: ["super", "normal"]
        },
        {
          title: "订单管理",
          icons: "el-icon-document",
          index: "/index/order_mage",
          role: ["super", "normal"]
        },
        {
          title: "商品管理",
          icons: "el-icon-box",
          index: "1",
          role: ["super", "normal"],

          children: [
            { index: "/index/goods_list", title: "商品列表" },
            { index: "/index/goods_added", title: "商品添加" },
            { index: "/index/goods_cify", title: "商品分类" }
          ]
        },
        {
          title: "店铺管理",
          icons: "el-icon-s-shop",
          index: "/index/shop_mage",
          role: ["super"]
        },
        {
          title: "账号管理",
          icons: "el-icon-user",
          index: "2",
          role: ["super"],
          children: [
            { index: "/index/account_list", title: "账号列表" },
            { index: "/index/account_add", title: "添加账号" },
            { index: "/index/change_pwd", title: "修改密码" }
          ]
        },
        {
          title: "销售统计",
          icons: "el-icon-s-marketing",
          index: "3",
          role: ["super"],
          children: [
            { index: "/index/goods_statistics", title: "商品统计" },
            { index: "/index/orders_statistics", title: "订单统计" }
          ]
        }
      ],
      username: "登录成功",
      circleUrl: "",
      isLogin: "", //是否登录
      currentrole: localStorage.role, //
    };
  },

  created() {
    //验证token
    this.username = localStorage.userName;
    API_CHEAK_TOKEN(localStorage.token).then(res => {
      // console.log(res);
      if (res.data.code == 0) {
        this.isLogin = "欢迎你，" + this.username;
        // this.circleUrl = res.data.imgUrl;
      } else {
        this.isLogin = "<a href='#/'>欢迎你，请登录<a>";
      }
    });
    // 调用个人信息接口获取id 获取头像进行头部渲染
    API_ACCOUT_INFO(localStorage.id).then(res => {
      this.circleUrl = res.data.accountInfo.imgUrl;
    });
  },
  methods: {
    // 退出时删除本地存储的账号信息
    exit() {
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("role");
      this.$router.push("/");
    }
  },
  computed: {
    newtreeList() {
      return this.treeList.filter(item => item.role.includes(this.currentrole));
    }
  }
};
</script>

<style lang="less">
.index {
  height: 100%;
  .el-container {
    height: 100%;

    .el-aside {
      background: #545c64;
      img {
        width: 100%;
      }
      .el-col-12 {
        width: 100%;
        .el-menu {
          border: 0;
        }
      }
    }
    .el-main {
      background: #f0f2f5;
    }
    .el-header {
      line-height: 60px;
      display: flex;
      justify-content: space-between;
      .el-breadcrumb {
        line-height: 60px;
      }
      .el-dropdown-link {
        cursor: pointer;
        color: #409eff;
      }
      .el-icon-arrow-down {
        font-size: 12px;
      }
      .el-avatar {
        vertical-align: middle;
        margin: 0 10px 0 10px;
      }
    }
  }
}
</style>
