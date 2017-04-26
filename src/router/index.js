import Vue from 'vue'
import Router from 'vue-router'
import { changeTitle } from '@/util'
import routes from './routes'

Vue.use(Router)

const router = new Router({
  routes
})

router.afterEach(route => {
  // change the title when the route changes
  changeTitle(route.meta.title)
  // change home nav state
  // if (/home/.test(route.path) && route.path.split('/').length === 3) {
  //   const nav = route.path.split('/')[2]
  //   router.app.$store.commit('HOME_NAV', nav)
  // }
})

export default router

