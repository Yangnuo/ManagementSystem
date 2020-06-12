<template>
  <div class="goods_list">
    <el-card class="box-card">
      <div slot="header">
        <span>商品列表</span>
      </div>
      <div class="text item">
        <div id="main" :style="{width: '100%', height: '100%', margin:'0 auto'}">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="商品 ID">
                    <span>{{ props.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="商品名称">
                    <span>{{ props.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="商品分类">
                    <span>{{ props.row.category }}</span>
                  </el-form-item>
                  <el-form-item label="商品价格">
                    <span>{{ props.row.price }}</span>
                  </el-form-item>
                  <el-form-item label="商品图片">
                    <span>
                      <!-- <el-image style="width: 100px; height: 100px" src fit="fit"></el-image> -->
                    </span>
                  </el-form-item>
                  <el-form-item label="创建时间">
                    <span>{{ props.row.ctime }}</span>
                  </el-form-item>
                  <el-form-item label="商品评价">
                    <span>{{ props.row.rating }}</span>
                  </el-form-item>
                  <el-form-item label="商品销量">
                    <span>{{ props.row.sellCount }}</span>
                  </el-form-item>
                  <el-form-item label="商品描述">
                    <span>{{ props.row.goodsDesc }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="商品名称" prop="name"></el-table-column>
            <el-table-column label="所属分类" prop="category"></el-table-column>
            <el-table-column label="商品价格" prop="price"></el-table-column>
            <el-table-column label="商品图片">
              <template slot-scope="scope">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="goodsimgApi+scope.row.imgUrl"
                  fit="fit"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column label="商品描述" prop="goodsDesc"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 编辑弹出框 -->
          <el-dialog title="编辑分类" :visible.sync="editdialogFormVisible">
            <el-form ref="form" :model="edit_form" label-width="80px">
              <el-form-item label="商品名称">
                <el-input v-model="edit_form.name" placeholder="商品名称"></el-input>
              </el-form-item>
              <el-form-item label="商品分类">
                <el-select v-model="edit_form.category" placeholder="请选择商品分类">
                  <el-option label="新品专享" value="新品专享"></el-option>
                  <el-option label="营养适配" value="营养适配"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商品价格">
                <el-input-number
                  v-model="edit_form.price"
                  @change="handleChange"
                  :min="1"
                  :max="999"
                  label="描述文字"
                ></el-input-number>
              </el-form-item>

              <el-form-item label="商品图片">
                <el-upload
                  class="avatar-uploader"
                  action="http://127.0.0.1:5000/goods/goods_img_upload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img
                    v-if="edit_form.edit_imgUrl"
                    :src="goodsimgApi+edit_form.edit_imgUrl"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>

              <el-form-item label="商品描述">
                <el-input type="textarea" v-model="edit_form.goodsDesc"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editdialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="editconfirm">确 定</el-button>
            </div>
          </el-dialog>

          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { API_GOODS_LIST } from "@/api/apis";
import { API_DEL_GOODS } from "@/api/apis";
import { API_GOODS_EDIT } from "@/api/apis";
import { API_GOODS_IMG } from "@/api/apis";
export default {
  data() {
    return {
      tableData: [
        // category: "新品专享"
        // cctime: "2020-06-08T11:52:12.000Z"
        // goodsgoodsDesc: "2121"
        // id: 114
        // imgUrl: "1591617130831.jpg"
        // name: "12"
        // price: 1
        // rating: 100
        // ratings: "[{"username":"3******c","ratectime":1469281964000,"rateType":0,"text":"很喜欢的粥","avatar":"http://static.galileo.xiaojukeji.com/static/tms/default_header.png"},{"username":"2******3","ratectime":1469271264000,"rateType":0,"text":"","avatar":"http://static.galileo.xiaojukeji.com/static/tms/default_header.png"},{"username":"3******b","ratectime":1469261964000,"rateType":1,"text":"","avatar":"http://static.galileo.xiaojukeji.com/static/tms/default_header.png"}]"
        // sellCount: 41
      ],
      imgUrl: "",
      pageSizes: [5, 10, 15, 20],
      currentPage: 1,
      pageSize: 5,
      total: 1,

      // 编辑信息
      editdialogFormVisible: false,
      editformLabelWidth: "120px",
      editId: 0, //编辑 当前账号的id
      editform: {
        cateName: ""
      },
      edit_form: {
        name: "",
        category: "",
        goodsDesc: "",
        price: 1,
        edit_imgUrl: ""
      },
      goodsimgApi: API_GOODS_IMG
    };
  },
  methods: {
    //   表格点击事件
    handleEdit(row) {
      // console.log("http://127.0.0.1:5000/upload/imgs/goods_img/" + row.imgUrl);
      // console.log(row.imgUrl);
      //保存当前点击分类id
      this.editId = row.id;
      this.edit_form.name = row.name;
      this.edit_form.category = row.category;
      this.edit_form.goodsDesc = row.goodsDesc;
      this.edit_form.price = row.price;
      this.edit_form.edit_imgUrl = row.imgUrl;
      this.editdialogFormVisible = true;
    },
    editconfirm() {
      API_GOODS_EDIT(
        this.edit_form.name,
        this.edit_form.category,
        this.edit_form.price,
        this.edit_form.edit_imgUrl,
        this.edit_form.goodsDesc,
        parseInt(this.editId)
      ).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.getGoodslist();
          this.editdialogFormVisible = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 计数器
    handleChange(value) {
      console.log(value);
      //   this.num++;
    },
    // 上传图片方法
    handleAvatarSuccess(res) {
      this.edit_form.edit_imgUrl = res.imgUrl;
      // console.log(res.imgUrl);
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
    // 删除按钮
    handleDelete(row) {
      console.log(row.id);
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API_DEL_GOODS(row.id).then(res => {
            console.log(res);
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.getGoodslist();
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
      this.getGoodslist();
      console.log(val);
    },
    // 当前页面
    handleCurrentChange(val) {
      console.log(val);
      this.currentPage = val;
      this.getGoodslist();
    },

    //获取商品列表封装
    getGoodslist() {
      API_GOODS_LIST(this.currentPage, this.pageSize).then(res => {
        this.tableData = res.data.data;
        this.total = res.data.total;
        this.imgUrl = res.data.imgUrl;
        // console.log(res.data);
        // 时间格式处理
        for (let item of this.tableData) {
          item.ctime = item.ctime.slice(0, 10);
        }
      });
    }
  },
  created() {
    this.getGoodslist();
  }
};
</script>

<style lang="less">
.goods_list {
  height: 100%;
  .el-card {
    // height: 100%;
    .demo-table-expand {
      font-size: 0;
      label {
        width: 90px;
        color: #99a9bf;
      }
      .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
      }
    }
  }
  .el-pagination {
    margin-top: 10px;
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
</style>