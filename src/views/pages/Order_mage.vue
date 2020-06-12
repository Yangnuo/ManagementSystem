<template>
  <div class="order_mage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单管理</span>
      </div>
      <div class="text item">
        <div id="main" :style="{width: '100%', height: '100%', margin:'0 auto'}">
          <!-- 查询栏 -->
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="订单号">
              <el-input v-model="formInline.orderNo" placeholder="订单号"></el-input>
            </el-form-item>
            <el-form-item label="收货人">
              <el-input v-model="formInline.consignee" placeholder="收货人"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="formInline.phone" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="formInline.orderState" placeholder="订单状态">
                <el-option label="已完成" value="已完成"></el-option>
                <el-option label="未完成" value="未完成"></el-option>
              </el-select>
            </el-form-item>
            <br />
            <div class="block">
              <span class="demonstration">选择时间</span>
              <el-date-picker
                v-model="formInline.value1"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy年MM月dd日HH小时mm分钟ss秒"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </div>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>

          <!-- 表格内容 -->
          <el-table :data="tableData" border style="width: 100% ; margin-top:10px">
            <el-table-column fixed prop="orderNo" label="订单号" width="120"></el-table-column>
            <el-table-column prop="orderTime" label="日期" width="150"></el-table-column>
            <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
            <el-table-column prop="consignee" label="收货人" width="120"></el-table-column>
            <el-table-column prop="deliverAddress" label="配送地址" width="300"></el-table-column>
            <el-table-column prop="deliveryTime" label="送达时间" width="120"></el-table-column>
            <el-table-column prop="remarks" label="备注" width="120"></el-table-column>
            <el-table-column prop="orderAmount" label="订单金额" width="120"></el-table-column>
            <el-table-column prop="orderState" label="订单状态" width="120"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button @click="orderEdit(scope.row)" type="text" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 修改订单弹出框 -->
          <el-dialog title="订单修改" :visible.sync="dialogFormVisible">
            <el-form :model="editform">
              <el-form-item label="订单号" :label-width="formLabelWidth">
                <el-input v-model="editform.orderNo" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="下单时间" :label-width="formLabelWidth">
                <el-date-picker
                  v-model="editform.orderTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  format="yyyy年MM月dd日HH小时mm分钟ss秒"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="editform.phone" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="收货人" :label-width="formLabelWidth">
                <el-input v-model="editform.consignee" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="送货地址" :label-width="formLabelWidth">
                <el-input v-model="editform.deliverAddress" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="送达时间" :label-width="formLabelWidth">
                <el-date-picker
                  v-model="editform.deliveryTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  format="yyyy年MM月dd日HH小时mm分钟ss秒"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input v-model="editform.remarks" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="订单金额" :label-width="formLabelWidth">
                <el-input v-model="editform.orderAmount" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="活动区域" :label-width="formLabelWidth">
                <el-select v-model="editform.orderState" placeholder="订单状态">
                  <el-option label="已完成" value="已完成"></el-option>
                  <el-option label="未完成" value="未完成"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible=false">取 消</el-button>
              <el-button type="primary" @click="comfirmEdit">确 定</el-button>
            </div>
          </el-dialog>

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
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { API_ORDERS_LIST } from "@/api/apis";
import { API_ORDER_SEARCH } from "@/api/apis";
import { API_ORDERS_DETAEL } from "@/api/apis";
import { API_ORDER_EDIT } from "@/api/apis";

export default {
  data() {
    return {
      formInline: {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: "",
        value1: []
      },
      tableData: [
        // {
        // consignee: "汪小哥"
        // deliverAddress: "天府新谷"
        // deliveryTime: "2020-04-16T02:44:58.000Z"
        // id: 21
        // orderAmount: 30
        // orderNo: "16013"
        // orderState: "已完成"
        // orderTime: "2020-06-04T09:35:19.000Z"
        // phone: "18181358998"
        // remarks: "不要辣"
        // },
      ],
      pagesizes: [5, 10, 15, 20],
      currentPage: 1,
      pageSize: 5,
      total: 1,

      // 修改订单
      dialogFormVisible: false,
      editform: {
        id: 0,
        orderNo: "",
        orderTime: "",
        phone: "",
        consignee: "",
        deliverAddress: "",
        deliveryTime: "",
        remarks: "",
        orderAmount: "",
        orderState: ""
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    // 查询
    onSubmit() {
      // 判断是否填完整
      if (
        this.formInline.orderNo != "" &&
        this.formInline.consignee != "" &&
        this.formInline.phone != "" &&
        this.formInline.orderState != "" &&
        this.formInline.value1 != ""
      ) {
        API_ORDER_SEARCH(
          this.currentPage,
          this.pageSize,
          this.formInline.orderNo,
          this.formInline.consignee,
          this.formInline.phone,
          this.formInline.orderState,
          this.formInline.value1
        ).then(res => {
          this.tableData = res.data;
          // this.tableData.
        });
      } else {
        this.$message({
          message: "请将空余信息填完整！",
          type: "warning"
        });
      }
    },

    // 弹出编辑框
    orderEdit(row) {
      this.dialogFormVisible = true;
      this.editform.orderNo = row.orderNo;
      this.editform.orderTime = row.orderTime;
      this.editform.phone = row.phone;
      this.editform.consignee = row.consignee;
      this.editform.deliverAddress = row.deliverAddress;
      this.editform.deliveryTime = row.deliveryTime;
      this.editform.remarks = row.remarks;
      this.editform.orderAmount = row.orderAmount;
      this.editform.orderState = row.orderState;
      this.editform.id = row.id;
    },
    // 确认修改
    comfirmEdit() {
      // console.log(
      //   this.editform.id,
      //   this.editform.orderNo,
      //   this.editform.orderTime,
      //   this.editform.phone,
      //   this.editform.consignee,
      //   this.editform.deliverAddress,
      //   this.editform.deliveryTime,
      //   this.editform.remarks,
      //   JSON.stringify(this.editform.orderAmount),
      //   this.editform.orderState
      // );

      API_ORDER_EDIT(
        this.editform.id,
        this.editform.orderNo,
        this.editform.orderTime,
        this.editform.phone,
        this.editform.consignee,
        this.editform.deliverAddress,
        this.editform.deliveryTime,
        this.editform.remarks,
        JSON.stringify(this.editform.orderAmount),
        this.editform.orderState
      ).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.gettableData();
          this.dialogFormVisible = false;
          // console.log(res);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    //查看订单详情信息
    handleClick(row) {
      API_ORDERS_DETAEL(row.id).then(res => {
        // console.log(res);
        res
      });
      // console.log(row);
    },
    // 分页尺寸
    handleSizeChange(val) {
      this.pageSize = val;
      this.gettableData();
    },
    // 当前页面
    handleCurrentChange(val) {
      this.currentPage = val;
      this.gettableData();
    },
    //获取列表数据封装
    gettableData() {
      API_ORDERS_LIST(this.currentPage, this.pageSize).then(res => {
        // console.log(res);
        this.tableData = res.data.data;
        // 时间格式转换
        (Date.prototype.format = function(fmt) {
          //
          var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            S: this.getMilliseconds() //毫秒
          };
          if (/(y+)/.test(fmt))
            fmt = fmt.replace(
              RegExp.$1,
              (this.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
          for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
              fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                  ? o[k]
                  : ("00" + o[k]).substr(("" + o[k]).length)
              );
          return fmt;
        }),
          this.tableData.forEach(item => {
            item.orderTime = new Date(item.orderTime).format(
              "yyyy-MM-dd hh:mm:ss"
            );
            item.deliveryTime = new Date(item.deliveryTime).format(
              "yyyy-MM-dd hh:mm:ss"
            );
          });
      });
    }
  },
  created() {
    //获取列表数据
    this.gettableData();
  }
};
</script>

<style lang="less">
.order_mage {
  .el-form {
    width: 100%;

    .block {
      display: inline;
      margin-right: 20px;
      .el-range-editor.el-input__inner {
        margin-left: 20px;
      }
    }
  }
  .el-pagination {
    margin-top: 10px;
  }
}
</style>