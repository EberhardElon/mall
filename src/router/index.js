import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/goodsList'
import Cart from './../views/cart'
import AddressList from '../views/addressList'
import OrderConfirm from '@/views/orderConfirm'
import OrderSuccess from '@/views/orderSuccess'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList,
    },
    {
      path:'/cart',
      name:Cart,
      component:Cart
    },
    {
      path:'/address',
      name:AddressList,
      component:AddressList
    },
    {
      path:'/orderConfirm',
      name:OrderConfirm,
      component:OrderConfirm
    },
    {
      path:'/orderSuccess',
      name:OrderSuccess,
      component:OrderSuccess
    }
  ]
})
