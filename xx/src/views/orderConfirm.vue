<!--
    商品主图缩略图,商品名称,属性规格列表, 商品价格, 商品数量
    配送, 普通快递||虚拟发货.
-->

<template>
  <div class="order-confirm">
    <header class="header-fixed so-header header-shadow">
      <div  class="header-wrapper">
        <div v-on:click="back()" class="left">
          <i class="icon-back"></i>
          <span class="back">返回</span>
        </div>
        <div class="name center">订单结算</div>
      </div>
    </header>

    <div class="content">

      <div class="order-address" v-if="catId == 1">
        <div class="left" v-if="!support.needAddress">
          <div class="name-wrapper">
            <span class="name">{{business.address.userName}}</span>
          </div>
          <div class="address">
            {{business.address.province}}{{business.address.city}}{{business.address.district}}{{business.address.detail}}
          </div>
        </div>

        <div class="left" v-if="support.needAddress">
          <router-link :to="{name:'addAddr'}" tag="div" class="need-add">
              添加收货地址
          </router-link>
        </div>
        <div class="right" v-if="editAddress">
	        <router-link :to="{name:'address',query:{'fromurl':getFromUrl()}}" tag="div" class="right">
	          <i class="icon-right"></i>
	        </router-link>
        </div>
      </div>
      <div class="virtual-addr" v-if="catId == 2">
        <div class="virtual-list">
          <div class="item">
            <div class="left" >
            	充值账号：
              <!--<select v-model="v_rechargeAccType">
                {{v_rechargeAccType}}
                <option v-for="(option,oindex) in chargeType" v-if="oindex == 0" v-bind:value="option.id" selected>
                  {{ option.dictVal }}
                </option>
                <option v-for="(option,oindex) in chargeType" v-if="oindex != 0"  v-bind:value="option.id">
                  {{ option.dictVal }}
                </option>
              </select>-->
            </div>
            <div class="right">
              <input type="text" maxlength="20" placeholder="请输入充值账号" v-model="v_detail"></input>
            </div>
          </div>
          <div class="item">
            <div class="left special">
              收&nbsp;货&nbsp;人：
            </div>
            <div class="right">
              <input type="text" maxlength="20" placeholder="请输入收货人姓名" v-model="v_userName"></input>
            </div>
          </div>
          <div class="item">
            <div class="left">
              手机号码：
            </div>
            <div class="right">
              <input type="text" maxlength="11" placeholder="手机号码" v-model="v_phone"></input>
            </div>
          </div>
        </div>
      </div>
      <div class="order-good">
        <div class="good-logo">
          <img v-bind:src="business.orderInfo.picUrl"/>
        </div>
        <div class="good-desp">
          <div class="good-name">{{business.orderInfo.name}}</div>
          <div class="good-spec" ><span v-if="business.orderInfo.attrInfo && business.orderInfo.attrInfo.details&&business.orderInfo.attrInfo.details.length>0">已选</span><span v-if="business.orderInfo.attrInfo && business.orderInfo.attrInfo.details" v-for="item in business.orderInfo.attrInfo.details">&nbsp;{{item.name}}</span></div>
          <div class="good-price">
            <span class="price"><i>￥</i>{{business.orderInfo.price | FloatTwo}}</span>
            <span class="num">x {{business.orderInfo.nums}}</span>
          </div>
        </div>
      </div>
      <div class="support-info">
        <div class="info-item delivery">
          <div class="left">配送</div>
          <div class="right" v-if="catId==1">{{business.orderInfo.deliveryInfo}}</div>
          <div class="right" v-if="catId==2">虚拟发货</div>
        </div>
        <div class="info-item money">
          <div class="left">商品金额</div>
          <div class="right">￥{{business.orderInfo.price * business.orderInfo.nums | FloatTwo}}</div>
        </div>
        <div class="info-item fee">
          <div class="left">运费</div>
          <div class="right"  v-if="catId==1 && business.orderInfo.deliveryFee > 0">￥{{business.orderInfo.deliveryFee | FloatTwo}}</div>
          <div class="right"  v-if="catId==1 && business.orderInfo.deliveryFee == 0">包邮</div>
          <div class="right"  v-if="catId==2">包邮</div>
        </div>
      </div>

      <div class="pay-type">
        <div class="info-item weixin-pay" v-if="ids.indexOf('#0') >=0">
          <div class="left">
            <i class="icon icon-weixin"></i>
            <span class="name">微信支付</span>
          </div>
          <div class="right"  v-on:click="selectPayType(0)">
            <i class="icon " :class="{'icon-selected':business.payType == 0,'icon-select':business.payType !== 0}"></i>
          </div>
        </div>
        <div class="info-item alipay" v-if="ids.indexOf('#1') >=0">
          <div class="left">
            <i class="icon icon-alipay"></i>
            <span class="name">支付宝支付</span>
          </div>
          <div class="right"  v-on:click="selectPayType(1)">
            <i class="icon " :class="{'icon-selected':business.payType == 1,'icon-select':business.payType !== 1}"></i>
          </div>
        </div>
        <div class="info-item hhly-pay"  v-if="ids.indexOf('#2') >=0">
          <div class="left">
            <i class="icon icon-hhly"></i>
            <span class="name">乐盈券</span>
          </div>
          <div class="right" v-on:click="selectPayType(2)">
            <i class="icon " :class="{'icon-selected':business.payType == 2,'icon-select':business.payType !== 2}"></i>
          </div>
        </div>
      </div>


    </div>

    <footer class="footer-confirm">
      <div class="pay">
        <div class="left">
          <span class="title">合计:</span>
          <span class="money" v-if="business.payType != 2&&catId==1">￥{{business.orderInfo.price * business.orderInfo.nums + business.orderInfo.deliveryFee | FloatTwo}}</span>
          <span class="money" v-if="business.payType != 2&&catId==2">￥{{business.orderInfo.price * business.orderInfo.nums | FloatTwo}}</span>
          <span class="money" v-if="business.payType == 2">{{business.orderInfo.price * business.orderInfo.nums + business.orderInfo.deliveryFee | lyqNum}} 乐盈券</span>
        </div>
        <div class="right" v-on:click="confirmOrder()">去付款</div>
      </div>

      <div id="ali_pay">

      </div>
    </footer>

    <!-- 设置二级密码 -->
    <password-popup :isShow="support.showPasswordPopup" :pop="'password'" v-if="support.showPasswordPopup" v-on:hidePopup="hidePopup"></password-popup>
    <password-popup :isShow="support.showQuanPopup" :pop="'lyq'" :lyqNums="support.lyqAmount" v-if="support.showQuanPopup" v-on:hidePopup="hidePopup"></password-popup>
    <password-popup :isShow="support.showQuanPayPopup" :pop="'lyqpay'" :orderNo="support.quanPayOrderNo" v-if="support.showQuanPayPopup" v-on:hidePopup="hidePopup()" v-on:requestLyqPay="requestLyqPay"></password-popup>

    <tip :tip="support.tip" :tipShow="support.tipShow" v-if="support.tipShow" v-on:hideTip="hideTip"></tip>
  </div>
</template>





<script>
    import md5 from 'js-md5';
    import api from './../api/data';
    import passwordPopup from "./../components/passwordPopup";
    import quanPopup from "./../components/quanPopup";
    export default {
        name: 'orderConfirm',
        components:{
          "passwordPopup":passwordPopup,
          "quanPopup" : quanPopup
        },
        data: function() {
          return {
              ids:"#0#1", //几种支付拼接的...
              chargeType:[],
              v_userName:"",
              v_phone:"",
              v_rechargeAccType:"",
              v_detail:"",
              catId : 1, //实物虚拟, 实物=1,虚拟=2
              ordering:false,  // 是否正在付款， 如果正在付款,则禁止再点击去付款按钮.
              orderNo : "" ,   //如果orderNo 有值,说明已经创建了order了,再点击去付款就不需要创建Order了.
              aliHtml:"",
              editAddress:false,	//默认可以修改地址
              temp:{           //temp ,是有些数据 需要多个节点完成，但某个节点没有完成的时候，临时保存的数据.
                newOrderNo:""
              },              
              support:{
                needAddress:false,
                isNewOrder:true,
                newOrder:{},
                showPasswordPopup: false,  //是否显示二级密码弹窗.
                showQuanPopup : false, //充值乐盈券弹窗.,
                lyqAmount:0,  //充值乐盈券弹窗的额度.
                showQuanPayPopup: false, //乐盈券付款
                tip: "" , //信息提示
                tipShow:false , //是否弹出信息提示框.,
                orderRequestParams:{},
                payRequestParams:{},
                orderInfo:{}  // 订单信息,包含已生产orderNo和没有orderNo.
              },
              business: {
                payType:0,
                orderInfo:{},
                orderInfoBak:{},
                address:{
                  isHas:false,
                  userId:"",
                  userName:"",
                  phone:"",
                  province:"",
                  city:"",
                  district:"",
                  detail:""
                }
              }
          }
        },

        /**
         *@desp 如果orderNo有值得话,从localStorage里获取到值.(已经创建过的).
         *      如果orderNo没有值得话,从store里获取(新建的)
         **/
          created: function(){
            var payTypes = this.getPayTypes();
            var orderNo = this.getRouterOrderNo();
            //虚拟还是实物
            var catId = this.$route.params.catId || 1;
            this.catId = catId;
            var orderInfo = this.getOrderInfo(orderNo);
            this.business.orderInfoBak=this.business.orderInfo = orderInfo;
            this.orderNo = orderNo;
            if (this.business.orderInfo == null || this.business.orderInfo.attrInfo == null || this.business.orderInfo.attrInfo.details == null) {
              this.business.orderInfo.attrInfo = {details:[]};
            }
            if (catId == 2) {
              this.getRechargeType();
            }            
        },
      /**
       * @desp
       * 正常功能点: 入口点有2个，一个是商品详情选择购买之后进入的。 一个是订单列表选择付款进入的。
       *    两个入口点的区别是一个有OrderNo ,一个没有orderNo.
       * 异常功能点: store的数据没有了,  (没有OrderNO的) 创建orderNo失败, 创建payFLowNo失败.
       */
      	mounted:  function(){
          //1.获取用户地址列表.
          this.getAddressList();
          var orderNo = this.getRouterOrderNo();
          if (orderNo !== 0) {
              this.support.isNewOrder = false;
          }
        },
        methods:{
        	getFromUrl:function(){
        		var index=this.$route.fullPath.indexOf('selectedaddr');
        		var newUrl="";
        		if(index>=0){
        			newUrl=this.$route.fullPath.substr(0,this.$route.fullPath.indexOf('selectedaddr')-3)
        		}else{
        			newUrl=this.$route.fullPath
        		}
        		return newUrl;
        	},
        	//获取支付方式
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
                        //console.log(vue.ids)
                      } else {
                          vue.ids = "#0#1"
                      }
                  } else {
                    vue.ids = "#0#1"
                  }
              }
              )
            },
            //获取充值的类型，虚拟
            getRechargeType:function(){
              var self = this;
              api.getRechargeType({}).then(function(data){
                  if (data.status == 200) {
                      var resultCode = data && data.data && data.data.result;
                      if (resultCode == 0) {
                          var result = data && data.data && data.data.value;
                          self.chargeType = result;
                          self.v_rechargeAccType  = self.chargeType && self.chargeType[0].id;
                      }
                  }
              })
            },
			//获取路由中的orderNo
            getRouterOrderNo: function(){
              var orderNo = (this.$route.params && this.$route.params.orderNo) || 0;
              return orderNo;
            },
            //@desp 获取订单信息, 如果是新建的可以通过store里获取, 如果是已经创建过的订单则从local里获取.
            getOrderInfo : function(orderNo){
              var result = null;	//购买商品信息
              var localOrderInfo = null;
              var storeOrderInfo = this.$store.getters.getOrderInfo || null;
              if(storeOrderInfo.name == undefined || storeOrderInfo.name == "") {
              	//商品详情页进入，获取到的是选定商品的详情信息
                result = this.getOrderInfoFromLocal(orderNo);
                //console.log("local里的了..",result);
              } else {
              	//订单列表进入，获取到的是
                result = storeOrderInfo;
                //console.log("store里的了..",result);
              }
              if (result == null) {
                  result = {"name":"","attrInfo":{},"picUrl":"","price":0,"nums":1,"deliveryFee":0,"deliveryInfo":"","amount":0};
              }
              return result;
            },
            getOrderedInfo: function(orderNo){
              var storeOrderInfo = this.$store.getters.getOrderInfo || null;
            },
            getOrderInfoFromLocal: function(orderNo){
               var localObj = {};
               var result = null;
               if (orderNo == 0) {
                 localObj = window.localStorage.getItem("orderInfo") || "{}" ;
               } else {
                 localObj = window.localStorage.getItem(orderNo) || "{}" ;
               }
               try{
                  result = JSON.parse(localObj);
               } catch(e){
                   result = null;
               }
               return result;
            },
            //1.获取用户地址列表.
            getAddressList: function(){  
              var vue = this;
              var isLocalAddr = window.localStorage.getItem("selectAddr");              
              //console.log("isLocalAddr",isLocalAddr ,isLocalAddr != null);
                api.getAddressList().then(function(data){
                  //console.log("data",data);
                  if (data.status == 200) {
                    var resultCode = data && data.data && data.data.result;
                    if (resultCode == 0) {
                      var resultValue = data && data.data && data.data.value;
                      //console.log("地址:",resultValue);
                      if (resultValue == null) {
                        vue.support.needAddress = true;
                      } else {
                      	//有地址
                      	var defaultAdd=vue.getDefaultAddress(resultValue);	//获取默认地址
                      	//var fromUrl = vue.$route.query.from || "";	//判断是订单详情跳入还是选择地址后跳入
                      	var url=window.location.href.toString()
                      	if(url.indexOf("selectedaddr")>=0){
                      		//从选择地址跳入，则获取缓存地址
                      		vue.business.address = JSON.parse(isLocalAddr);
                      	}else{
                      		//从商品详情跳入，判断是否有默认地址
                      		if(defaultAdd){
	                      		//有默认地址
	                      		vue.business.address = defaultAdd; 
	                      	}else{
				              	//无默认地址，获取第一个地址（最早添加）
				              	vue.business.address = resultValue[0]
	                      	}
                      	}
                      }
                    }
                  }
                },function(err){
                  vue.business.address = JSON.parse(isLocalAddr);
                })
                //判断来源URL
	            var backUrl=this.$router.from
	            if(backUrl=='/order'){
	            	//我的订单进入，不可修改地址
	            	vue.editAddress=false;
	            }else{
	            	vue.editAddress=true;
	            }
	            //console.log(vue.editAddress)

            },
            //从地址列表里获取到默认地址.
            getDefaultAddress: function(addressList){
                //console.log("从地址列表里获取到默认地址",JSON.stringify(addressList));
                var len = addressList != null ? addressList.length : 0;
                var defaultAddress = null;
                var isAllNo = false;
                var isAllNoIndex = 0;
                for(var i = 0; i < len ; i++) {
                  if (addressList[i].isDefault) {
                    defaultAddress = addressList[i];
                  } else {
                    isAllNoIndex = isAllNoIndex + 1;
                  }
                }
                //console.log("isAllNoIndex",isAllNoIndex,len -1);
                if (isAllNoIndex == len) {
                  defaultAddress = addressList[0];
                }
                return defaultAddress;
            },
            //已经有OrderNo的 《去付款》动作.
            hasOrderNoConfirm: function(orderNo){
              this.directPay(orderNo);
            },
            //没有OrderNo的《去付款》动作, 要新建orderNo.
            noOrderNoConfirm: function(){
              var orderParams = this.wrapperParams();
              var msg = this.validateVir(orderParams);
              //console.log("msg:",msg);
              if (msg.length > 0) {
                this.showTip(msg);
              } else {
                //console.log("创建订单的参数",orderParams,this.business.payType);
                if (this.business.payType == 2) {
                  this.lyqPay({});                  
                } else {
                  this.orderAndPay(orderParams);
                }
              }              
            },
            //验证虚拟商品提供的参数.. 也包括实物... 根据catId 来判断...
            validateVir: function(params){
              //console.log("验证虚拟参数:",params);
              var msg = "";
              var flag = true;
              if (params.addressId == null || params.addressId == undefined){
                if (this.catId == 1) {
                    msg += "请添加收货地址,";
                }
              }
              if (params.order != null) {
                  var userName = params.order.userName;
                  var phone = params.order.phone;
                  var detail = params.order.detail;
                  var regList = api.getRegList();
                  //console.log(regList.Mobile,/^1[0-9]{10}$/.test(phone));
                  if(userName == "") {
                    msg += "请输入收货人姓名,";
                  }
                  if (phone == "") {
                      msg += "请输入手机号码,";
                  }
                  if (detail=="") {
                      msg += "请输入充值类型,";
                  }
                  if(phone != "" && !regList.Mobile.test(phone)) {
                      flag = false;
                      msg += "请输入正确的手机号码,";
                  }
                  if(userName != "" && userName.length >= 20) {
                      flag = false;
                      msg += "用户名最多20位字符,";
                  }
                  if (detail != "" && detail.length >= 80){
                      flag = false;
                      msg += "充值账号最多80位字符,"
                  }
              }
              msg = msg.length > 0 ? msg.substring(0,msg.length-1) : "";
              return msg;
            },
            wrapperParams:function(){
              var orderParams = {};
            //获取orderInfo的数据.
              var orderInfo = this.getOrderInfo(0);   //orderNo == 0;
              //console.log("开始请求createOrder,拼接orderParams",orderInfo);
              var attrIdList = orderInfo && orderInfo.attrInfo && orderInfo.attrInfo.details;
              //console.log(JSON.stringify(attrIdList));
              var orderGoodsAttrs = [];
              for(var i = 0; attrIdList!= undefined && i< attrIdList.length; i++) {
                if (attrIdList[i] != "") {
                  var item = {attrDetailId:attrIdList[i].attrDetailId};
                  orderGoodsAttrs.push(item);
                }
              }
              if(this.catId == 1) {
                orderParams.addressId = this.business.address && this.business.address.id
              } else {
                orderParams.order ={
                    rechargeAccType: this.v_rechargeAccType, //充值账号类型
                    userName: this.v_userName, //充值用户
                    phone: this.v_phone, //充值手机号码
                    detail: this.v_detail //充值账号
                }
              }
              orderParams.goods = [
                {
                  orderGoods: {
                    goodsId:orderInfo.goodsId,
                    quantity: parseInt(orderInfo.nums)
                  },
                  orderGoodsAttrs:orderGoodsAttrs
                }
              ];
              return orderParams;
            },
            // 先创建订单，再获取支付链接之类的(需要orderNo);
            /**
             * orderNo 有几种情况,
             * 1: 初始进来就有orderNo ! ==0
             * 2: 初始进来order == 0
             * 3: 初始进来order == 0 ,但是创建了orderNO,没有付款成功的.
             **/
            confirmOrder: function(){            	
                //console.log("开始付款了,",this.orderNo);
                if (this.orderNo != 0) {
                    this.hasOrderNoConfirm(this.orderNo);                    
                } else {
                    this.noOrderNoConfirm();
                }                
            },
            //只是创建订单.
            createOrder: function(){
              var params = this.wrapperParams();
              var vue = this;
              var flag = false;
              var msg = "";
              var orderInfo = null;
              var orderId = "";
              var orderNo = "";
              api.isLogin();
              return api.createOrder(params).then(function(data){
                //console.log("创建订单",data);
                var orderNo = "";
                if (data.status == 200) {
                  var resultCode = data && data.data && data.data.result ;
                  //console.log("order resultCode",resultCode);
                  if (resultCode == 0) {
                    var resultValue = data && data.data && data.data.value;
                    if (resultValue && resultValue.length && resultValue.length > 0){
                       orderInfo = resultValue[0];
                       orderNo = resultValue[0].orderNo;
                       orderId = resultValue[0].id;
                      vue.temp.newOrderNo = orderNo;
                      vue.orderNo = orderNo;   //  this.orderNo 和this.temp.orderNo 是否后续可以移除一个。。。
                      //console.log("新创建的订单成功返回了:",JSON.stringify(orderInfo));

                      vue.$store.commit("setNewOrderNo",orderNo);
//                      vue.$store.commit("setOrderInfo",orderInfo);
                      flag = true;
                    }
                  } else {
                    msg = data && data.data && data.data.msg ;
                  }
                } else {
                   msg = "网络异常";
                }
                return {flag:flag,orderId:orderId,orderNo:orderNo,orderInfo:orderInfo,msg:msg,code:resultCode};
              })
            },
            orderAndPay: function(orderParams){
              var vue = this;
              var flag = false;
              var msg = "";
//              var isCango = this.validate(orderParams);

//              api.isLogin();
              var orderId = "";
              api.createOrder(orderParams).then(function(data){
                //console.log("创建订单",data);
                var orderNo = "";
                if (data.status == 200) {
                  var resultCode = data && data.data && data.data.result ;
                  //console.log("order resultCode",resultCode);
                  if (resultCode == 0) {
                    var resultValue = data && data.data && data.data.value;
                    if (resultValue && resultValue.length && resultValue.length > 0){
                      var orderNo = resultValue[0].orderNo;
                      var orderId = resultValue[0].id;
                      //console.log("orderNo",orderNo);
//                      vue.$route.params.newOrderNo = orderNo;
                      vue.$store.commit("setNewOrderNo",orderNo);
                      flag = true;
                    }
                  } else {
                    msg = data && data.data && data.data.msg ;
                  }
                }
                return {flag:flag,orderId:orderId,orderNo:orderNo,msg:msg,code:resultCode};
              }).then(function(result){
                var orderNo = result.orderNo;
                var flag = result.flag;
                if (flag) {
                  //console.log("第一步完成orderNo",orderNo);
                  //支付链接地址: orderNo,terminal,returnUrl
                  var payUrlParams = {
                    orderNo : orderNo ,
                    terminal : "4" || api.getCommonConfig("terminal"),
                    returnUrl: window.location.origin+"/index.html#"+"/payStatus/"+orderNo+"/"+vue.business.payType+ "?orderId="+result.orderId  ||  window.location.href || api.getCommonConfig("returnUrl")
                  }
                  vue.pay(payUrlParams);
                } else {
                  if (result.code == -100) {
                    window.location.href=api.getCommonConfig("loginUrl");
                  } else {
                    //console.log("let me show");
                    vue.support.tip = result.msg;
                    vue.support.tipShow = true;
                  }
                }
              })
            },

          /**
           * 如果是微信支付，支付宝支付。 需要封装参数获取支付链接。 乐盈券不需要获取支付链接。
           * @param orderNo
           */
          directPay: function(orderNo){
              var orderId = this.$route.query.orderId || 0;
              if (this.business.payType == 2) {
                  this.lyqPay({});
              } else {
                var payUrlParams = {
                  orderNo : orderNo ,
                  terminal : api.getCommonConfig("terminal") || "4",
                  returnUrl: window.location.origin+"/index.html#/payStatus/"+orderNo+"/"+this.business.payType + "?orderId="+orderId  ||  window.location.href || api.getCommonConfig("returnUrl")
                }
                this.pay(payUrlParams);
              }
            },
            pay: function(params) {
              if (this.business.payType == 0) {
                  this.wxPay(params);
              }  else if (this.business.payType == 1) {
                  this.aliPay(params);
              }
            },
            wxPay: function(params){
                //console.log("微信支付...",params);
              var self = this;
              api.wePay(params).then(function(data){
                if (data.status == 200) {
                  var resultCode = data && data.data && data.data.result ;
                  //console.log("微信支付接口的code",resultCode);
                  var resp = data && data.data && data.data.value && data.data.value.resp;
                  if (resultCode ==0 && resp != null) {
                    var payFlowNo = data && data.data && data.data.value && data.data.value.payFlowNo;
                    self.$store.commit("setPayFlowNo",payFlowNo);    //提交到状态管理器中，是为了后面的支付状态查询使用的.
                    window.localStorage.setItem(params.orderNo+"",payFlowNo);  // 防止回调回来的时候，状态丢失？？？ 。
                    //console.log(payFlowNo,self.$store.getters.getPayFlowNo);
                    window.location.href = api.getCommonConfig("payUrl") + "?"+resp;
                  }  else {
                    var msg = data && data.data && data.data.msg ;
                    if (msg == null) {
                        msg = data && data.data && data.data.value && data.data.value.msg;
                    }
                    self.support.tip = msg;
                    self.support.tipShow = true;
                  }
                }
              })
            },
            aliPay: function(params){
              var vue = this;
              api.aliPay(params).then(function(data){
                if (data.status == 200) {
                  var resultCode = data && data.data && data.data.result ;
                  if (resultCode ==0) {
                    var resp = data && data.data && data.data && data.data.value.respHtml;
                    var payFlowNo = data && data.data && data.data.value && data.data.value.payFlowNo;
                    vue.$store.commit("setPayFlowNo",payFlowNo);    //提交到状态管理器中，是为了后面的支付状态查询使用的.
                    window.localStorage.setItem(params.orderNo+"",payFlowNo);  // 防止回调回来的时候，状态丢失？？？ 。
                    vue.aliHtml = resp;
                    $("#ali_pay").html(resp);
                  } else {
                    var msg = data && data.data && data.data.msg ;
                    vue.support.tip = msg;
                    vue.support.tipShow = true;
                  }
                }
              })
            },

            /**
             * @desp 判断参数输入,再进行下去.
             **/
            lyqPay: function(params){
              //1. 判断是否设二级密码, 调用接口.  没有就设置.
              var vue = this;
              var orderMoney = 0;
              var isSecondPassword = false;
              var lyqAmount = this.getLyqAmount();
              var requestParams = this.wrapperParams();
              var msg = this.validateVir(requestParams);
              if (msg.length > 0) {
                  this.errorTip(msg);
              } else {
                   this.validateLyqInfo(lyqAmount);
              }
            },

            /**
             * @desp 获取乐盈券支付的金额
             **/
            getLyqAmount: function(){
              var amount = this.business.orderInfo.price * this.business.orderInfo.nums + this.business.orderInfo.deliveryFee;
              //console.log("a",JSON.stringify(this.business.orderInfo),this.business.orderInfo.price , this.business.orderInfo.nums , this.business.orderInfo.deliveryFee);
              var lyq = Math.ceil(amount);
              return lyq;
            },
            /**
             * @desp 判断是否有乐盈券和二级密码
             **/
            validateLyqInfo:function(lyqAmount){
              //console.log("开始判断是否有乐盈券和二级密码,",lyqAmount)
              var vue = this;
              api.isLogin().then(function(data){              	
                if (data.status == 200) {
                  var resultCode = data && data.data && data.data.result;
                  if (resultCode == 0) {
                    var member = data && data.data && data.data.value && data.data.value.member;
                    var lyq = member && member.lyq;
                    var isSecondPassword = member && member.paypwdFlag;
                    //console.log("是否有二级密码:",member,isSecondPassword,lyq);
                    if (isSecondPassword == 0) {
                      vue.support.showPasswordPopup = true;                      
                    } else if (parseFloat(lyq) < lyqAmount) {
                      vue.support.showQuanPopup = true;
                      vue.support.lyqAmount = parseFloat(lyq);
                      //console.log("vue.support.lyqAmoutn",vue.support.lyqAmount);
                    }
                    //console.log(isSecondPassword == 0 ,parseFloat(lyq) < lyqAmount);
                    if (isSecondPassword != 0 && parseFloat(lyq) >= lyqAmount) {
                      vue.support.showQuanPayPopup = true;
//                      vue.support.quanPayOrderNo = requestParams.orderNo;
                    }
                  } else {
                    var msg = data && data.data && data.data.msg ;
                    vue.errorTip(msg);
                  }
                } else {
                    vue.errorTip("服务器异常");
                }
              },
              function(err){
                  vue.errorTip("网络异常");
              })
            },
            // 请求乐盈券支付..
          /**
           * @desp
           * 11. 参数不符合规则, 提示用户, 不用后续步骤.
           * 2.  参数符合规则, 开始生产订单,
           *        订单生产失败,提示用户
           *        订单生产成功, 开始支付
           *                      支付成功,进入payStatues页面
           *                      用户名密码错误， 提示用户
           *                              再次输入密码，成功, 进入payStatus页面
           *                              失败,继续提示用户..
           * @param msg
           *
           * requestLyqPay , 是 用户输入密码之后，点击确定之后触发的。
           *      如果之前输入密码错误就需要重新支付， 但是需要判断上一次是否生产了orderNo,
           *      如果生产了orderNo ,就需要去支付,
           *      否则，重新生产订单.
           *
           *      有orderNo 的乐盈券支付， 需要注意，保存orderInfo,
           *      没有orderNO的乐盈券支付, 只需要把createOrder返回的结果保存下即可.
           */
            requestLyqPay: function(msg){
              var password = msg && msg.password;
              //console.log(md5.hex(password));
              var vue = this;
              if (vue.temp.newOrderNo != "" || vue.orderNo != 0) {
                var payParams = {
                  orderNo : vue.orderNo || vue.temp.newOrderNo,
                  password: md5.hex(password).toUpperCase()
                }

                if (vue.catId  == 2) {
                  vue.business.orderInfo.userName = vue.v_userName;
                  vue.business.orderInfo.phone = vue.v_phone;
                  vue.business.orderInfo.detail = vue.v_detail;
                }
                //console.log(vue.catId,vue.business.orderInfo);
                window.localStorage.setItem("lyqOrderInfo",JSON.stringify(vue.business.orderInfo));
                vue.$store.commit("setOrderInfo",vue.business.orderInfo);                
                vue.onlyPayByLyq(payParams);
              } else {              	
                this.createOrder().then(function(data){
                  //console.log("乐盈券创建订单结果",vue.catId,data);
                  if (data.flag) {
                    var sorderInfo = data.orderInfo;
                    if (vue.catId  == 2) {
                      sorderInfo.userName = vue.v_userName;
                      sorderInfo.phone = vue.v_phone;
                      sorderInfo.detail = vue.v_detail;
                    }
                    //添加选择商品属性
                    var orderInfo=vue.business.orderInfoBak;
                    sorderInfo["attrInfo"]=orderInfo.attrInfo;
                    
                    //补全收货人信息
                    var addr=vue.business.address
	                if(addr){
	                	sorderInfo.userName=addr.userName;
	                	sorderInfo.phone=addr.phone;
	                	sorderInfo.province=addr.province;
	                	sorderInfo.city=addr.city;
	                	sorderInfo.district=addr.district;
	                	sorderInfo.detail=addr.detail;
	                	sorderInfo.picUrl=orderInfo.picUrl;
	                	sorderInfo.name=orderInfo.name;
	                	sorderInfo.nums=orderInfo.nums;
	                	sorderInfo.price=orderInfo.price;
	                }
	                //不全商品信息
	                
	                console.log(sorderInfo)
                    window.localStorage.setItem("lyqOrderInfo",JSON.stringify(sorderInfo));
                    window.localStorage.setItem(data.orderInfo.orderNo,JSON.stringify(sorderInfo));    
                    vue.$store.commit("setOrderInfo",sorderInfo);
                    var orderNo = data.orderInfo.orderNo;
                    var payParams = {
                      orderNo :orderNo,
                      password: md5.hex(password).toUpperCase()
                    }                    
                    vue.onlyPayByLyq(payParams);
                    //console.log("go to onlyPayByLyq");
                  } else {
                    vue.errorTip(data.msg);
                  }
                })
              }


            },
            selectPayType: function(type){
                this.business.payType = type;
            },
            setVirtualInfo: function(target){
              target.userName = this.v_userName;
              target.phone = this.v_phone;
              target.detail = this.v_detail;
            },
            onlyPayByLyq : function(params){
              
              var vue = this;
              api.lyqPay(params).then(function(data){
                //console.log("乐盈券支付结果：",data);
                if (data.status == 200) {
                  var resultCode = data && data.data && data.data.result ;
                  var msg = data && data.data && data.data.msg;
                  if (resultCode ==0) {
                    window.localStorage.setItem("lyqPayStatus",true);
                    vue.$router.push({name:"payStatus",params:{orderNo:params.orderNo,payType:2}});
                  } else {
                    window.localStorage.setItem("lyqPayStatus",false);
                    vue.errorTip(msg);
                  }

                } else {
                  vue.errorTip("服务器异常");
                }
              },function(err){
                vue.errorTip("网络异常");
              })
            },

            back: function(){
				var backUrl=this.$router.from
				var fromurl = this.$route.query.from || "";	//商品详情
		      	if(backUrl!=""&&backUrl.indexOf("/address")>=0){
		      		//从确认订单页面返回，点击返回按钮，跳回到首页
		      		if(fromurl.indexOf("selectedaddr")>=0){
		      			fromurl=fromurl.substr(0,fromurl.indexOf("selectedaddr")-1)
		      			window.location.href=window.location.origin+window.location.pathname+"#"+fromurl
		      		}else{
		      			window.history.back();
		      		}
		      		//this.$router.push({name: "mall"});
		      	}else{
		      		window.history.back();
		      	}
            },
            showTip: function(msg){
              this.support.tipShow = true;
              this.support.tip = msg;
            },
            hidePopup: function(){
                //console.log("hide.........");
                this.support.showQuanPopup = false;
                this.support.showPasswordPopup = false;
                this.support.showQuanPayPopup = false;
            },
            hideTip:function(){
                  this.support.tipShow = false;
                  this.support.tip = "";
            },
            errorTip:function(msg){
              this.support.tip = msg;
              this.support.tipShow = true;
            }
        }
    }
</script>

<style lang="less" scoped>
  @import url("./../assets/css/order.less");
</style>
