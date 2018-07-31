/**
 * @author jeff
 * @date 2017-6
 * @desp  vuex+vue-router+vue . 简单的搭建.
 *      按需加载 router,filter,directive分模块存放后期优化.
 *      组件库的
 */


import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import app from './App'
import router from './router'
import store from './store'

import util from './api/common'


// Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueRouter)

//全局组件...
import infinite from './components/infiniteScroll'
import backScroll from './components/backScroll'
import loading from './components/loading'
import tip from "./components/tip"
Vue.component( backScroll.name, backScroll)
Vue.component( infinite.name, infinite)
Vue.component( loading.name, loading)
Vue.component(tip.name,tip)

Vue.config.devtools = true

// 指令和过滤器可以提取出单独的文件....
//_*________________________________全局指令______________________________________*_

Vue.directive("imgError",{
  bind: function (el, binding, vnode) {
    var default_value=util.isEmpty(binding.value) ? png404 : binding.value;
    var src_value = $(el).attr("src");

    if (util.isEmpty(src_value)) {
      $(el).attr("src",default_value);
    }
    $(el).on("error",function(e){
      $(this).attr("src",default_value);
    })
  },
  update:function(el, binding, vnode) {
    var default_value=util.isEmpty(binding.value) ? png404 : binding.value;
    var src_value = $(el).attr("src");

    if (util.isEmpty(src_value)) {
      $(el).attr("src",default_value);
    }
    $(el).on("error",function(e){
      $(this).attr("src",default_value);
    })
  }
})
/* eslint-disable no-new */

//_*________________________________全局过滤器______________________________________*_

/* 格式化2位小数点 */
Vue.filter("FloatTwo",function(value){
  var result = parseFloat(isNaN(value) ? 0 : value).toFixed(2);
  return result;
});
Vue.filter("lyqNum",function(value) {
  var result = parseFloat(isNaN(value) ? 0 : value).toFixed(2);
  result = Math.ceil(result);
  //console.log(result,"lyqNum");
  return result;
})

/* 格式化日期为 m.d-m.d */
Vue.filter("onlyDate", function (value) {
  if (!value) return ''
  var dValue = value.split(/[- :]/);  // for android and ios...
  var month = dValue[1] || "--";
  var day = dValue[2] || "--";
  return  month + "."+day;
});

/**
 *  阿拉伯数字转换中文数字,
 *  该方法需要优化算法....,假设 11,12,13这些的数字转为问题, 百位数等等，留待以后优化.
 **/
Vue.filter("toChineseNumber", function(value){
  var result = "";
  if(value == "") {
    return ""
  } else {
    switch(value) {
      case 0 :
        result = "一";
        break;
      case 1 :
        result = "一";//"二";
        break;
      case 2 :
        result = "二";//"三";
        break;
      case 3 :
        result = "三";//"四";
        break;
      case 4 :
        result = "四";//"五";
        break;
      case 5 :
        result = "五";//"六";
        break;
      case 6 :
        result = "六";//"七";
        break;
      case 7 :
        result = "七";//"八";
        break;
      case 8 :
        result = "八";//"九";
        break;
      case 9 :
        result = "九";//"十";
        break;
    }
  }
  return result;
}
);

//_*____________________________________store 状态_________________________________________*_
router.beforeEach((to, from, next) => {
  // to 和 from 都是 路由信息对象
  router.toUrl=to.path
  router.from=from.path
  console.log("from:"+from.path)
  next();
})


new Vue({
  el: '#app',
  mode: 'history',//'hash'则一切正常
  router,
  store,
  created: function () {
    // `this` 指向 vm 实例
  },
  template: '<app/>',
  components: { app }
})
