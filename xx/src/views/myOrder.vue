<template>
  <div class="my-order">
    <header class="header-wrapper">
      <div class="left" v-on:click="back()">
        <i class="icon icon-back"></i>
        <div class="name">返回</div>
      </div>
      <div class="title">我的订单</div>
    </header>

    <div class="my-content">
      <div class="infos" v-if="business.orders.length == 0">
        {{support.infos}}
      </div>
      <div class="opt-list" v-if="business.orders.length > 0">
        <div class="opt-item" v-for="item in business.orders">
          <div class="item-title-bar">
            <div class="bar-left">
              <!--<i class="icon icon-shop"></i>-->
              <img v-bind:src="item.shop.logoUrl" class="shop-logo"></img>
              <div class="name">{{item.shop.name}}</div>
            </div>
            <div class="bar-right" v-if="item.order.status==201">等待付款</div>
            <div class="bar-right" v-if="item.order.status==202">等待商家发货</div>
            <div class="bar-right" v-if="item.order.status==203">等待确认收货</div>
            <div class="bar-right" v-if="item.order.status==204">交易完成</div>
            <div class="bar-right" v-if="item.order.status==205">交易关闭</div>
            <div class="bar-right" v-if="item.order.status==206">退款中</div>
            <div class="bar-right" v-if="item.order.status==207">退款成功</div>
          </div>
          <router-link :to="{name:'orderDetail',params:{id:item.order.id}}" tag="div" class="item-body"
                       v-for="orderGoodItem in item.orderGoods">
            <div class="item-body-left">
              <img v-bind:src="item.orderGoods[0].orderGoods.snapshot.picUrl"/>
            </div>
            <div class="item-body-mid">
              <div class="good-name">{{orderGoodItem.orderGoods.snapshot.name}}</div>
              <div class="good-spec">
              	<span v-if="orderGoodItem.attrs.length<=0">
              		数量：
              	</span>
                <span v-else v-for="attrItem in orderGoodItem.attrs">
                  {{attrItem.attrName}}:{{attrItem.attrDetailName}}
                </span>
              </div>
              <div class="good-delivery" v-if="item.delivery != null">配送:普通快递<!--{{item.delivery.name}}--></div>
              <div class="good-delivery" v-if="item.delivery == null">配送:{{orderGoodItem.orderGoods.snapshot.catId==1?'普通快递':'虚拟发货'}}</div>
            </div>
            <div class="item-body-right">
              <div class="all-money">￥{{orderGoodItem.orderGoods.price}}</div>
              <div class="nums">x {{orderGoodItem.orderGoods.quantity}}</div>
              <div class="dfee" v-if="orderGoodItem.orderGoods.deliveryFee>0&&orderGoodItem.orderGoods.snapshot.catId==1">￥{{orderGoodItem.orderGoods.deliveryFee}}</div>
              <div class="dfee" v-if="orderGoodItem.orderGoods.deliveryFee==0&&orderGoodItem.orderGoods.snapshot.catId==1">包邮</div>
            </div>
          </router-link>

          <div class="item-body-foot">
            {{item.order.createTime}}
          </div>
          <div class="item-foot">
            <div class="all-desp">
              共 {{item.orderGoods[0].orderGoods.quantity}}&nbsp;件商品&nbsp;实际支付: {{item.order.payTypeId == 3 ? (item.order.payAmt+' 乐盈券') : ('￥'+item.order.orderAmt)}}
            </div>
            <div class="opt-btn">
              <ul class="btns" v-if="item.order.status == 201">
                <!-- 201:等待付款;等待付款（配置联系商家、取消订单、立即付款按钮），超过30分钟未付款，则订单状态修改为交易关闭 -->
                <li class="btn btn-phone" v-on:click="callSeller()">
                  <a v-bind:href="'tel:'+item.shop.servicePhone">联系商家</a>
                  <!--<a v-bind:href="'tel:'+business.orderInfo.goods[0].gds.shop.phone">联系商家</a>-->
                </li>
                <li class="btn btn-cancel" v-on:click="cancelOrder(item.order.id)">取消订单</li>
                <li class="btn btn-pay" v-on:click="payOrder(item,item.order.orderNo)">立即付款</li>
              </ul>
              <ul class="btns" v-if="item.order.status == 202">
                <!--202:完成付款,等待发货;-->
                <li class="btn btn-phone" v-on:click="callSeller()">
                  <a v-bind:href="'tel:'+item.shop.servicePhone">联系商家</a>
                </li>
                <li class="btn btn-phone btn-yellow" v-on:click="refund(item.order.id)">我要退款</li>
              </ul>
              <ul class="btns" v-if="item.order.status == 203">
                <!--
                203:已发货; 等待确认收货（配置联系商家、确认收货按钮）
                等待确认收货（配置联系商家、确认收货按钮）
                -->
                <li class="btn btn-phone" v-on:click="callSeller()">
                  <a v-bind:href="'tel:'+item.shop.servicePhone">联系商家</a>
                </li>
                <li class="btn btn-confirm-good btn-yellow" v-on:click="confirmGood(item.order.id)">确认收货</li>
              </ul>
              <ul class="btns" v-if="item.order.status == 204">
                <!--204:已完成;交易完成（配置再次购买按钮）-->
                <li class="btn btn-buymore btn-yellow" v-on:click="buyMore(item)">再次购买</li>
              </ul>
              <ul class="btns" v-if="item.order.status == 205">
                <!--205:交易关闭;交易关闭（配置再次购买按钮）-->
                <li class="btn btn-buymore btn-yellow" v-on:click="buyMore(item)">再次购买</li>
              </ul>
              <ul class="btns" v-if="item.order.status == 206">
                <!--206:退款中;退款中（配置联系商家按钮）-->
                <li class="btn btn-phone btn-yellow" v-on:click="callSeller()">
                  <a v-bind:href="'tel:'+item.shop.servicePhone" class="btn-yellow">联系商家</a>
                </li>
              </ul>
              <ul class="btns" v-if="item.order.status == 207">
                <!--207:退款成功;退款成功（配置再次购买按钮）-->
                <li class="btn btn-buymore btn-yellow" v-on:click="buyMore(item)">再次购买</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>

    <loading :loadingShow="support.isLoading"></loading>

    <!-- 下拉加载更多 -->
    <infinite-scroll :scroller="support.loadScroller" :loading="support.loading"  @load="loadMore()"></infinite-scroll>

  <tip :tip="support.tip" :type="'mall'" :sub="support.sub" :tipShow="support.tipShow" v-if="support.tipShow"
       v-on:hideTip="hideTip"></tip>

</div>

  </template>

<script>
import api from "./../api/data";

export default {
  name: 'order',
  data: function () {
    return {
      support: {
        infos: "",
        isLoading: false,
        loadScroller: $(".my-order .my-content")[0],
        currentPage: 0,
        loading: false,
        tip: "",
        tipShow: false,
      },
      business: {
        orders: []
      }
    }
  },
  mounted: function () {
    this.queryMyOrders();
    this.support.loadScroller = $(".my-order .my-content")[0];
    //console.log(this.support.loadScroller);
    this.support.currentPage = 0;
  },
  methods: {
    showTip: function (msg) {
      this.support.tip = msg;
      this.support.sub = "";
      this.support.tipShow = true;
      this.support.specCompShow = false;
    },
    hideTip: function () {
      this.support.tip = "";
      this.support.sub = "";
      this.support.tipShow = false;
    },
    noLoginOpt: function(){
      window.location.href=api.getCommonConfig("loginUrl");
    },
    queryMyOrders: function () {
      var vue = this;
      vue.support.isLoading = true;
      var page = 0;
      var params = {
        page: page,
        size: 10
      }
      api.queryMyOrders(params).then(function (data) {
          if (data.status == 200) {
            var resultCode = data && data.data && data.data.result;
            var resultValue = data && data.data && data.data.value;
            if (resultCode == -100) {
              vue.support.infos = "未登录,请登录";
              vue.noLoginOpt();
            }
            if (resultCode == 0) {
              vue.business.orders = resultValue && resultValue.content;
              //console.log("vue.business.orders:", vue.business.orders);
              vue.support.infos = "您还没有任何商品订单噢！";
            }
          } else {
            vue.support.infos = "网络异常!";
          }
        }, function (err) {
          vue.support.infos = "网络异常!!"
        }
      ).then(function () {
        vue.support.isLoading = false;
      })
    },
    //功能区,
    //0. 取消订单
    cancelOrder: function (id) {
      var self = this;
      //console.log("取消订单", id);
      api.cancelOrder(id).then(function (data) {
        if (data.status == 200) {
          var resultCode = data && data.data && data.data.result;
          if (resultCode == 0) {
            self.queryMyOrders();
          } else {
            self.showTip("订单取消失败！")
          }
        }
        // stats == 200,  else , 服务器异常.
      });
    },
    //立即付款
    payOrder: function (item, orderNo) {
      //console.log("立即付款", JSON.stringify(item.order), orderNo);
//      debugger;
      var id = item.order["id"];
      var orderGoods = item && item.orderGoods && item.orderGoods[0];
      var orderInfo = {};
      orderInfo.picUrl = orderGoods.orderGoods.snapshot.picUrl;
      orderInfo.deliveryFee = orderGoods.orderGoods.snapshot.deliveryFee; //
      orderInfo.deliveryInfo = orderGoods.orderGoods.snapshot.catId == 1 ? "普通快递" : "虚拟发货";  //
      orderInfo.name = orderGoods.orderGoods.snapshot.name;
      orderInfo.nums = orderGoods.orderGoods.quantity;
      orderInfo.price = orderGoods.orderGoods.price;

      //...生成的订单才有的信息...
      orderInfo.orderAmt =  orderInfo.nums * orderInfo.price ;
      orderInfo.userName = item.order.userName;
      orderInfo.phone = item.order.phone;
      orderInfo.province = item.order.province;
      orderInfo.city = item.order.city;
      orderInfo.district = item.order.district;
      orderInfo.detail = item.order.detail;
      orderInfo.orderType = item.order.orderType;
      var attrInfo = [];
      for (var i = 0; i < orderGoods.attrs.length; i++) {
        var item = {name: orderGoods.attrs[i].attrDetailName};
        attrInfo.push(item);
      }
      orderInfo.attrInfo = attrInfo;
      window.localStorage.setItem(orderNo, JSON.stringify(orderInfo));
      this.$store.commit("setOrderInfo", orderInfo);
      this.$router.push({
        name: "orderConfirm",
        params: {orderNo: orderNo, catId: orderGoods.orderGoods.snapshot.catId},
        query: {from: this.$route.fullPath, orderId: id}
      });
    },
    //1. 联系商家
    callSeller: function (id) {
      //console.log("联系商家", id);
    },
    //退款
    refund: function (id) {
      var self = this;
      //console.log("退款", id);
      api.cancelOrder(id).then(function (data) {
        //console.log("退款申请", data);
        if (data.status == 200) {
          var resultCode = data && data.data && data.data.result;
          if (resultCode == 0) {
            self.queryMyOrders();
          } else {
            self.showTip("退款申请失败！")
          }
        }
        // stats == 200,  else , 服务器异常.
      });
    },
    //确认收货.
    confirmGood: function (id) {
      var self = this;
      //console.log("确认收货", id);
      api.confirmRev(id).then(function (data) {
        if (data.status == 200) {
          var resultCode = data && data.data && data.data.result;
          if (resultCode == 0) {
            self.queryMyOrders();
          } else {
            self.showTip("确认收货失败！")
          }
        }
        // stats == 200,  else , 服务器异常.
      });
    },
    //再次购买
    buyMore: function (item) {
      //this.showTip("超过库存数量");
      //先取第一个商品吧
      var orderGoods = item && item.orderGoods && item.orderGoods[0];
      var goodsId = orderGoods.orderGoods.goodsId;

      this.$router.push({
        name: "goodDetail",
        params: {goodId: goodsId},
        query: {from: this.$route.fullPath, orderId: item.id}
      });
    },
    //加载更多..
    loadMore: function () {
      //console.log("加载更多");
      this.support.loading = true;

      var page = this.support.currentPage + 1;
      var params = {
        page: page,
        size: 10
      }
      var vue = this;
      api.queryMyOrders(params).then(function (data) {
          if (data.status == 200) {
            var resultCode = data && data.data && data.data.result;
            var resultValue = data && data.data && data.data.value;
            if (resultCode == -100) {
              vue.support.infos = "未登录,请登录";
              vue.noLoginOpt();
            }
            if (resultCode == 0) {
              var newOrders = resultValue && resultValue.content;
              vue.business.orders = vue.business.orders.concat(newOrders);
              //console.log("vue.business.orders:", vue.business.orders);
              vue.support.currentPage = vue.support.currentPage + 1;
//                    vue.support.infos = "暂无订单";
            }
          } else {
            vue.support.infos = "网络异常!";
          }
        }, function (err) {
          vue.support.infos = "网络异常!!"
        }
      ).then(function () {
        vue.support.isLoading = false;
        vue.support.loading = false; // loadMore.
      })
    },

    back: function () {
    	window.history.back();
//    var fromUrl = this.$route.query.fromUrl || "";
//    
//    if (fromUrl != "") {
//    	//返回首页
//      this.$router.push({name: 'mall'});
//    } else {
//      window.history.back();
//    }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./../assets/css/order.less");
</style>
