import Vue from 'vue'
import VueRouter from 'vue-router'
import TransactionsList from '@/components/transaction-list.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'TransactionsList',
    component: TransactionsList
  },
]

const router = new VueRouter({
  routes
})

export default router
