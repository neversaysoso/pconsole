<template>
  <div class="hello">
    <div class="toptip">{{commonData.commonMsg}}</div>
    <div class="flexcontent">
      <div class="leftdh" v-show="leftLoading">
        <div class="borderbottom">
          <el-tag type="primary">总访问量（次）</el-tag>
          <div class="darkblue">{{commonData.dataTatal}}</div>
          <el-tag type="primary">总数据量（G）</el-tag>
          <div class="darkblue">{{commonData.dataCount}}</div>
        </div>
        <div class="borderbottom">
          <el-tag type="success">新接入项目</el-tag>
          <span class="linkspan" style="float:right">
            <router-link to="/moreproject">更多 >></router-link>
          </span>
          <div>
            <div v-for="o in commonData.latelyArray" class="textitem">
              <el-button @click="getCity(o.topic)">{{o.name }}</el-button>
            </div>
          </div>
        </div>
        <div class="borderbottom" style="border: none">
          <el-tag type="danger">月用户活跃城市</el-tag>
          <div>
            <div v-for="o in commonData.cityArray" class="textitem">
                {{o._id }} 
                <span class="progresssp">
                  <el-progress :text-inside="true" :stroke-width="18" :percentage="o.proportion"></el-progress>
                </span>
            </div>
          </div>
        </div>
      </div>
      <div class="chartbody" 
        v-loading.body="charLoading"
        element-loading-text="拼命加载中">
        <el-tag type="warning">访问错误分析</el-tag>
        <div class="timediv">
          <el-date-picker 
            v-model="commonData.time"
            type="daterange" 
            placeholder="选择日期范围" 
            @change="timeChange" 
            :picker-options="pickerOptions">
          </el-date-picker>
          <div class="timetips">
            该时间段内共访问
            <span class="strong">{{commonData.total}}</span>
            次，访问成功率达
            <span class="strong">{{commonData.succcessRate}}</span>
          </div>
        </div>
        <div id="main" class="chars"></div>
      </div>
      <div class="rightbody">
        <el-tag type="warning" v-show="leftLoading">访问渠道分布</el-tag>
        <div id="qdchar" class="sxdiv"></div>
        <el-tag type="warning" v-show="leftLoading">项目类型访问分布</el-tag>
        <div id="projectchar" class="sxdiv"></div>
      </div>
    </div>
    <div class="tablediv"
      v-loading.body="loading"
      element-loading-text="拼命加载中">
      <el-tag type="success">预警项目清单</el-tag>
      <div class="fenge"></div>
      <el-table
        :data="tableData.warnRules"
        @row-click="tableclick"
        style="width: 100%;height: 442px">
        <el-table-column
          type="index"
          label="序号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="hospital"
          label="项目名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="title"
          label="预警">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间">
        </el-table-column>
      </el-table>
      <div class="pagediv">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="tableData.pageNo"
          layout="prev, pager, next, jumper"
          :total="tableData.sizeCount">
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
    count: 0,
    tableData: {},
    loading: false,
    charLoading: true,
    leftLoading: false
  }),
  mounted () {
    this.getData({
      start_time: '',
      end_time: ''
    })
    this.getTable({
      page_no: '1',
      page_size: '10'
    })
  },
  methods: {
    getCity(t){
      this.$router.push({
        path: `/detail/${t}/warninfo`
      })
    },
    tableclick(d){
      this.$router.push({
        path: `/detail/${d.topic}/warninfo`
      })
    },
    handleCurrentChange(val) {
      this.getTable({
        page_no: val,
        page_size: '10'
      })
    },
    timeChange(d){
      if(typeof d=='undefined' || d==''){
        this.count = 1
      }
      if(this.count != 1){
        this.getData({
          start_time: d.split(' - ')[0],
          end_time: d.split(' - ')[1]
        })
      }else{
        this.count++
      }
    },
    getTable(obj){
      this.loading = true
      ajax('getWarnRules.htm',obj).then(data => {
        this.tableData = {
          warnRules: data.warnRules,
          pageNo: data.pageNo,
          sizeCount: data.sizeCount
        }
        this.loading = false
      },function(){})
    },
    getData(obj){
      this.charLoading = true
      ajax('pconsoleIndex.htm',obj).then(data => {
        let [projectArray,channelArray,totalArray,warnArray] = [Array.from(data.projectArray),Array.from(data.channelArray),Array.from(data.totalArray),Array.from(data.warnArray)]
        let [common,arrayMsg] = [0,'其中'];
        for(let project of projectArray){
          common += project.num
          arrayMsg += `${project._id}项目${project.num}个，`
        }
        this.commonData = {
          commonMsg: `当前共接入${common}个项目，${arrayMsg.substring(0,arrayMsg.length-1)}`,
          dataTatal: data.dataTatal,
          dataCount: data.dataCount,
          latelyArray: data.latelyArray,
          cityArray: data.cityArray,
          time: [data.startTime,data.endTime],
          total: data.total,
          succcessRate: data.succcessRate
        }
        this.pickerOptions = {
          disabledDate(time) {
            return time.getTime() > Date.parse(data.maxDate) || time.getTime() < Date.parse(data.minDate) - 8.64e7
          }
        }
        this.count ++;
        //错误分析
        let erroroption = {
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
        let errorChart = echarts.init(document.getElementById('main'));
        errorChart.setOption(erroroption);

        //访问渠道
        let qdoption = {
          legend: {
            orient: 'vertical',
            left: 'left',
            data: channelArray.map(({id}) => id)
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series : [{
            name: '访问来源',
            type: 'pie',
            radius : '50%',
            center: ['50%', '60%'],
            data: channelArray.map(({num,id}) => ({name:id,value:num})),
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        };
        let qdChart = echarts.init(document.getElementById('qdchar'));
        qdChart.setOption(qdoption);

        let projectoption = {
          legend: {
            orient: 'vertical',
            left: 'left',
            data: projectArray.map(({_id}) => _id)
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series : [{
            name: '访问来源',
            type: 'pie',
            radius : '50%',
            center: ['50%', '60%'],
            data: projectArray.map(({num,_id}) => ({name:_id,value:num})),
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        };
        let projectChart = echarts.init(document.getElementById('projectchar'));
        projectChart.setOption(projectoption);
        this.charLoading = false
        this.leftLoading = true
      },function(){});
    }
  }
}
</script>