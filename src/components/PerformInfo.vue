<template>
  <div class="performinfo">
    <div class="chartbody" 
      v-loading.body="charLoading"
      element-loading-text="拼命加载中">
      <div class="timediv">
        <el-date-picker 
          v-model="commonData.time"
          type="daterange" 
          placeholder="选择日期范围" 
          @change="timeChange" 
          :picker-options="pickerOptions">
        </el-date-picker>
      </div>
      <div id="main" class="chars"></div>
    </div>
    <el-tag type="primary">耗时记录</el-tag>
    <div class="tablediv"
      v-loading.body="tabelLoading"
      element-loading-text="拼命加载中">
      <el-table
        :data="costTimeInfoArray"
        @row-click=""
        style="width: 100%;height: 482px">
        <el-table-column
          type="index"
          label="序号"
          width="70">
        </el-table-column>
        <el-table-column
          prop="api_name"
          label="接口名称"
          width="370">
        </el-table-column>
        <el-table-column
          prop="num"
          label="次数">
        </el-table-column>
        <el-table-column
          prop="date"
          label="请求时间">
        </el-table-column>
        <el-table-column
          prop="cost_time_min"
          label="最小耗时"
          width="120">
        </el-table-column>
        <el-table-column
          prop="cost_time_avg"
          label="平均耗时"
          width="120">
        </el-table-column>
        <el-table-column
          prop="cost_time_max"
          label="最大耗时"
          width="120">
        </el-table-column>
      </el-table>
      <div class="pagediv">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ajax from '../request/api.js'
import echarts from 'echarts'

export default {
  data: () => ({
    commonData: {},
    pickerOptions: {},
    costTimeInfoArray: [],
    count: 0,
    pageNo: 1,
    total: 0,
    charLoading: false,
    tabelLoading: false
  }),
  mounted () {
    this.getChardata({
      topic: this.$route.params.id,
      type: "2"
    })
    this.getTimeInfodata({
      topic: this.$route.params.id,
      page_no: '1',
      page_size: '10'
    })
  },
  methods: {
    handleCurrentChange(val){
      this.getTimeInfodata({
        topic: this.$route.params.id,
        page_no: val,
        page_size: '10'
      })
    },
    timeChange(d){
      if(typeof d=='undefined' || d==''){
        this.count = 1
      }
      if(this.count != 1){
        this.getChardata({
          topic: this.$route.params.id,
          type: "2",
          start_time: d.split(' - ')[0],
          end_time: d.split(' - ')[1]
        })
      }else{
        this.count++
      }
    },
    getChardata(obj){
      this.charLoading = true
      ajax('indexDetail.htm',obj).then(data => {
        let [performanceArray] = [Array.from(data.performanceArray)]
        this.commonData = {
          time: [obj.start_time ? obj.start_time : data.minDate , obj.end_time ? obj.end_time : data.maxDate]
        }
        this.pickerOptions = {
          disabledDate(time) {
            return time.getTime() > Date.parse(data.maxDate) || time.getTime() < Date.parse(data.minDate) - 8.64e7
          }
        }
        this.count ++;
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#283b56'
              }
            }
          },
          legend: {
            data:['最小耗时','平均耗时','最大耗时']
          },
          xAxis: {
            data: performanceArray.map(({date}) => date)
          },
          yAxis: {},
          series: [{
            name: '最小耗时',
            type: 'line',
            data: performanceArray.map(({cost_time_min}) => cost_time_min)
          },{
            name: '平均耗时',
            type: 'line',
            data: performanceArray.map(({cost_time_avg}) => cost_time_avg)
          },{
            name: '最大耗时',
            type: 'line',
            data: performanceArray.map(({cost_time_max}) => cost_time_max)
          }]
        }
        let Chart = echarts.init(document.getElementById('main'));
        Chart.setOption(option);
        this.charLoading = false
      })
    },
    getTimeInfodata(obj){
      this.tabelLoading = true
      ajax('costTimeInfo.htm',obj).then(data => {
        this.total = data.costTimeCount
        this.costTimeInfoArray = data.costTimeInfoArray
        this.tabelLoading = false
      })
    }
  }
}
</script>