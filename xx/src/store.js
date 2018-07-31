import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/**
 * @desp 数据状态管理, 需要去做的是:
 * 1,商城-商品信息  for order
 * 2,生成的订单信息  order,  for multiple pages or multiple routers
 *          页面刷新后store就没有了,  还需要有其他方式获取到, 比如orderId, orderNo查询后台接口,存储在本地....
 * 3,付款信息
 * @type {Store}
 */


const store = new Vuex.Store({
  state: {
    orderInfo:{
      goodsId:0,
      name: "",
      attrInfo:{},
      picUrl : "",
      price:0.00,
      nums:1,
      deliveryFee:0,
      deliveryInfo:"",
      amount:0.00  //总价.
    },
    payFlowNo:"",    //for 查询状态.....
    newOrderNo:""    //for confirmOrder.vue里.
  },
  getters: {
    getOrderInfo: state => {
      return state.orderInfo
    },
    getNewOrderNo : state =>{
      return state.newOrderNo;
    },
    getPayFlowNo : state => {
      return state.payFlowNo;
    }
  },
  mutations: {
    setPayFlowNo(state,payload){
      //console.log("状态管理更新payFlowNo",payload);
      state.payFlowNo = payload;
    },
    setOrderInfo (state,payload) {
      //console.log("store 更新",JSON.stringify(payload));
      state.orderInfo.goodsId = payload.goodsId;
      state.orderInfo.name = payload.name;
      state.orderInfo.attrInfo = payload.attrInfo;
      state.orderInfo.picUrl = payload.picUrl;
      state.orderInfo.price = payload.price;
      state.orderInfo.nums = payload.nums;
      state.orderInfo.orderAmt = state.orderInfo.price * state.orderInfo.nums;
      state.orderInfo.amount = state.orderInfo.price * state.orderInfo.nums;
      state.orderInfo.deliveryFee = payload.deliveryFee || 0;
      state.orderInfo.deliveryInfo = payload.deliveryInfo || "普通快递";


      state.orderInfo.userName = payload.userName ?  payload.userName : "";
      state.orderInfo.phone = payload.phone ? payload.phone : "";
      state.orderInfo.province = payload.province ? payload.province  : "";
      state.orderInfo.city = payload.city ? payload.city  : "";
      state.orderInfo.district = payload.district ? payload.district  : "";
      state.orderInfo.detail = payload.detail ? payload.detail  : "";
      state.orderInfo.orderType = payload.orderType ? payload.orderType  : "";

      //console.log("store 更新后",JSON.stringify(state.orderInfo));
    },
    setNewOrderNo(state,orderno){
      //console.log("状态管理更新了newOrderNo",orderno);
      state.newOrderNo = orderno;
    },
    getOrderInfo(){
      return state.orderInfo;
    }
  }
})

export default store;
