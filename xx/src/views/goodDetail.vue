<template>
  <div class="good-detail">
    <header class="header-fixed so-header header-shadow">
      <div  class="header-wrapper">
        <div v-on:click="back()" class="left">
          <i class="icon-back"></i>
          <span class="back">返回</span>
        </div>
        <div class="name">商品详情</div>
      </div>
    </header>

    <div class="detail-content">
      <div class="detail-loop swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="item in business.details.picUrls">
              <img v-bind:src="item.picUrl"/>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>

      <div class="good-name">
          {{business.details.name}}
      </div>

      <div class="good-price">
          ￥{{business.details.price | FloatTwo}}
      </div>


      <!-- 商品属性，规格-->
      <div class="good-spec" v-if="business.details.attrs && business.details.attrs.length > 0">
          <div class="left">已选</div>
          <div class="right" v-on:click="openSpec()" v-if="business.details.specs && business.details.specs[0] && business.details.specs[0].details">
            <span class="spec-detail-item" v-for="(ditem,dindex) in business.details.specs[0].details">
              <em v-if="dindex != 0">,</em>{{ditem.name}}
            </span>
          </div>
          <div class="link-shop" v-on:click="openSpec()">
            <i class="icon-right"></i>
          </div>
      </div>
      <!-- 无商品属性,规格的-->
      <div class="good-spec" v-if="business.details.attrs && business.details.attrs.length == 0">
        <div class="left">购买数量</div>
        <div class="">
            <num-comp v-on:subChangeNum="orderChangeNum" :buyNums="business.sub.nums"></num-comp>
        </div>
      </div>

      <div class="good-fee">
        <div class="left" style="width:auto;">邮费</div>
        <!-- @@@@@@@@@ 为0或null, 包邮-->
        <div class="right" v-if="business.details.deliveryFree != true">
            ￥{{business.details.deliveryFee | FloatTwo}}
        </div>
        <div class="right" v-if="business.details.deliveryFree == true">
          包邮
        </div>
        <div class="icon-text">
          <i></i>
          <span>商家发货&售后</span>
        </div>
      </div>

      <!-- 商家店铺信息-->

      <div class="good-shop">
        <div class="shop-logo">
          <img v-bind:src="business.details.shop.logoUrl"/>
        </div>
        <div class="shop-desp">
          <span class="desp-name">{{business.details.shop.name}}</span>
          <span class="desp-sub">乐思购商城</span>
        </div>
        <div class="right">
          <router-link tag="a" :to="{name:'shop',params:{shopId:business.details.shop.shopId}}">进入店铺</router-link>
        </div>
      </div>

      <div class="more-detail">
        <div class="more-detail-header">
          <div class="more-detail-title">详情</div>
          <div class="dot-line"></div>
        </div>
        <div class="more-detail-content" v-html="business.details.description">
        </div>
      </div>
    </div>


    <specs-comp v-if="support.specCompShow"
                :attrs="business.details.attrs"
                :specs="business.details.specs"
                :pic = "business.details.picUrls[0].picUrl"
                v-on:subUpdateSpec="subUpdateSpec"
                v-on:subChangeNums = "subChangeNums"
                v-on:exitSpec="support.specCompShow = false">
    </specs-comp>
    <footer class="footer-fixed  btn buy-btn" v-if="enableBuy" v-on:click="buy()">立即购买</footer>
		<footer class="footer-fixed  btn buy-btn btn_disabled" v-if="!enableBuy">立即购买</footer>
    <tip :tip="support.tip" :type="'mall'" :sub="support.sub" :tipShow="support.tipShow" v-if="support.tipShow" v-on:hideTip="hideTip"></tip>

  </div>
</template>

<script>
  import api from './../api/data'
  import specsComp from './../components/specs';
  import numComp from './../components/numComp';
  export default {
    name: 'goodDetail',
    components:{
      'specsComp':specsComp,
      'numComp':numComp
    },
    data: function(){
      return {
          support:{
            specCompShow:false,
            tip:"",
            sub:"",
            tipShow:false
          },
          business:{
              //子组件更新的数据.
              sub:{
                  attrInfo:{},
                  price:0.00,
                  nums:1,
                  stock:0		//选定规格对应的库存
              },
              details:{
                  shop:{
                      logoUrl:"",
                      name:"",
                      majorBusiness:""
                  }
              }
          },
          enableBuy:true	//允许购买
      }
    },
    mounted: function(){
      var goodsId = this.$route.params && this.$route.params.goodId;
      //console.log(goodsId);
      window.localStorage.setItem("goodId",goodsId);
      this.init(goodsId);
      this.initSwiper();         
    },
    methods:{
      initSwiper: function(){
          var swiper = new Swiper('.detail-loop',{
            pagination : '.swiper-pagination',
            paginationType : 'fraction',
            observer:true,
            observeParents:true
          })
      }  ,
      init: function(goodsId){
        var vue = this;
        api.goodsDetail(goodsId).then(function(data){
            if (data.status == 200) {
                var result = data && data.data && data.data.result;
                if (result == 0) {
                  var values = data && data.data && data.data.value;
                  vue.business.details = values;
                }
            }
            //console.log("data",vue.business.details.shop);
        })
      },
      //购买验证...
      validateBuy: function(){
        var flag = true;
        var stock=0;
        var spec=this.business.details.specs;
        if(spec[0]!=undefined){
        	//存在选择规格，以选择规则对应库存为准
        	if(this.business.sub.attrInfo.spec!=undefined){
        		stock = this.business.sub.attrInfo.spec.stock || 0;
        	}else{
        		stock = this.business.details.stock || 0;
        	}
        }else{
        	//没有筛选属性，以商品总库存为准
        	stock = this.business.sub.stock || 0;
        }
        //console.log(stock)
        var buyLimit = this.business.details.buyLimit || 0;
        var nums = this.business.sub.nums;
        //console.log(nums,buyLimit,stock);
        if (nums > stock) {
            this.showTip("超过库存数量");
            if (buyLimit != 0) {
                if (nums > buyLimit) {
                  this.showTip("超过购买限制数量"+buyLimit);
                  flag = false;
                }
            }
            flag = false;
        } else {
          if (buyLimit != 0) {
            if (nums > buyLimit) {
              this.showTip("超过购买限制数量"+buyLimit);
              flag = false;
            }
          }
        }
        return flag;
      },
      //buy
      /**
       * 用户未登录，点击立即购买则跳转至登录页面/浮窗，登录完成后返回至当前页面
       *若用户已登录
       当商品无规格属性则跳转至订单结算页面
       当商品有规格则上拉出规格选择浮窗，在选定规格后点击立即购买跳转至订单结算页面
       */
      buy: function(){
        var self = this;
        
        //console.log("开始购买:",canGo);
        
          if (this.support.specCompShow) {
          	var canGo = this.validateBuy();
          	if (!canGo) {
		          this.business.sub.nums = 1;
		          return;
		        }
            //进入订单结算页面.
            //console.log("进入订单结算页面");
            api.isLogin().then(function(data){
              var islogin = false;
              if (data.status == 200) {
                islogin = data.data && (data.data.result == 0);
              }
              //console.log("login",islogin);
              if (islogin) {
                /**
                 * 
                goodsId: 26, //商品编码
                quantity: 15, //购买数量
                attrDetailIds: [1,2,3]
                */
                  //订单需要的信息.
                var orderInfo = self.getOrderObj();
                var checkParams = self.wrapperCheckGoodsParams(orderInfo);
                self.checkGoodBuy(checkParams);
              } else {
                self.noLoginOpt();
              }
            })
          } else {
            self.openSpec();
          }        
      },
      checkGoodBuy: function(params){
        var self = this;
        api.checkBuyGoods(params).then(function(checkData){
          if (checkData.status == 200) {
            var resultCode = checkData && checkData.data && checkData.data.result;
            var msg = checkData && checkData.data && checkData.data.msg;
            if (resultCode == 0) {
//                //console.log(self.$route);
              self.$router.push({name:'orderConfirm',params:{"orderNo":0,catId:self.business.details.catId},query:{from:self.$route.fullPath}});
            } else {
              self.showTip(msg);
              self.enableBuy=false;
            }
          } else {
            self.showTip("服务器异常");
          }
        },function(){
          self.showTip("网络异常");
        })
      },
      wrapperCheckGoodsParams: function(orderInfo){
        //console.log("wrapperCheckGoodsParams",orderInfo)
        var attrInfo = orderInfo.attrInfo;
        var attrDetailIds = [];
        if (attrInfo && attrInfo.details) {
            for(var i = 0; i<attrInfo.details.length; i++) {
              attrDetailIds.push(attrInfo.details[i].attrId);
            }
        }
        var checkParams = {
          goodsId : orderInfo.goodsId,
          quantity : orderInfo.nums,
          attrDetailIds:attrDetailIds
        }
        return checkParams;
      },
      //购买的时候，获取到需要的订单信息.vue.business.details
      //商品主图缩略图,商品名称,属性规格列表, 商品价格, 商品数量
      //配送, 普通快递||虚拟发货.

      getOrderObj: function(isHaveAttr){
        var orderInfo = {};
        orderInfo.goodsId = this.business.details.id;
        orderInfo.picUrl = this.getMainPic();
        orderInfo.deliveryFee = this.business.details.deliveryFee; //
        orderInfo.deliveryInfo = "普通快递" || "虚拟发货";  //
        orderInfo.name = this.business.details.name ;
        orderInfo.nums = this.business.sub.nums;
        //console.log(isHaveAttr == false,isHaveAttr);
        if (isHaveAttr == false) {
          orderInfo.attrInfo = {};
          orderInfo.price = this.business.details.price;
        } else {
          orderInfo.attrInfo = this.business.sub.attrInfo;
          orderInfo.price = this.business.sub.price;
        }
        window.localStorage.setItem("orderInfo",JSON.stringify(orderInfo));
        this.$store.commit("setOrderInfo",orderInfo);
        //console.log("getOrderObj store",orderInfo);
        return orderInfo;
      },

      noLoginOpt: function(){
        window.location.href=api.getCommonConfig("loginUrl");
      },
      //选择规格
      openSpec: function(){
        //console.log("ok");
        var self = this;
        if (this.business.details.attrs && this.business.details.attrs.length > 0){
          this.support.specCompShow = true;
        } else {
          api.isLogin().then(function(data){
            //console.log("login",data);
            var islogin = false;
            if (data.status == 200) {
              islogin = data.data && (data.data.result == 0);
            }
            if (islogin) {
              //订单需要的信息.
              var orderInfo = self.getOrderObj(false);
              //订单需要的信息.
              var checkParams = self.wrapperCheckGoodsParams(orderInfo);
              self.checkGoodBuy(checkParams);
            } else {
              self.noLoginOpt();
            }
          })
        }
      },

      //获取主图信息
      getMainPic: function(){
        var mainPicUrl = "";
        if (this.business.details && this.business.details.picUrls && this.business.details.picUrls.length > 0) {
            mainPicUrl = this.business.details.picUrls[0].picUrl || "";
        }
        return mainPicUrl;
      },
//      openSpec: function() {
//          this.support.specCompShow = true;
//      }

      showTip: function(msg) {
        this.support.tip = msg;
        this.support.sub = "";
        this.support.tipShow = true;
        this.support.specCompShow = false;
      },
      hideTip: function(){
        this.support.tip = "";
        this.support.sub = "";
        this.support.tipShow = false;
      },
      // 子组件的信息.
      subUpdateSpec: function(info){
          //console.log("子组件更新的数据",info);
          this.business.sub.attrInfo = info != null ? info.info : {};
          this.business.sub.price = info != null ? info.price : 0.00;
          this.business.sub.stock = info !=null ? info.info.stock : 0;
          //console.log("子组件更新的数据",this.business.sub.price,this.business.sub.attrInfo);
      },
      subChangeNums : function(info){
          //console.log("更新子数组",info);
          this.business.sub.nums = info != null ? info.info.num : 1;
          //console.log(this.business.sub.nums);
          //console.log("更新子数组",this.business.sub.nums);
      },
      orderChangeNum: function(info){
        //console.log("更新子数组",info);
        this.business.sub.nums = info != null ? info.num : 1;
        //console.log("更新子数组",this.business.sub.nums);
      },
      back: function(){
      	var backUrl=this.$router.from
      	if(backUrl!=""&&backUrl.indexOf("orderConfirm")>=0){
      		//从确认订单页面返回，点击返回按钮，跳回到首页
      		//window.location.href=this.$router.go()
      		this.$router.push({name: "mall"});
      	}else{
      		window.history.back();
      	}
        //window.history.back();
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url('./../assets/css/goodDetail.less');
</style>
