<template>
  <div class="goods_cify">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>商品分类</span>
        <el-button
          @click="dialogFormVisible = true"
          style="float: right; padding:8px"
          type="primary"
        >添加分类</el-button>

        <!-- 新建分类弹出框 -->
        <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="分类名称" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" :label-width="formLabelWidth">
              <el-switch v-model="form.value_add" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="comfirmAdd">确 定</el-button>
          </div>
        </el-dialog>
      </div>

      <!-- main -->
      <div class="text item">
        <div id="main">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="序号" width="100"></el-table-column>
            <el-table-column prop="cateName" label="分类名称" width="240">
              <!-- <el-input v-show="isEdit" v-model="input" placeholder="请输入内容"></el-input> -->
            </el-table-column>

            <el-table-column prop="state" label="是否启用">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.state"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pagesizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>

          <!-- 编辑弹出框 -->
          <el-dialog title="编辑分类" :visible.sync="editdialogFormVisible">
            <el-form :model="editform">
              <el-form-item label="分类名称" :label-width="editformLabelWidth">
                <el-input v-model="editform.cateName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="是否启用" :label-width="editformLabelWidth">
                <el-switch
                  v-model="editform.value_add"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editdialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="editconfirm">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { API_ADDCATE } from "@/api/apis";
import { API_GOODSCIFY_LIST } from "@/api/apis";
import { API_DEL_GOODS_CIFY } from "@/api/apis";
import { API_EDITCATE } from "@/api/apis";
import { API_CATEGORIES } from "@/api/apis";
export default {
  data() {
    return {
      tableData: [],
      // ------添加分类表单信息------
      form: {
        name: "",
        value_add: true
      },
      dialogFormVisible: false,
      // ------分页信息--------
      pagesizes: [5, 10, 15, 20],
      pageSize: 5,
      currentPage: 1,
      total: 1,
      //------编辑分类信息------
      formLabelWidth: "120px",
      editId: 0, //编辑 当前账号的id
      editdialogFormVisible: false, //是否显示编辑框
      editform: {
        cateName: "",
        edit_value: ""
      },
      editformLabelWidth: "120px"
    };
  },
  methods: {
    //添加分类
    comfirmAdd() {
      API_ADDCATE(this.form.name, JSON.stringify(this.form.value_add)).then(
        res => {
          if (res.data.code == 0) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.dialogFormVisible = false;
            this.getCifylist();
          } else {
            this.$message.error(res.data.msg);
            this.dialogFormVisible = false;
          }
          console.log(res);
        }
      );
    },

    // 编辑按钮弹出框
    handleEdit(row) {
      this.editdialogFormVisible = true;
      //保存当前点击分类id
      this.editId = row.id;
    },
    // 编辑按钮确定
    editconfirm() {
      API_EDITCATE(
        this.editId,
        this.editform.cateName,
        JSON.stringify(this.editform.edit_value)
      ).then(res => {
        // console.log(res);
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.editdialogFormVisible = false;
          this.getCifylist();
        } else {
          this.$message.error(res.data.msg);
          this.editdialogFormVisible = false;
        }
      });
    },
    // 点击删除
    handleDelete(row) {
      this.delCate(row);
      this.getCifylist();
    },

    // 分页尺寸
    handleSizeChange(val) {
      this.pageSize = val;
      this.getCifylist();
    },
    // 当前页面
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCifylist();
    },
    // 获取列表数据封装
    getCifylist() {
      API_GOODSCIFY_LIST(this.currentPage, this.pageSize).then(res => {
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },
    // 删除方法封装
    delCate(row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API_DEL_GOODS_CIFY(row.id).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.getCifylist();
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
    }
  },
  created() {
    this.getCifylist();
    // 16. 查询所有分类名称
    API_CATEGORIES().then(res => {
      console.log(res);
    });
  }
};
</script>

<style lang="less">
.goods_cify {
  .el-dialog {
    width: 40%;
    .el-input {
      width: 80%;
    }
  }
  .el-pagination {
    margin-top: 10px;
  }
}
</style> 