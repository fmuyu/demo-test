<template>
  <div class="pay-status">
    <header class="header-fixed so-header header-shadow">
      <div class="header-wrapper">
        <div class="left" v-if="isFail=='fail'" v-on:click="back()">
          <!--v-on:click="back()"-->
          <i class="icon-back"></i>
          <span class="back">返回</span>
        </div>
        <div class="left" v-else></div>
        <div class="name center">{{status}}</div>
      </div>
    </header>
    <div class="content">
      <div v-if="isFail=='ok'" class="pay-ok">
        <div class="ok-logo">
          <img src="./../assets/img/payOk.png"/>
          <div class="info">支付成功 感谢您的购买</div>
        </div>
        <div class="order-info">
          <div class="item">
            <div class="left three-txt">
              订单号<span class="f_right">:</span>
            </div>
            <div class="right">
              {{orderNo}}
            </div>
          </div>
          <!-- 支付方式-->
          <div class="item" v-if="business.payType != 2">
            <div class="left">
              实际支付 <span class="f_right">:</span>
            </div>
            <div class="right">
              {{order.orderAmt | FloatTwo}}元
            </div>
          </div>
          <div class="item" v-if="business.payType == 2">
            <div class="left">
              乐盈券支付 <span class="f_right">:</span>
            </div>
            <div class="right">
              {{order.orderAmt | lyqNum}}乐盈券
            </div>
          </div>

          <div class="item" v-if="order && order.orderType == 7001">
            <div class="left three-txt">
              寄送至<span class="f_right">:</span>
            </div>
            <div class="right">
              {{order.province}} {{order.city}}{{order.district}}{{order.detail}}
            </div>
          </div>
          <div class="item" v-if="order && order.orderType == 7002">
            <div class="left three-txt">
              充值账号<span class="f_right">:</span>
            </div>
            <div class="right">
              {{order.detail}}
            </div>
          </div>

          <div class="item">
            <div class="left three-txt">
              收件人<span class="f_right">:</span>
            </div>
            <div class="right">
              {{order.userName}} {{order.phone}}
            </div>
          </div>
        </div>

        <div class="opt-other">
          <router-link :to="{name:'mallList'}" tag="div" class="btn btn-more">更多商品</router-link>
          <router-link :to="{name:'order'}" tag="div" class="btn btn-order">查看订单</router-link>
        </div>
      </div>
      <div v-if="isFail=='fail'" class="pay-fail">
        <div class="fail-logo">
          <img src="./../assets/img/payFail.png"/>
          <div class="info">支付失败,请重新支付</div>
        </div>
        <div class="order-info">
          <div class="item">
            <div class="left">
              订单号:
            </div>
            <div class="right">
              {{orderNo}}
            </div>
          </div>
          <div class="item" v-if="business.payType != 2">
            <div class="left">
              应付金额:
            </div>
            <div class="right">
              {{order.orderAmt | FloatTwo }}元
            </div>
          </div>
          <div class="item" v-if="business.payType == 2">
            <div class="left">
              乐盈券支付:
            </div>
            <div class="right">
              {{order.orderAmt | lyqNum}}乐盈券
            </div>
          </div>
        </div>

        <div class="pay">
          <div class="title">
            支付遇到问题 ? 换一种支付方式:
          </div>
          <div class="pay-type">
            <div class="info-item weixin-pay">
              <div class="left">
                <i class="icon icon-weixin"></i>
                <span class="name">微信支付</span>
              </div>
              <div class="right" v-on:click="selectPayType(0)">
                <i class="icon "
                   :class="{'icon-selected':business.payType == 0,'icon-select':business.payType !== 0}"></i>
              </div>
            </div>
            <div class="info-item alipay">
              <div class="left">
                <i class="icon icon-alipay"></i>
                <span class="name">支付宝支付</span>
              </div>
              <div class="right" v-on:click="selectPayType(1)">
                <i class="icon "
                   :class="{'icon-selected':business.payType == 1,'icon-select':business.payType !== 1}"></i>
              </div>
            </div>
            <div class="info-item hhly-pay" v-if="ids.indexOf('#2')>=0">
              <div class="left">
                <i class="icon icon-hhly"></i>
                <span class="name">乐盈券</span>
              </div>
              <div class="right" v-on:click="selectPayType(2)">
                <i class="icon "
                   :class="{'icon-selected':business.payType == 2,'icon-select':business.payType !== 2}"></i>
              </div>
            </div>

          </div>

          <div id="ali_pay">

          </div>
        </div>

      </div>
    </div>

    <div class="opt-pay" v-if="isFail=='fail'">
      <router-link :to="{name:'order'}" tag="div" class="btn order-btn">查看订单</router-link>
      <div class="btn pay-btn" v-on:click="toPay()">去付款</div>
    </div>
    <loading :loadingShow="support.loadingShow" v-if="support.loadingShow || support.isFail=='ing'"></loading>
    <!-- 设置二级密码 -->
    <password-popup :isShow="support.showPasswordPopup" :pop="'password'" v-if="support.showPasswordPopup"
                    v-on:hidePopup="hidePopup"></password-popup>
    <password-popup :isShow="support.showQuanPopup" :pop="'lyq'" :lyqNums="support.lyqAmount"
                    v-if="support.showQuanPopup" v-on:hidePopup="hidePopup"></password-popup>
    <password-popup :isShow="support.showQuanPayPopup" :pop="'lyqpay'" :orderNo="support.quanPayOrderNo"
                    v-if="support.showQuanPayPopup" v-on:hidePopup="hidePopup"
                    v-on:requestLyqPay="requestLyqPay"></password-popup>

    <tip :tip="support.tip" :tipShow="support.tipShow" v-if="support.tipShow" v-on:hideTip="hideTip"></tip>
  </div>
</template>

<script>
import api from "./../api/data";
import md5 from 'js-md5';
import passwordPopup from "./../components/passwordPopup";
export default {
  name: 'payOk',
  components: {
    "passwordPopup": passwordPopup
  },
  data: function () {
    return {
      ids:"#0#1",
      orderId: "",
      orderNo: "",
      status: "",
      isFail: "ing",
      business: {
        payType: 0
      },
      order: {},
      support: {
        tip: "",
        tipShow: false,
        showPasswordPopup: false,
        showQuanPopup: false,
        showQuanPayPopup: false,
        quanPayOrderNo: "",
        lyqAmount: 0,
        tip: "",
        tipShow: false,
        timer: 0, // 轮询30次.
        loadingShow: true
      },
      loopTemp: {}
    }
  },

  /**
   * lyq 支付模式和微信，支付宝不一样。 微信，支付宝需要payNo,  乐盈券不需要.
   */
  created: function () {
      this.getPayTypes();
    var orderNo = this.$route.params.orderNo || 0;
    var payType = this.$route.params.payType || 0;	//0:微信	1:支付宝	2:乐盈券
    var orderId = this.$route.query.orderId || "";
    if(orderId.indexOf('?')){
    	this.orderId = orderId.substr(0,orderId.indexOf('?'));
    }else{
    	this.orderId = orderId;
    }
    
    this.business.payType = payType;
    this.orderNo = orderNo;
    var self = this;
    var orderInfo = this.getOrderInfo(orderNo);
    //console.log("orderInfo", JSON.stringify(orderInfo));
    if (payType == 2) {
      self.lyqStatus();
    } else {
      setTimeout(() => {
        self.queryStatus(orderNo, orderId);
      }, 3000)
    }
  },
  methods: {

    getPayTypes:function(){
      var params = {
        country:0,
        terminal : 4
      }
      var vue = this;
      api.getPayTypes(params).then(function(data){
          if (data.status == 200) {
            var resultCode = data.data && data.data.result;
            if (resultCode == 0) {
              var result = data.data && data.data.value;
              for (var i = 0; i < result.length; i++) {
                vue.ids += "#" + (parseInt(result[i].id) - 1);
              }
            } else {
              vue.ids = "#0#1"
            }
          } else {
            vue.ids = "#0#1"
          }
        }
      )
    },
    getOrderInfo: function (orderNo) {
      var result = null;
      var localOrderInfo = null;
      var storeOrderInfo = this.$store.getters.getOrderInfo || null;
      console.log(storeOrderInfo)
      //console.log("获取OrderInfo 步骤1,从store里获取:", JSON.stringify(storeOrderInfo));
      if (storeOrderInfo.name == undefined || storeOrderInfo.name == "") {
        result = this.getOrderInfoFromLocal(orderNo);
        //console.log("local里的了..", result);
      } else {
        result = storeOrderInfo;
      }
      if (result == null) {
        result = {
          "name": "",
          "attrInfo": {},
          "picUrl": "",
          "price": 0,
          "nums": 1,
          "deliveryFee": 0,
          "deliveryInfo": "",
          "amount": 0
        };
      }
      return result;
    },
    getOrderInfoFromLocal: function (orderNo) {
      var localObj = {};
      var result = null;
      if (orderNo == 0) {
        localObj = window.localStorage.getItem("orderInfo") || "{}";
      } else {
        localObj = window.localStorage.getItem(orderNo) || "{}";
      }
      try {
        result = JSON.parse(localObj);
      } catch (e) {
        result = null;
      }
      return result;
    },
    //获得乐盈券支付信息.
    lyqStatus: function () {
      var lyqOrderInfo = this.getOrderInfo(this.orderNo);
      var lyqPayStatus = window.localStorage.getItem("lyqPayStatus") || false;
      this.order = lyqOrderInfo;

      //console.log("获取乐盈券支付信息", lyqOrderInfo, lyqPayStatus, this.order, lyqPayStatus == true);
      if (lyqPayStatus == true || lyqPayStatus == "true") {
        this.isFail = "ok";
        this.status = "支付成功";
      } else {
        this.isFail = "fail";
        this.status = "支付失败";
      }
      this.support.loadingShow = false;
    },
    // 30秒轮询, 每3秒轮询一次.
    loopQuery: function (orderNo, orderId) {
      var self = this;
      self.support.timer = self.support.timer + 1;
      //var store_payFlowNo = this.$store.getters.getPayFlowNo;
      //console.log("获取到微信支付之后的payFlowNo", store_payFlowNo);
      var local_payFlowNo = window.localStorage.getItem(orderNo);
      var payFlowNo = local_payFlowNo;
      var params = {
        payFlowNo: payFlowNo
      }
      api.getPayStatus(params).then(function (data) {
        //console.log("获取到支付状态", JSON.stringify(data));
        if (data.status == 200) {
          var resultCode = data && data.data && data.data.result;
          if (resultCode == 0) {
            var result = data && data.data && data.data.value && data.data.value.tradeStatus;
            if (result == 1) {
              self.loopTemp.isFail = false;
            } else {
              self.loopTemp.isFail = true;
            }
          }
        }
      });
    },
    queryStatus: function (orderNo, orderId) {
      var self = this;
      var store_payFlowNo = this.$store.getters.getPayFlowNo;
      //console.log("获取到微信支付之后的payFlowNo", store_payFlowNo);
      var local_payFlowNo = window.localStorage.getItem(orderNo);
      var payFlowNo = local_payFlowNo;
      var params = {
        payFlowNo: payFlowNo
      }
      api.getPayStatus(params).then(function (data) {
        //console.log("获取到支付状态", JSON.stringify(data));
        if (data.status == 200) {
          var resultCode = data && data.data && data.data.result;
          if (resultCode == 0) {
            var result = data && data.data && data.data.value && data.data.value.tradeStatus;
            if (result == 1) {
              self.isFail = "ok";
              self.status = "支付成功";
              //支付成功之后查询订单详情
              var param = {
                orderId : self.orderId
	            }
	            api.getOrderView(param).then(function(data){
	              	if (data.status == 200) {
	                    var resultCode = data && data.data && data.data.result;
	                    var result = data && data.data && data.data.value;
	                    if (resultCode == 0) {
	                        self.order = result.order;
	                    } 
	                }
	                //console.log("orderInfo",JSON.stringify(self.business.orderInfo))
	            },function(err){
	                //console.log("err",err);
	                 //self.business.msg = "暂未查询到订单的信息"
	            })
            } else {
              self.isFail = "fail";
              self.status = "支付失败";
            }
          } else {
            self.$router.push({name: "order"});
          }
        } else {
          self.order = "服务器异常";
        }
      })
        .then(function () {
          self.support.loadingShow = false;
          api.getOrderView({orderId: orderId}).then(function (data) {
            //console.log("获取到订单的信息", data);
            if (data.status == 200) {
              var resultCode = data && data.data && data.data.result;
              if (resultCode == 0) {
                var result = data && data.data && data.data.value;
                //订  单  号,实际支付,寄送至,收件人,手机
                var order = result && result.order;
                self.order = order;
              }
            } else {
              self.order = "服务器异常";
            }
          })
        })
    },
    queryStatusByNo: function (orderNo, payType) {
      var params = {
        orderNo: orderNo
      }
      var payUrlParams = {
        orderNo: orderNo,
        terminal: "4" || api.getCommonConfig("terminal"),
        returnUrl: window.location.origin+"/index.html#"+"/payStatus/" + orderNo + "/" + payType
      }
      this.getPayFlowNo(payType, payUrlParams).then(function (data) {
        //console.log(payType, data);
        if (data.status == 200) {
          var resultCode = data && data.data && data.data.result;
          if (resultCode == 0) {
            var payFlowNo = data && data.data && data.data.value && data.data.value.payFlowNo;
            api.getPayStatus({payFlowNo: payFlowNo}).then(function (data) {
              if (data.status == 200) {
                var payCode = data && data.data && data.data.result;
                if (payCode == 0) {

                } else {
                  var info = data && data.data && data.data.msg;
                }
              }
            })
          }
        }
      })
      api.getPayStatus(params).then(function (data) {
        //console.log("支付状态:", data);
      })
    },
    getPayFlowNo: function (payType, payUrlParams) {
      if (payType == 0) {
        return api.wePay(payUrlParams)
      } else if (payType == 1) {
        return api.aliPay(payUrlParams);
      } else if (payType == 2) {
        return api.lyqPay(payUrlParams);
      }
    },
    back: function () {
      window.history.back();
    },

    selectPayType: function (type) {
      this.business.payType = type;
    },

    toPay: function () {
      var payUrlParams = {
        orderNo: this.orderNo,
        terminal: api.getCommonConfig("terminal") || "4",
        returnUrl: window.location.origin + "/index.html#/payStatus/" + this.orderNo + "/" + this.business.payType + "?orderId=" + this.orderId || window.location.href || api.getCommonConfig("returnUrl")
      }
      this.pay(payUrlParams);
    },
    pay: function (params) {
      if (this.business.payType == 0) {
        this.wxPay(params);
      } else if (this.business.payType == 1) {
        this.aliPay(params);
      } else if (this.business.payType == 2) {
        this.lyqPay(params);
      }
    },
    wxPay: function (params) {
      //console.log("微信支付...", params);
      var self = this;
      api.wePay(params).then(function (data) {
        if (data.status == 200) {
          var resultCode = data && data.data && data.data.result;
          //console.log("微信支付接口的code", resultCode);
          if (resultCode == 0) {
            var resp = data && data.data && data.data.value && data.data.value.resp;
            var payFlowNo = data && data.data && data.data.value && data.data.value.payFlowNo;
            self.$store.commit("setPayFlowNo", payFlowNo);    //提交到状态管理器中，是为了后面的支付状态查询使用的.
            window.localStorage.setItem(params.orderNo + "", payFlowNo);  // 防止回调回来的时候，状态丢失？？？ 。
            //console.log(payFlowNo, self.$store.getters.getPayFlowNo);
            window.location.href = api.getCommonConfig("payUrl") + "?" + resp;
          } else {
            var msg = data && data.data && data.data.msg;
            self.support.tip = msg;
            self.support.tipShow = true;
          }
        }
      })
    },
    aliPay: function (params) {
      var vue = this;
      api.aliPay(params).then(function (data) {
        if (data.status == 200) {
          var resultCode = data && data.data && data.data.result;
          if (resultCode == 0) {
            var resp = data && data.data && data.data && data.data.value.respHtml;
            //console.log("ali", resp);
            vue.aliHtml = resp;
            $("#ali_pay").html(resp);
//                          window.location.href = "https://payh5.bbnpay.com/browserh5/paymobile.php?" + resp;
          } else {
            var msg = data && data.data && data.data.msg;
            vue.support.tip = msg;
            vue.support.tipShow = true;
          }
        }
      })
    },
    hidePopup: function () {
      //console.log("hide.........");
      this.support.showQuanPopup = false;
      this.support.showPasswordPopup = false;
      this.support.showQuanPayPopup = false;
    },
    hideTip: function () {
      this.support.showQuanPopup = false;
      this.support.showPasswordPopup = false;
      this.support.showQuanPayPopup = false;
      this.support.tipShow = false;
      this.support.tip = "";
    },
    errorTip: function (msg) {
      this.support.tip = msg;
      this.support.tipShow = true;
    },
    requestLyqPay: function (msg) {
      var password = msg && msg.password;
      var vue = this;
      if (vue.orderNo != "") {
        var payParams = {
          orderNo: vue.orderNo,
          password: md5.hex(password).toUpperCase()
        }
        vue.onlyPayByLyq(payParams);
      }
    },
    onlyPayByLyq: function (params) {
      var vue = this;
      api.lyqPay(params).then(function (data) {
        //console.log("乐盈券支付结果：", data);
        if (data.status == 200) {
          var resultCode = data && data.data && data.data.result;
          var msg = data && data.data && data.data.msg;
          if (resultCode == 0) {
            window.localStorage.setItem("lyqPayStatus", true);
            vue.$router.push({name: "payStatus", params: {orderNo: params.orderNo, payType: 2}});
          } else {
            window.localStorage.setItem("lyqPayStatus", false);
            vue.errorTip(msg);
          }

        } else {
          vue.errorTip("服务器异常");
        }
      }, function (err) {
        vue.errorTip("网络异常");
      })
    },
    lyqPay: function (params) {
      //1. 判断是否设二级密码, 调用接口.  没有就设置.
      var vue = this;
      var orderMoney = 0;
      var isSecondPassword = false;
      var isMoney = 0;
      api.isLogin().then(function (data) {
        if (data.status == 200) {
          var resultCode = data && data.data && data.data.result;
          var msg = data && data.data && data.data.msg;
          if (resultCode == 0) {
            var member = data && data.data && data.data.value && data.data.value.member;
            var lyq = member && member.lyq;
            isSecondPassword = member && member.paypwdFlag;
            //console.log("是否有二级密码:", member, isSecondPassword, lyq);
            if (isSecondPassword == 0) {
              vue.support.showPasswordPopup = true;
            } else if (lyq < parseFloat(vue.order.orderAmt)) {
              vue.support.showQuanPopup = true;
            }
            if (isSecondPassword != 0 && lyq >= parseFloat(vue.order.orderAmt)) {
              vue.support.showQuanPayPopup = true;
              vue.support.quanPayOrderNo = vue.orderNo;
            }
          } else {
            vue.errorTip(msg);
          }
        } else {
          vue.errorTip("服务器异常");
        }
      }, function (err) {
        vue.errorTip("网络异常");
      })

    }
  }
}
</script>

<style lang="less" scoped>
@import url("./../assets/css/order.less");
</style>
