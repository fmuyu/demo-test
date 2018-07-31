<template>
  <div class="mall-list">
    <!--<div class="list-header">-->
      <!--<router-link tag="i" :to="{path:'mall'}" class="icon-back"></router-link>-->
      <!--<div class="search-wrapper">-->
        <!--<i class="icon-search" v-on:click="queryKey()"></i>-->
        <!--<input type="search" placeholder="搜索商品/店铺名称" v-model="business.searchKey"></input>-->
      <!--</div>-->
    <!--</div>-->
    <!-- 头部 -->
    <header class="header-fixed so-header header-shadow">
      <div  class="header-wrapper">
        <div class="left">
          <router-link tag="i" :to="{path:'mall'}" class="icon-back"></router-link>
        </div>
        <router-link :to="{path:'/mallList'}" tag="div"  class="search-wrapper">
          <i class="icon-search" v-on:click="queryKey()"></i>
          <form action="javascript:void(0)" id="search-form" class="input-kw-form"  autocorrect="off" autocomplete="off" autocapitalize="off">
            <input class="search" type="search" placeholder="搜索商品" v-model="business.searchKey" ></input>
          </form>
        </router-link>
        <div class="right">
          <!--<i class="icon-user"></i>-->
        </div>
      </div>
    </header>
    <div class="list-tabs">
      <ul class="tabs">
        <li class="tab-item" :class="{'active':support.activeItem == 0}" v-on:click="queryTabs(0)">人气</li>
        <li class="tab-item"  :class="{'active':support.activeItem == 1}" v-on:click="queryTabs(1)">销量</li>
        <li class="tab-item"  :class="{'active':support.activeItem == 2}" v-on:click="queryTabs(2)">价格</li>
        <li class="tab-item"  :class="{'active':support.activeItem == 3}" v-on:click="queryTabs(3)">最新</li>
      </ul>
    </div>
    <div class="good-lists list-content">
      <div class="new-lists ">
          <router-link :to="{name:'goodDetail',params:{goodId:newItem.id}}" tag="div" class="item two-cell" v-for="newItem in business.goods">
            <img class="item-pic" v-bind:src="newItem.picUrl"/>
            <div class="name  flex-vertical">
              <div class="title">{{newItem.name}}</div>
            </div>
            <div class="price">￥{{newItem.price | FloatTwo}}</div>
          </router-link >
          <div class="no-more" v-show="support.last">
		        没有更多的商品了...
		      </div>
      </div>

      
      <div class="no-key" v-if="business.searchKey.length > 0 && business.goods.length == 0 && isKey ">
        没有{{business.searchKey}}相关的商品
      </div>
      <!-- 下拉加载更多 -->
      <infinite-scroll :scroller="support.loadScroller" :loading = "support.loading" @load="loadMore()"></infinite-scroll>

      <!-- loading -->
      <loading :loadingShow="support.loadingShow"></loading>

        <tip :tip="support.tip" :tipShow="support.tipShow"></tip>
    </div>
  </div>
</template>


<script>
  import api from './../api/data'
  export default {
      name: 'mallList',
      data: function() {
          return {
              support: {
                isKey:false,
                  last:false, // 是否最后一页.
                  tip:"",
                tipShow:false,
                loadingShow: false, //是否显示加载组件.
                currentPage : 0,
                loadScroller:$(".new-lists")[0],
                loading:false,
                activeItem:0,
                preActiveItem:-1,  //用户未点击动作。
                orderTypes:["desc","desc","asc","desc"]  //记录每个的排序.
              },
              business:{
                  searchKey:"",
                  goods:[],
                  queryType:["pvValue","salesAmount","price","createTime"] //人气,热门 ,价格, 新品,
              }
          }
      },
      created: function(){
        var type = this.$route.query.type || "";
        //console.log("type",type);
        if (type == "hot") {
            this.support.activeItem = 1; // 热门.
            //console.log("查询热门");
            this.queryTabs(1);
        }
        if (type == "new") {
            this.support.activeItem = 3;  //新品.
          //console.log("查询新品");
            this.queryTabs(3);
        }
        if (type == "") {
            this.init();
          //console.log("查询人气");
        }
      },
      mounted: function(){
        this.support.loadScroller = $(".new-lists")[0];
        var vue = this;
        $("#search-form").on("submit",function(){
          vue.queryKey();
        })
        $("#search-form").on("keypress",function(e){
            //console.log("keypress");
          vue.isKey = false;
          var keycode = e.keyCode; 
          if(keycode=='13') {  
              $('.search').blur()   
                      
          }  
        })
      },
      methods: {
        init: function(){
          this.isKey = false;
          var vue = this;
          this.support.loading = true;
          api.mallHomeNew().then(function(data){
            if (data.status == 200) {
              var result = data && data.data && data.data.value;
              var resultCode = data && data.data && data.data.result;
              if (resultCode == 0) {
                vue.business.goods = result.content;
              }
            }
          }).then(function(){
            vue.support.loading = false;
          })
        },
        loadMore: function() {
          this.isKey = false;
            //console.log("loading more");
          var page = this.support.currentPage + 1;
          //参数.
          var params = {
            category:0,
            name : this.business.searchKey,
            page : page,
            size : 20,
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
        },
        query: function(){

        },
        //tabs查询 .
        queryTabs : function(no){
          this.isKey = false;
          this.support.activeItem = no;
          this.support.currentPage  = 0;
          //console.log($(".good-lists"),$(".good-lists").length);
          if ($(".good-lists").length > 0) {
            $(".good-lists").scrollTop(0);
          }
          //排序的相互交替...
          if (this.support.activeItem == this.support.preActiveItem) {
            //反序排
            if (this.support.orderTypes[no] == "desc") {
                this.support.orderTypes[no] = "asc";
            } else {
                this.support.orderTypes[no] = "desc";
            }
          }else {
              //除了价格，是升序
              this.support.orderTypes[no] = "desc";
              this.support.orderTypes[2] = "asc";
          }
          this.support.preActiveItem = no;

          //参数.
          var params = {
            category:0,
            name : this.business.searchKey,
            page : 0,
            size : 20,
            sort : this.business.queryType[no] +","+this.support.orderTypes[no]  //默认热门。
          }
          var vue = this;
          this.support.loadingShow = true;
          // 销量需要2个排序的.
          //console.log(params,this.support.orderTypes);
          api.goodsQuery(params,no).then(function(data){
            if (data.status == 200) {
              var result = data && data.data && data.data.value;
              var resultCode = data && data.data && data.data.result;
              if (resultCode == 0) {
                vue.business.goods = result.content;
              }
              //console.log(vue.business.goods );
            }
          }).then(function(){
              vue.support.loadingShow = false;
          })
        },

        //关键字查询.
        queryKey: function(){
            this.isKey = true;
            this.support.activeItem = 0;
            var params = {
              category:0,
              name : this.business.searchKey,
              page : 0,
              size : 20,
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
                }
                //console.log(vue.business.goods );
              }
            }).then(function(){
                vue.support.loadingShow = false;
            })
        }
      }
  }
</script>

<style lang="less" scoped>
  @import url('./../assets/css/mallList.less');
</style>
