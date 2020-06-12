<template>
  <div class="Orders_statistics">
    <div class="block">
      <span class="demonstration">选择时间</span>
      <el-date-picker
        v-model="value"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy年MM月dd日HH小时mm分钟ss秒"
        value-format="yyyy-MM-dd HH:mm:ss"
      ></el-date-picker>
      <el-button type="primary">查询</el-button>
    </div>

    <el-card class="box-card">
      <div class="text item">
        <div id="main" style="width: 1000px;height:450px; margin:0 auto"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { API_ORDER_DATA } from "@/api/apis";
import echarts from "echarts";
export default {
  data() {
    return {
      data: [],
      value: ["2019-10-01 00:00:00", "2020-10-10 00:00:00"]
    };
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    API_ORDER_DATA(JSON.stringify(this.value)).then(res => {
      // console.log(res);
      this.data = res.data.data;
      //时间格式转换
      Date.prototype.format = function(fmt) {
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
      };
      let t = this.data.map(item => {
        return (item.orderTime = new Date(item.orderTime).format(
          "yyyy-MM-dd hh:mm:ss"
        ));
      });

      let orderAmount = this.data.map(item => {
        return item.orderAmount;
      });
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ["订单金额"]
        },
        xAxis: [
          {
            type: "category",
            data: t,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "订单金额",
            min: 0,
            max: 200,
            interval: 50,
            axisLabel: {
              formatter: "{value} 元"
            }
          }
        ],
        series: [
          {
            name: "蒸发量",
            type: "line",
            data: orderAmount
          }
        ]
      });
    });
  }
};
</script>

<style lang="less">
.Orders_statistics {
  .block {
    padding-bottom: 10px;
    .el-range-editor {
      margin: 0px 10px 0px 10px;
    }
  }
}
</style>