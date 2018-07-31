<template>
  <div class="shop-home">
    <header class="header-fixed so-header header-shadow">
      <div  class="header-wrapper">
        <div class="left" v-on:click="back()">
          <i  class="icon-back"></i>
        </div>
        <div  class="search-wrapper">
          <i class="icon-search" v-on:click="queryKey()"></i>
          <form action="javascript:void(0)" id="search-form" class="input-kw-form"  autocorrect="off" autocomplete="off" autocapitalize="off">
            <input type="search" maxlength="20" placeholder="搜索商品" v-model="business.searchKey"></input>
          </form>
        </div>
        <div class="right">
        </div>
      </div>
    </header>
    <div class="shop-desp">
      <div class="left" v-show="business.shopInfo != null">
        <img v-bind:src="business.shopInfo.logoUrl"/>
      </div>
      <div class="right">
        <div class="shop-name" v-show="business.shopInfo != null">
            {{business.shopInfo.name}}
        </div>
        <div class="shop-phone" v-show="business.shopInfo != null">
             联系商家:{{business.shopInfo.servicePhone}}
        </div>
      </div>
    </div>

    <div class="list-tabs">
      <ul class="tabs">
        <li class="tab-item" :class="{'active':support.activeItem == 0}" v-on:click="queryTabs(0)">人气</li>
        <li class="tab-item"  :class="{'active':support.activeItem == 1}" v-on:click="queryTabs(1)">销量</li>
        <li class="tab-item"  :class="{'active':support.activeItem == 2}" v-on:click="queryTabs(2)">价格</li>
        <li class="tab-item"  :class="{'active':support.activeItem == 3}" v-on:click="queryTabs(3)">最新</li>
      </ul>
    </div>
    <div class="shop-content">
      <div class="good-lists list-content">
        <div class="shop-lists ">
          <router-link :to="{name:'goodDetail',params:{goodId:newItem.id}}" tag="div" class="item two-cell" v-for="newItem in business.goods">
            <img class="item-pic" v-bind:src="newItem.picUrl"/>
            <div class="name  flex-vertical">
              <div class="title">{{newItem.name}}</div>
            </div>
            <div class="price">￥{{newItem.price | FloatTwo}}</div>
          </router-link >
          <div class="no-key" v-if="business.goods.length == 0 && business.searchKey.length > 0 && isKey ">没有{{business.searchKey}}相关的商品</div>
        </div>
        <div class="no-more" v-if=" support.last && isKey == false">没有更多商品了！</div>
      </div>
    </div>

    <!-- 下拉加载更多 -->
    <infinite-scroll :scroller="support.loadScroller" :loading = "support.loading" @load="loadMore()"></infinite-scroll>
  </div>
</template>

<script>
  import api from "./../api/data";
  export default {
      name:'shop',
      data:function(){
          return {
              support:{
                currentPage:0,
                loadScroller:$(".shop-content")[0],
                loading:false,
                  last :false,
                  activeItem:0,
                  orderTypes:["desc","desc","desc","desc"]  //记录每个的排序.
              },
              business:{
                isKey: false,
                searchKey:"",
                shopInfo:{
                    logoUrl:"",
                     name:"",
                    servicePhone:""
                },
                goods:[],
                queryType:["pvValue","salesAmount","price","createTime"] //人气,热门 ,价格, 新品,
              }
          }
      },
      created: function(){
      },
      mounted: function(){
        var shopId = this.$route.params.shopId || 0;
        this.initGoods(shopId);
        this.initInfo(shopId);
        var self = this;
        $("#search-form").on("submit",function(){
          self.queryKey();
        })
        this.support.loadScroller = $(".shop-content")[0];
      },
      methods: {
          initInfo: function(shopId){
            this.support.last = false;
            this.isKey = false;
            var params = {
              shopId:shopId
            }
            var self = this;
            api.getShopInfo(params).then(function(data){
                if (data.status == 200) {
                    var resultCode = data && data.data && data.data.result;
                    if(resultCode == 0) {
                      var result = data && data.data && data.data.value;
                      self.business.shopInfo = result;
                    }
                }
            })
          },
          initGoods: function(shopId){
            this.support.last = false;
            this.isKey = false;
            var params = {
              shopId:shopId,
              category:0,
              page:0,
              size:6,
              sort:"pvValue,desc"
            }
            var self = this;
            api.getShopGoods(params).then(function(data){
              //console.log("商品信息:",data);
              if (data.status == 200) {
                var resultCode = data && data.data && data.data.result;
                if(resultCode == 0) {
                  var result = data && data.data && data.data.value;
                  self.support.last = result.last;
                  self.business.goods = result.content;
                }
              }
            })
          },

          queryTabs: function(no){
            this.support.currentPage = 0;
            this.support.last = false;
            this.isKey = false;
            this.support.activeItem = no;
            //console.log($(".good-lists"),$(".good-lists").length);
            if ($(".shop-content").length > 0) {
              $(".shop-content").scrollTop(0);
            }
            //排序的相互交替...
            if (this.support.activeItem == this.support.preActiveItem) {
              //反序排
              if (this.support.orderTypes[no] == "desc") {
                this.support.orderTypes[no] = "asc";
              } else {
                this.support.orderTypes[no] = "desc";
              }
            } else {
              this.support.orderTypes[no] = "desc";
            }
            this.support.preActiveItem = no;

            this.business.searchKey = ""; // 全局搜索置换为空..
            //console.log(JSON.stringify(this.business.shopInfo));
            //参数.
            var params = {
              shopId:this.business.shopInfo.shopId,
              category:0,
              page : 0,
              size : 6,
              sort : this.business.queryType[no] +","+this.support.orderTypes[no]  //默认热门。
            }
            var vue = this;
            this.support.loadingShow = true;
            api.goodsQuery(params).then(function(data){
              if (data.status == 200) {
                var result = data && data.data && data.data.value;
                var resultCode = data && data.data && data.data.result;
                if (resultCode == 0) {
                  vue.business.goods = result.content;
                  vue.support.last = result.last;
                }
              }
            }).then(function(){
              vue.support.loadingShow = false;
            })
          },
          queryKey: function(){
            this.isKey = true;
            this.support.activeItem = 0;
            this.support.last = false;
            var params = {
              shopId:this.business.shopInfo.shopId,
              category:0,
              name : this.business.searchKey,
              page : 0,
              size : 6,
              sort : "pvValue,desc"  //默认人气。
            }
            var vue = this;
            this.support.loadingShow = true;
            api.goodsQuery(params).then(function(data){
              if (data.status == 200) {
                var result = data && data.data && data.data.value;
                var resultCode = data && data.data && data.data.result;
                if (resultCode == 0) {
                  vue.business.goods = result.content;
                  vue.support.last = result.last;
                }
              }
            }).then(function(){
              vue.support.loadingShow = false;
            })
          },
          back: function(){
              window.history.back();
          },
          loadMore: function(){
            var page = this.support.currentPage + 1;
            //参数.
            var params = {
              category:0,
              name : this.business.searchKey,
              page : page,
              size : 6,
              sort : this.business.queryType[this.support.activeItem] +","+this.support.orderTypes[this.support.activeItem]  //默认热门。
            }
            var vue = this;
            vue.support.loading = true;
            api.goodsQuery(params).then(function(data){
              if (data.status == 200) {
                var result = data && data.data && data.data.value;
                var resultCode = data && data.data && data.data.result;
                if (resultCode == 0) {
                  vue.business.goods = vue.business.goods.concat(result.content);
                  vue.support.currentPage = vue.support.currentPage + 1;
                  vue.support.last = result.last ;
                } else {
                  var msg = data && data.data && data.data.msg;
                  vue.support.tip = msg;
                  vue.support.tipShow = true;
                }
              }
            }).then(function(){
              vue.support.loadingShow = false;
              vue.support.loading = false;
            })
          }
      }
  }
</script>

<style lang="less" scoped>
  @import url("./../assets/css/shop.less");
</style>
