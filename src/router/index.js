import Vue from 'vue'
import Router from 'vue-router'

const Hello = resolve => require(['@/components/Hello'], resolve)
const Details = resolve => require(['@/components/Details'], resolve)
const WarnInfo = resolve => require(['@/components/WarnInfo'], resolve)
const PerformInfo = resolve => require(['@/components/PerformInfo'], resolve)
const CityInfo = resolve => require(['@/components/CityInfo'], resolve)
const EarlyWarn = resolve => require(['@/components/EarlyWarn'], resolve)
const MoreProject = resolve => require(['@/components/MoreProject'], resolve)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    }, {
      path: '/detail/:id',
      name: 'Details',
      component: Details,
      children: [{
        path: 'warninfo',
        component: WarnInfo
      }, {
        path: 'performinfo',
        component: PerformInfo
      }, {
        path: 'cityinfo',
        component: CityInfo
      }, {
        path: 'earlywarn',
        component: EarlyWarn
      }]
    }, {
      path: '/moreproject',
      name: 'MoreProject',
      component: MoreProject
    }
  ]
})
