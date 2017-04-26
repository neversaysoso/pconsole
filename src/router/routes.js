//懒加载
const lazyload = (name) => (resolve) => require([`@/components/${name}`], resolve)

const routes = [{
  path: '/',
  name: 'Hello',
  meta: { title: '首页' },
  component: lazyload('Hello')
}, {
  path: '/detail/:id',
  name: 'Details',
  component: lazyload('Details'),
  children: [{
    path: 'warninfo',
    meta: { title: '错误分析' },
    component: lazyload('WarnInfo')
  }, {
    path: 'performinfo',
    meta: { title: '性能分析' },
    component: lazyload('PerformInfo')
  }, {
    path: 'cityinfo',
    meta: { title: '访问分布' },
    component: lazyload('CityInfo')
  }, {
    path: 'earlywarn',
    meta: { title: '预警记录' },
    component: lazyload('EarlyWarn')
  }]
}, {
  path: '/moreproject',
  name: 'MoreProject',
  meta: { title: '全部项目' },
  component: lazyload('MoreProject')
}]

export default routes