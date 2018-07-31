import Vue from 'vue'
import Router from 'vue-router'

import api from "./api/data";
// views..
import mall from './mall'
import mallList from './views/mallList'
import goodDetail from './views/goodDetail'
import payStatus from './views/payStatus'
import shop from './views/shop'
//订单模块.
import order from './views/myOrder'
import orderConfirm from './views/orderConfirm'
import orderDetail from './views/myOrderDetail'
//用户模块
import user from './views/user'

//地址模块
import address from './views/address';
import addAddr from "./views/addressAdd"

Vue.use(Router)


//terminal = 4 , //
const router = new Router({
  mode: 'hash',
  routes: [
    {
      path:'/',
      component: mall,
    },
    {
      path: '/mall',   //guessType ,热门竞猜,常规竞猜,系列竞猜.,gameCode,游戏类型.
      component: mall,
      name: 'mall'
    },
    {
      path: '/mallList',
      component:mallList,
      name:'mallList'
    },
    {
      path: '/goodDetail/:goodId',
      component:goodDetail,
      name:'goodDetail'
    },
    {
      path:'/orderConfirm/:orderNo/:catId',
      component:orderConfirm,
      name:'orderConfirm'
    },
    {
      path:'/payStatus/:orderNo/:payType',
      component:payStatus,
      name:'payStatus'
    },
    {
      path:'/shop/:shopId',
      component:shop,
      name:'shop'
    },
    {
      path:'/order',
      component:order,
      name:'order'
    },
    {
      path:'/orderDetail/:id',
      component:orderDetail,
      name:'orderDetail'
    },
    {
      path:'/user',
      component:user,
      name:'user',
      // beforeEnter: (to, from, next) => {
      //   // next({path:'/user',query:{t:new Date().getTime()}});
      //   next();
      // }
    },

    //地址管理
    {
      path:'/address',
      component:address,
      name:'address',
      // children:[
      //   { path:'', component: address},
      //   { path:'add', component: addAddr}
      // ]
    },
    {
      path:"/addAddr",
      component:addAddr,
      name:'addAddr'
    }
  ]
})

/**
 * 全局判断是否登录....


router.beforeEach((to, from, next) => {
  alert("from"+JSON.stringify(from));
  alert("to"+JSON.stringify(to));
//   //console.log("全局路由导航:",to,from,next);
//   // api.isLogin().then(function(data){
//   //   //console.log("是否登录了",JSON.stringify(data));
//   //   if (data.status == 200) {
//   //     var resultCode = data && data.data && data.data.result;
//   //     if (resultCode == 0) {
//   //       next();
//   //     } else {
//   //       window.location.href = api.getCommonConfig("loginUrl");
//   //     }
//   //   } else {
//   //     next();
//   //   }
//   // })
  next();
}) **/
export default router
