import Vue from 'vue'
import VueRouter from 'vue-router'
import TransactionsList from '@/components/transaction-list.vue'
import AboutView from '@/views/AboutView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'TransactionsList',
    component: TransactionsList,
    meta: { title: "Inicio" }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
     meta: { title: "About" }
  }
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

export default router
