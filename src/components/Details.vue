<template>
  <div class="detail">
    <div class="title">
      {{yesterdayData.topicName}}
      <span class="linkspan">
        <router-link to="/moreproject">更多项目</router-link>
      </span>
      <span class="linkspan" style="float:right">
        <router-link to="/">返回首页</router-link>
      </span>
    </div>
    <el-tag type="primary">昨日概况</el-tag>
    <div class="fenge"></div>
    <el-table
      :data="[yesterdayData]"
      style="width: 100%">
      <el-table-column
        prop="num"
        label="访问次数">
      </el-table-column>
      <el-table-column
        prop="count"
        label="失败率">
      </el-table-column>
      <el-table-column
        prop="cost_time_avg"
        label="平均耗时（毫秒）">
      </el-table-column>
      <el-table-column
        prop="cost_time_min"
        label="最小耗时（毫秒）">
      </el-table-column>
      <el-table-column
        prop="cost_time_max"
        label="最大耗时（毫秒）">
      </el-table-column>
      <el-table-column
        prop="error_num"
        label="错误信息量（次）">
      </el-table-column>
      <el-table-column
        prop="ip_num"
        label="IP访问次数">
      </el-table-column>
    </el-table>
    <div class="fenge"></div>
    <el-tag type="primary">指标详解</el-tag>
    <div class="fenge"></div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="错误分析" name="warninfo"></el-tab-pane>
      <el-tab-pane label="性能分析" name="performinfo"></el-tab-pane>
      <el-tab-pane label="访问分布" name="cityinfo"></el-tab-pane>
      <el-tab-pane label="预警记录" name="earlywarn"></el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
import ajax from '../request/api.js'
export default {
  data: () => ({
    yesterdayData: {},
    activeName: ''
  }),
  mounted () {
    this.activeName = this.$route.path.split('/')[3]
    this.getYesterday({
      topic: this.$route.params.id
    })
  },
  watch: {
    "$route": "setTab"
  },
  methods: {
    setTab(){
      this.activeName = this.$route.path.split('/')[3]
    },
    handleClick(tab, event) {
      let detailArray = ['warninfo','performinfo','cityinfo','earlywarn']
      this.$router.push({
        path: `/detail/${this.$route.params.id}/${detailArray[tab.index]}`
      })
    },
    getYesterday(obj){
      ajax('pconsoleTopicYesterDay.htm',obj).then(data => {
        this.yesterdayData = data
        this.yesterdayData.count = `${Number((data.error_num / data.num)*100).toFixed(1)}%`
      })
    },
    getChardata(obj){
      ajax('indexDetail.htm',obj).then(data => {
        console.log(data)
      })
    }
  }
}
</script>

<style lang="scss">
  .title {
    color: #1D8CE0;
    font-size: 20px;
    margin-bottom: 20px;
    .linkspan {
      font-size: 16px;
      margin-left: 10px;
    }
  }  
</style>