<template>
  <div class="homgpage">
    <div class="imgbox">
      <img src="../../assets/img/1.jpg" alt />
      <img src="../../assets/img/2.jpg" alt />
      <img src="../../assets/img/3.jpg" alt />
      <img src="../../assets/img/4.jpg" alt />
    </div>
    <el-card class="box-card">
      <div class="text item">
        <div id="main" style="width: 1000px;height:450px; margin:0 auto"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { API_TOTAL_DATA } from "@/api/apis";
import echarts from "echarts";
export default {
  data() {
    return {
      // amountData: (7) [220, 282, 191, 234, 290, 330, 310]
      // orderData: (7) [120, 132, 101, 134, 90, 230, 210]
      // todayOrder: 189
      // totalAmount: 202466
      // totalOrder: 5486
      // totayAmount: 2189
      // xData: (7) ["2019/11/17", "2019/11/18", "2019/11/19", "2019/11/20", "2019/11/21", "2019/11/22", "2019/11/23"]
    };
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    API_TOTAL_DATA().then(res => {
      // console.log(res);
      // 绘制图表
      myChart.setOption({
        title: {
          text: "折线图堆叠"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["订单数据", "金额数据"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: res.data.xData
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "订单数据",
            type: "line",
            stack: "总量",
            data: res.data.orderData
          },
          {
            name: "金额数据",
            type: "line",
            stack: "总量",
            data: res.data.amountData
          }
        ]
      });
    });
  }
};
</script>

<style lang="less" scoped>
.homgpage {
  .imgbox {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    img {
      width: 280px;
    }
  }
}
</style>