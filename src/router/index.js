import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import List from '@/components/List'
import SimpleYotta from '@/examples/SimpleYotta'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/to-do',
      name: 'ToDo',
      component: List
    },
    {
      path: '/simple-yotta',
      name: 'SimpleYotta',
      component: SimpleYotta
    }
  ]
})
