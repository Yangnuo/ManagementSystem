<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>账号列表</span>
      </div>
      <div class="text item">
        <div id="main">
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column prop="account" label="姓名" width="120"></el-table-column>
            <el-table-column prop="userGroup" label="用户组" show-overflow-tooltip></el-table-column>
            <el-table-column label="日期" width="120">
              <template slot-scope="scope">{{ scope.row.ctime }}</template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete( scope.row)">删除</el-button>
                <!-- scope.$index, -->
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            layout="total, sizes, prev, pager, next, jumper"
            :page-size="pageSize"
            :total="total"
          ></el-pagination>
          <div style="margin-top: 20px">
            <el-button type="danger" @click="batchdel()">批量删除</el-button>
            <el-button type="primary" @click="cancelSelection()">取消选择</el-button>
          </div>

          <!-- 编辑弹出框 -->
          <el-dialog title="编辑账号" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="form.newUserName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="用户组" :label-width="formLabelWidth">
                <el-select v-model="form.newUserGroup" placeholder="用户组">
                  <el-option label="普通管理员" value="普通管理员"></el-option>
                  <el-option label="超级管理员" value="超级管理员"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { API_ACCOUNT_LIST } from "@/api/apis"; //获取列表接口
import { API_DEL_ACCOUNT } from "@/api/apis"; //删除账号接口
import { API_BATCHDEL_ACCOUNT } from "@/api/apis"; //批量删除账号接口
import { API_EDIT_ACCOUNT } from "@/api/apis"; //编辑账号接口

export default {
  data() {
    return {
      tableData: [],
      pageSize: 5, //每页条数
      pageSizes: [5, 10, 15, 20], //设置每页条数规格
      currentPage: 1, //当前页
      total: 0, //总页数
      editId: 0, //编辑 当前账号的id
      dialogFormVisible: false, //是否显示编辑框
      form: {
        newUserName: "",
        newUserGroup: ""
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    // 批量删除
    batchdel() {
      let ids = this.$refs.multipleTable.selection.map(v => {
        return v.id;
      });
      // 转字符串
      let strids = JSON.stringify(ids);
      // console.log(strids);
      this.$confirm("此操作将永久删除账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API_BATCHDEL_ACCOUNT(strids).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.getData();
            } else {
              this.$message.error(res.data.msg);
              this.$refs.multipleTable.clearSelection();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 取消选择
    cancelSelection() {
      this.$refs.multipleTable.clearSelection();
    },

    // 表格点击事件

    // 编辑
    handleEdit(row) {
      this.editId = row.id;
      this.dialogFormVisible = true;
    },

    confirm() {
      API_EDIT_ACCOUNT(
        this.editId,
        this.form.newUserName,
        this.form.newUserGroup
      ).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.dialogFormVisible = false;
          this.getData();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 删除按钮
    handleDelete(row) {
      this.$confirm("此操作将永久删除该账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API_DEL_ACCOUNT(row.id).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.getData();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 分页尺寸
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    // 当前页面
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },

    //获取列表数据函数封装
    getData() {
      // 获取账户列表
      API_ACCOUNT_LIST(this.currentPage, this.pageSize).then(res => {
        // 获取数据赋给表单
        this.tableData = res.data.data;
        // console.log(res);

        // 时间格式处理
        for (let item of this.tableData) {
          item.ctime = item.ctime.slice(0, 10);
        }

        this.total = res.data.total;
        // }
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="less">
.el-dialog {
  width: 40%;
  .el-input {
    width: 80%;
  }
}
.el-pagination {
  margin-top: 10px;
}
</style>