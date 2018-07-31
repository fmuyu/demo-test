<template>
  <div class="my-order-detail">
    <header class="header-fixed so-header header-shadow">
      <div  class="header-wrapper">
        <div class="left" v-on:click="back()">
          <i  class="icon-back"></i>
          <div class="back">返回</div>
        </div>
        <div class="center">
          订单详情
        </div>
      </div>
    </header>
    <div class="order-content" v-if="business.orderInfo == null">
      {{business.msg}} {{business.orderInfo}}
    </div>
    <div class="order-content" v-if="business.orderInfo != null">
        <div class="order-status">
          <div class="name" v-if="business.orderInfo.order.status == 201">等待付款</div>
          <div class="name" v-if="business.orderInfo.order.status == 202">等待商家发货</div>
          <div class="name" v-if="business.orderInfo.order.status == 203">等待确认收货</div>
          <div class="name" v-if="business.orderInfo.order.status == 204">交易完成</div>
          <div class="name" v-if="business.orderInfo.order.status == 205">
            <span class="main" style="top: -0.2rem;">交易关闭</span>
            <span class="sub" style="margin-top: .35rem;">超时未支付</span>
          </div>
          <div class="name" v-if="business.orderInfo.order.status == 206">
            <span class="main">退款中</span>
            <span class="sub" v-if="!business.orderInfo.order.merchantRefundDate">等待商家同意退款，超过48小时，系统将自动默认商家同意退款</span>
            <span class="sub" v-if="business.orderInfo.order.merchantRefundDate">等待系统退款</span>
          </div>
          <div class="name" v-if="business.orderInfo.order.status == 207">退款成功</div>
          <img src="./../assets/img/s201.png" v-if="business.orderInfo.order.status == 201"></img>
          <img src="./../assets/img/s202.png" v-if="business.orderInfo.order.status == 202"></img>
          <img src="./../assets/img/s203.png" v-if="business.orderInfo.order.status == 203"></img>
          <img src="./../assets/img/s204.png" v-if="business.orderInfo.order.status == 204"></img>
          <img src="./../assets/img/s205.png" v-if="business.orderInfo.order.status == 205"></img>
          <img src="./../assets/img/s206.png" v-if="business.orderInfo.order.status == 206"></img>
          <img src="./../assets/img/s207.png" v-if="business.orderInfo.order.status == 207"></img>
        </div>
        <!-- 实物和虚拟 //订单类型：实物订单：7001，虚拟订单：7002-->
        <div class="delivery-status">
          <div class="desp"  v-show="business.orderInfo.order.status == 203 && business.orderInfo.order.status == 204">
            <div class="left">
              <i class="icon icon-delivery"></i>
            </div>
            <div class="right">
              <div class="top">发货详情</div>
              <div class="bottom" v-if="business.orderInfo.order.orderType=='7001'">
                <div class="name">{{business.orderInfo.order.deliveryName == null ? '普通快递':business.orderInfo.order.deliveryName}} 运单号:{{business.orderInfo.order.deliveryNo}}</div>
              </div>
              <div class="bottom" v-if="business.orderInfo.order.orderType=='7002'">
                <div class="name">普通快递 运单号:{{business.orderInfo.order.deliveryDesc}}</div>
              </div>
            </div>
          </div>
          <div class="address">
            <div class="left">
              <i class="icon icon-addr"></i>
            </div>
            <div class="right"  v-if="business.orderInfo.order.orderType=='7001'">
              <div class="name">{{business.orderInfo.order.userName}} {{business.orderInfo.order.phone}}</div>
              <div class="delivery-address">{{business.orderInfo.order.province}} {{business.orderInfo.order.city}}
                              {{business.orderInfo.order.district}} {{business.orderInfo.order.detail}}
              </div>
            </div>
            <div class="right"  v-if="business.orderInfo.order.orderType=='7002'">
              <div class="name">充值账号 {{business.orderInfo.order.detail}}</div>
              <div class="delivery-address">
                收货人 {{business.orderInfo.order.userName}}  {{business.orderInfo.order.phone}}
              </div>
            </div>
          </div>
        </div>

        <div class="goods">
          <div class="title">
            <div class="left">
              <!--<i class="icon icon-shop"></i>-->
              <img v-bind:src="business.orderInfo.goods[0].gds.shop.logoUrl" class="shop-logo"/>
              <div class="name"> {{business.orderInfo.goods[0].gds.shop.name}}</div>
            </div>
            <div class="right">
              <i class="icon icon-phone"></i>
              <div class="name">
              	<a v-bind:href="'tel:'+business.orderInfo.goods[0].gds.shop.servicePhone">联系商家</a>
              </div>
            </div>
          </div>
          <div class="order-good">
            <div class="good-logo">
              <img v-bind:src="business.orderInfo.goods[0].gds.picUrl"/>
            </div>
            <div class="good-desp">
              <div class="good-name">{{business.orderInfo.goods[0].gds.name}}</div>
              <div class="good-spec" >
                <span v-if="business.orderInfo.goods[0].orderGoodsAttrs " v-for="item in business.orderInfo.goods[0].orderGoodsAttrs ">
                  已选 {{item.attrDetailName}}
                </span>
              </div>
              <div class="good-price">
                <span class="price"><i>￥</i>{{business.orderInfo.goods[0].gds.price | FloatTwo}}</span>
                <span class="num">x {{business.orderInfo.order.orderQuantity}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="items">
          <div class="item delivery">
            <div class="left">配送</div>
            <div class="right"   v-if="business.orderInfo.order.orderType=='7001'">{{business.orderInfo.order.deliveryName == null ? '普通快递':business.orderInfo.order.deliveryName}}</div>
            <div class="right"   v-if="business.orderInfo.order.orderType=='7002'">虚拟发货</div>
          </div>
          <div class="item amount">
            <div class="left">商品金额</div>
            <div class="right" v-if="business.orderInfo.order.payTypeId != 2">
              ￥{{business.orderInfo.order.goodsAmt | FloatTwo}}
            </div>
            <div class="right" v-if="business.orderInfo.order.payTypeId == 2">
              {{business.orderInfo.order.goodsAmt | lyqNum}}乐盈券
            </div>
          </div>
          <div v-if="business.orderInfo.order.orderType=='7001'" class="item fee">
            <div class="left">运费</div>
            <div class="right" v-if="business.orderInfo.order.deliveryFee>0">
              ￥{{business.orderInfo.order.deliveryFee | FloatTwo}}
            </div>
            <div class="right" v-else>
              包邮
            </div>
          </div>
          <div class="item real">
            <div class="left"   v-if="business.orderInfo.order.payTypeId != 3">订单金额</div>
            <div class="right"   v-if="business.orderInfo.order.payTypeId != 3">
              ￥{{business.orderInfo.order.payAmt?business.orderInfo.order.payAmt:business.orderInfo.order.orderAmt | FloatTwo}}
            </div>
            <div class="left"   v-if="business.orderInfo.order.payTypeId == 3">乐盈券支付</div>
            <div class="right"   v-if="business.orderInfo.order.payTypeId == 3">
              {{business.orderInfo.order.payAmt | lyqNum}}乐盈券
            </div>
          </div>
          <div class="item type" v-if="business.orderInfo.order.status != 205">
            <div class="left">支付方式</div>
            <div class="right">{{business.orderInfo.order.payTypeName}}</div>
          </div>
        </div>

        <div class="info">
          <!-- 等待付款状态-->
          <div class="lists" v-if="business.orderInfo.order.status == 201">
            <div class="item">
              <div class="left">订单编号:</div>
              <div class="right">{{business.orderInfo.order.orderNo}}</div>
            </div>
            <div class="item">
              <div class="left">下单时间:</div>
              <div class="right">{{business.orderInfo.order.createTime}}</div>
            </div>
          </div>

          <!-- 等待商家发货状态-->
          <div class="lists"  v-if="business.orderInfo.order.status == 202">
            <div class="item">
              <div class="left">订单编号:</div>
              <div class="right">{{business.orderInfo.order.orderNo}}</div>
            </div>
            <div class="item">
              <div class="left">下单时间:</div>
              <div class="right">{{business.orderInfo.order.createTime}}</div>
            </div>
            <div class="item">
              <div class="left">付款时间:</div>
              <div class="right">{{business.orderInfo.order.payDate}}</div>
            </div>
          </div>

          <!-- 等待确认收货状态-->
          <div class="lists"  v-if="business.orderInfo.order.status == 203">
            <div class="item">
              <div class="left">订单编号:</div>
              <div class="right">{{business.orderInfo.order.orderNo}}</div>
            </div>
            <div class="item">
              <div class="left">下单时间:</div>
              <div class="right">{{business.orderInfo.order.createTime}}</div>
            </div>
            <div class="item">
              <div class="left">付款时间:</div>
              <div class="right">{{business.orderInfo.order.payDate}}</div>
            </div>
            <div class="item" v-if="business.orderInfo.order.orderType=='7001'">
              <div class="left">发货时间:</div>
              <div class="right">{{business.orderInfo.order.deliveryDate}}</div>
            </div>
          </div >

          <!-- 交易成功状态（实物）-->
          <div class="lists"   v-if="business.orderInfo.order.status == 204">
            <div class="item">
              <div class="left">订单编号:</div>
              <div class="right">{{business.orderInfo.order.orderNo}}</div>
            </div>
            <div class="item">
              <div class="left">下单时间:</div>
              <div class="right">{{business.orderInfo.order.createTime}}</div>
            </div>
            <div class="item">
              <div class="left">付款时间:</div>
              <div class="right">{{business.orderInfo.order.payDate}}</div>
            </div>
            <div class="item"  v-if="business.orderInfo.order.orderType=='7001'">
              <div class="left">发货时间:</div>
              <div class="right">{{business.orderInfo.order.deliveryDate}}</div>
            </div>
            <div class="item">
              <div class="left">交易成功时间:</div>
              <div class="right">{{business.orderInfo.order.finishDate}}</div>
            </div>
          </div>

          <!-- 退款中状态（实物）-->
          <div class="lists"   v-if="business.orderInfo.order.status == 206">
            <div class="item">
              <div class="left">订单编号:</div>
              <div class="right">{{business.orderInfo.order.orderNo}}</div>
            </div>
            <div class="item">
              <div class="left">下单时间:</div>
              <div class="right">{{business.orderInfo.order.createTime}}</div>
            </div>
            <div class="item">
              <div class="left">付款时间:</div>
              <div class="right">{{business.orderInfo.order.payDate}}</div>
            </div>
            <!--<div class="item" v-if="business.orderInfo.order.orderType=='7001'">
              <div class="left">发货时间:</div>
              <div class="right">{{business.orderInfo.order.deliveryDate}}</div>
            </div>-->
            <div class="item">
              <div class="left">申请退款时间:</div>
              <div class="right">{{business.orderInfo.order.refundApplyDate}}</div>
            </div>
          </div>

          <!-- 退款成功状态（实物）-->
          <div class="lists"   v-if="business.orderInfo.order.status == 207">
            <div class="item">
              <div class="left">订单编号:</div>
              <div class="right">{{business.orderInfo.order.orderNo}}</div>
            </div>
            <div class="item">
              <div class="left">下单时间:</div>
              <div class="right">{{business.orderInfo.order.createTime}}</div>
            </div>
            <div class="item">
              <div class="left">付款时间:</div>
              <div class="right">{{business.orderInfo.order.payDate}}</div>
            </div>
            <div class="item">
            <div class="left">申请退款时间:</div>
            <div class="right">{{business.orderInfo.order.refundApplyDate}}</div>
            </div>
            <div class="item">
              <div class="left">退款成功时间:</div>
              <div class="right">{{business.orderInfo.order.refundDate}}</div>
            </div>
          </div>

          <!-- 交易关闭状态（实物）-->
          <div class="lists"   v-if="business.orderInfo.order.status == 205">
            <div class="item">
              <div class="left">订单编号:</div>
              <div class="right">{{business.orderInfo.order.orderNo}}</div>
            </div>
            <div class="item">
              <div class="left">下单时间:</div>
              <div class="right">{{business.orderInfo.order.createTime}}</div>
            </div>
            <div class="item">
              <div class="left">交易关闭时间:</div>
              <div class="right">{{business.orderInfo.order.cancelDate}}</div>
            </div>
          </div>

        </div>
    </div>
  </div>
</template>
<script>
  import api from "./../api/data";
  export default {
      name:'orderDetail',
      data: function(){
          return {
              business:{
                  msg : "",
                  searchKey:"",
                  orderInfo : null,
              }
          }
      },
    /**
     * @desp 201:等待付款;202:完成付款,等待发货;203:已发货;204:已完成;205:交易关闭;206:退款中;207:退款成功;
     */
    created: function(){
      var id = this.$route.params.id || "";
      this.initData(id);
      },
      mounted: function(){
      },
      methods: {
          initData: function(id){
            var params = {
                orderId : id
            }
            var self = this;
            this.business.msg = "";
            api.getOrderView(params).then(function(data){
                //console.log("获取订单信息",JSON.stringify(data));
                if (data.status == 200) {
                    var resultCode = data && data.data && data.data.result;
                    var result = data && data.data && data.data.value;
                    if (resultCode == 0) {
                        self.business.orderInfo = result;
                    } else {
                        self.business.msg = "暂未查询到订单的信息"
                    }
                } else {
                  self.business.msg = "暂未查询到订单的信息"
                }
                //console.log("orderInfo",JSON.stringify(self.business.orderInfo))
            },function(err){
                //console.log("err",err);
                self.business.msg = "暂未查询到订单的信息"
            })
          },
          queryKey: function(){

          },
          back: function(){
              window.history.back();
          }
      }
  }
</script>

<style lang="less" scoped>
  @import url("./../assets/css/order.less");
</style>
