<template>
  <div class="moreproject">
		<div class="title">
			项目清单
			<span class="linkspan" style="float:right">
        <router-link to="/">返回首页</router-link>
      </span>
		</div>
    <el-form :inline="true" :model="formInline">
			<el-form-item label="项目名称">
				<el-input v-model="formInline.project" placeholder="项目名称"></el-input>
			</el-form-item>
			<el-form-item label="项目类型">
				<el-select v-model="formInline.region" placeholder="请选择">
					<el-option :key="item"
						v-for="item in options"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">查询</el-button>
			</el-form-item>
    </el-form>
		<div v-loading.body="loading"
			element-loading-text="拼命加载中">
			<el-table
				:data="projectList"
				@row-click="tableclick"
				style="width: 100%;height: 443px">
				<el-table-column
					type="index"
					label="序号"
					width="70">
				</el-table-column>
				<el-table-column
					prop="name"
					label="项目名称">
				</el-table-column>
				<el-table-column
					prop="prtype"
					label="项目类型"
					width="150">
				</el-table-column>
				<el-table-column
					prop="join_date"
					label="项目接入时间"
					width="150">
				</el-table-column>
				<el-table-column
					prop="total"
					label="接口访问总次数"
					width="200">
				</el-table-column>
				<el-table-column
					prop="successRate"
					label="成功率"
					width="100">
				</el-table-column>
			</el-table>
			<div class="pagediv">
				<el-pagination
					@current-change="currentChange"
					:current-page="pageNo"
					layout="prev, pager, next, jumper"
					:total="pageTotal">
				</el-pagination>
			</div>
		</div>
  </div>
</template>

<script>
import ajax from '../request/api.js'
import R from 'ramda'

export default {
  data: () => ({
    formInline: {
			project: '',
			region: '',
		},
		options:[],
		projectList: [],
		pageTotal: 0,
		pageNo: 1,
		loading: true
  }),
  mounted () {
    this.getProject({
			page_no: 1,
      page_size: '10'
		})
  },
  methods: {
		tableclick(d){
			this.$router.push({
        path: `/detail/${d.topic}/warninfo`
      })
		},
		currentChange(val) {
			this.getProject({
				name: this.formInline.project,
				option: `${this.formInline.region}`,
				page_no: val,
				page_size: '10'
			})
		},
		onSubmit() {
			this.getProject({
				name: this.formInline.project,
				option: `${this.formInline.region}`,
				page_no: 1,
				page_size: '10'
			})
		},
    getProject(obj){
			this.loading = true
      ajax('moreItemJoinInfo.htm',obj).then(data => {
				let projectList = []
				this.options = [{label:'全部',value:'-1'},...data.map(({type},index) => ({label:type,value:index}))]
				for(let i of data){
					for(let m of i.array){
						m.prtype = i.type
						m.successRate = `${m.successRate}%`
					}
					projectList = [...projectList,...i.array]
				}
				
				if(typeof obj.option != 'undefined' && obj.option != ''){
					if(obj.option != -1)
						projectList = data[obj.option].array
				}

				if(obj.name != '' && typeof obj.name != 'undefined'){
					projectList = R.filter( m => m.name.indexOf(obj.name) != -1)(projectList)
				}

				projectList = R.sortBy(R.prop('join_date'))(projectList)

				this.pageTotal = projectList.length
				this.pageNo = obj.page_no
				this.projectList = R.splitEvery(obj.page_size)(projectList)[obj.page_no-1]
				this.loading = false
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