<template>
  <div class="cityinfo" 
    v-loading.body="charLoading"
    element-loading-text="拼命加载中">
    <div class="chartbody">
      <div class="timediv">
        <el-date-picker 
          v-model="commonData.time"
          type="daterange" 
          placeholder="选择日期范围" 
          @change="timeChange" 
          :picker-options="pickerOptions">
        </el-date-picker>
      </div>
      <div id="main" class="chars" style="height: 800px"></div>
    </div>
  </div>
</template>

<script>
import ajax from '../request/api.js'
import echarts from 'echarts'
import 'echarts/map/js/china.js'
import coordinate from '../assets/coordinate.js'

export default {
  data: () => ({
    commonData: {},
    pickerOptions: {},
    count: 0,
    charLoading: false
  }),
  mounted () {
    this.getChardata({
      topic: this.$route.params.id,
      type: "3"
    })
  },
  methods: {
    timeChange(d){
      if(typeof d=='undefined' || d==''){
        this.count = 1
      }
      if(this.count != 1){
        this.getChardata({
          topic: this.$route.params.id,
          type: "3",
          start_time: d.split(' - ')[0],
          end_time: d.split(' - ')[1]
        })
      }else{
        this.count++
      }
    },
    convertData(data){
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var geoCoord = coordinate[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          });
        }
      }
      return res;
    },
    getChardata(obj){
      this.charLoading = true
      ajax('indexDetail.htm',obj).then(data => {
        let [clientCityArray] = [Array.from(data.clientCityArray)]
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
          backgroundColor: '#404a59',
          title: {
            text: '访问分布示意图',
            x:'center',
            textStyle: {
              color: '#fff'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              return params.name + ' : ' + params.value[2];
            }
          },
          legend: {
            orient: 'vertical',
            y: 'bottom',
            x:'right',
            textStyle: {
              color: '#fff'
            }
          },
          visualMap: {
            min: 0,
            max: 10000,
            calculable: true,
            inRange: {
              color: ['#50a3ba', '#eac736', '#d94e5d']
            },
            textStyle: {
              color: '#fff'
            }
          },
          geo: {
            map: 'china',
            label: {
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                areaColor: '#323c48',
                borderColor: '#111'
              },
              emphasis: {
                areaColor: '#2a333d'
              }
            }
          },
          series: [{
            name: 'pm2.5',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: this.convertData(clientCityArray.map(({ num,_id }) => ({name: _id,value: num}))),
            symbolSize: 12,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              emphasis: {
                borderColor: '#fff',
                borderWidth: 1
              }
            }
          }]
        }
        let Chart = echarts.init(document.getElementById('main'));
        Chart.setOption(option);
        this.charLoading = false
      })
    }
  }
}
</script>