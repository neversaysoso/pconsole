<template>
  <div class="earlywarn"
    v-loading.body="loading"
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
    <div class="fenge"></div>
    <el-table
      :data="getWarningResultArray"
      height="443"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="70">
      </el-table-column>
      <el-table-column
        prop="warningName"
        label="预警事件"
        width="500">
      </el-table-column>
      <el-table-column
        prop="hours1Count"
        label="近1小时">
      </el-table-column>
      <el-table-column
        prop="day1Count"
        label="近24小时">
      </el-table-column>
      <el-table-column
        prop="day7Count"
        label="近7天">
      </el-table-column>
      <el-table-column
        prop="allCount"
        label="总计">
      </el-table-column>
    </el-table>
    <div class="pagediv">
      <el-pagination
        @current-change="detailCurrentChange"
        :current-page="datailPageNo"
        layout="prev, pager, next, jumper"
        :total="datailTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import ajax from '../request/api.js'

export default {
  data: () => ({
    commonData: {},
    pickerOptions: {},
    getWarningResultArray: [],
    count: 0,
    datailTotal: 0,
    datailPageNo: 1,
    loading: false
  }),
  mounted () {
    this.getChardata({
      topic: this.$route.params.id,
      type: "4",
      page_no: 1,
      page_size: '10'
    })
  },
  methods: {
    detailCurrentChange(val){
      this.getChardata({
        topic: this.$route.params.id,
        type: "4",
        page_no: val,
        page_size: '10',
        start_time: this.commonData.time[0],
        end_time: this.commonData.time[1]
      })
    },
    timeChange(d){
      if(typeof d=='undefined' || d==''){
        this.count = 1
      }
      if(this.count != 1){
        this.getChardata({
          topic: this.$route.params.id,
          type: "4",
          start_time: d.split(' - ')[0],
          end_time: d.split(' - ')[1],
          page_no: 1,
          page_size: '10'
        })
      }else{
        this.count ++
      }
    },
    getChardata(obj){
      this.loading = true
      ajax('indexDetail.htm',obj).then(data => {
        this.commonData = {
          time: [obj.start_time ? obj.start_time : data.minDate , obj.end_time ? obj.end_time : data.maxDate]
        }
        this.pickerOptions = {
          disabledDate(time) {
            return time.getTime() > Date.parse(data.maxDate) || time.getTime() < Date.parse(data.minDate) - 8.64e7
          }
        }
        this.getWarningResultArray = data.getWarningResultArray
        this.datailTotal = data.total
        this.datailPageNo = obj.page_no
        this.count ++
        this.loading = false
      })
    }
  }
}
</script>