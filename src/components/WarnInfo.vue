<template>
  <div class="warninfo">
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
    <el-tag type="primary">错误信息</el-tag>
    <div class="fenge"></div>
    <div class="fixtabel">
      <div class="lefttabel" 
        style="width: 500px;"
        v-loading.body="warnLoading"
        element-loading-text="拼命加载中">
        <el-table
          :data="warningInfoArray"
          @row-click="showDetail"
          style="width: 100%;">
          <el-table-column
            type="index"
            label="序号"
            width="70">
          </el-table-column>
          <el-table-column
            prop="total"
            label="数量"
            width="100">
          </el-table-column>
          <el-table-column
            prop="_id"
            label="错误信息">
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
      <div v-loading.body="warnDetailLoading"
        element-loading-text="拼命加载中">
        <div class="warndetail">
          <div class="warndetaillist" v-for="i in warningDetailArray">
            <div>
              <span>报错接口：</span>{{i.apiName}} 
            </div>
            <div>
              <span>时间：</span>{{i.time}}
            </div>
            <div><span>错误信息：</span>{{i.failureReason}}</div>
            <div><span>入参：</span>{{i.intputData.input}}</div>
            <div><span>出参：</span>{{i.outputData.output}}</div>
          </div>
        </div>
        <div class="pagediv">
          <el-pagination
            @current-change="detailCurrentChange"
            :current-page="datailPageNo"
            layout="prev, pager, next, jumper"
            :total="datailTotal">
          </el-pagination>
        </div>
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
    warningInfoArray: [],
    warningDetailArray: [],
    charLoading: false,
    warnLoading: false,
    warnDetailLoading: false,
    count: 0,
    pageNo: 1,
    datailPageNo: 1,
    total: 0,
    datailTotal: 0,
    failureReason: ''
  }),
  mounted () {
    this.getChardata({
      topic: this.$route.params.id,
      type: "1"
    })
    this.getWarnInfodata({
      topic: this.$route.params.id,
      page_no: 1,
      page_size: '10'
    })
    this.getWarnDetaildata({
      topic: this.$route.params.id,
      page_no: 1,
      page_size: '10'
    })
  },
  methods: {
    showDetail(d){
      this.failureReason = d._id
      this.getWarnDetaildata({
        topic: this.$route.params.id,
        page_no: 1,
        page_size: '10',
        failure_reason: this.failureReason
      })
    },
    handleCurrentChange(val){
      this.getWarnInfodata({
        topic: this.$route.params.id,
        page_no: val,
        page_size: '10'
      })
    },
    detailCurrentChange(val){
      this.getWarnDetaildata({
        topic: this.$route.params.id,
        page_no: val,
        page_size: '10',
        failure_reason: this.failureReason
      })
    },
    timeChange(d){
      if(typeof d=='undefined' || d==''){
        this.count = 1
      }
      if(this.count != 1){
        this.getChardata({
          topic: this.$route.params.id,
          type: "1",
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
        let [totalArray,warnArray] = [Array.from(data.totalArray),Array.from(data.warnArray)]
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
            data:['总次数','失败次数']
          },
          xAxis: {
            data: totalArray.map(({_id})=>_id)
          },
          yAxis: {},
          series: [{
            name: '总次数',
            type: 'line',
            data: totalArray.map(({total}) => total)
          },{
            name: '失败次数',
            type: 'line',
            data: warnArray.map(({total}) => total)
          }]
        }
        let Chart = echarts.init(document.getElementById('main'));
        Chart.setOption(option);
        this.charLoading = false
      })
    },
    getWarnInfodata(obj){
      this.warnLoading = true
      ajax('warnInfo.htm',obj).then(data => {
        this.total = data.warnCount
        this.warningInfoArray = data.warningInfoArray
        this.warnLoading = false
      })
    },
    getWarnDetaildata(obj){
      this.warnDetailLoading = true
      ajax('warningDetail.htm',obj).then(data => {
        this.datailTotal = data.warnCount
        this.warningDetailArray = data.warningDetailArray
        this.datailPageNo = obj.page_no
        this.warnDetailLoading = false
      })
    }
  }
}
</script>

<style lang="less">
  .fixtabel{
    position: relative;
    height: 600px;
    padding-left: 550px;
    width: 100%;
    .lefttabel{
      position: absolute;
      left: 0px;
      top: 0px;
      width: 500px;
      height: 600px;
    }
    .warndetail{
      width: 100%;
      height: 450px;
      border: #e3e3e3 solid 1px;
      padding: 30px;
      overflow: auto;
      .warndetaillist{
        line-height: 25px;
        font-size: 16px;
        border-bottom: #e3e3e3 solid 1px;
        margin-bottom: 15px;
        &>div{
          margin-bottom: 15px;
          word-break: break-all;
          &>span{
            display: inline-block;
            color: #FF4949
          }
        }
      }
    }
  }
</style>