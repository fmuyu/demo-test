<template>
  <div class="mall-address">
    <header class="header-wrapper header-shadow">
      <div class="left" v-on:click="back()">
        <i class="icon icon-back"></i>
        <div class="back">返回</div>
      </div>
      <div class="center">地址管理</div>
    </header>

    <div class="content">
        <div class="address-list">
          <div class="address-item"  v-for="item in newAddressList">
              <div class="left" v-on:click="selectAddr(item)">
                <div class="name-phone">
                  <span class="name">{{item.userName}}</span>
                  <span class="phone">{{item.phone}}</span>
                  <span class="default" v-if="item.isDefault">[默认]</span>
                </div>
                <div class="addr-detail">
                  {{item.province}}{{item.city}}{{item.district}}{{item.detail}}
                </div>
              </div>
              <router-link :to="{name:'addAddr',query:{id:item.id}}" tag="div" class="right">
                  <i class="icon icon-edit"></i>
              </router-link>
          </div>
        </div>
        <div class="add-addr" @click="enableAdd()">
            <div class="add-btn">
              <span>新增收货地址</span>
            </div>
        </div>
    </div>

    <tip :tip="tip" :tipShow="tipShow"  v-if="tipShow" v-on:hideTip="hideTip"></tip>
  </div>
</template>

<script>
  import api from "./../api/data";
  export default {
    name: 'address',
    data: function(){
      return {
          addrs:[],
          tip:"",
          tipShow:false
      }
    },
    created: function(){

      this.initData();
    },
    computed:{
    	//地址列表重组，默认地址放在第一位
    	newAddressList:function(){
    		var defaultIndex=0;
    		for(var i in this.addrs){
    			if(this.addrs[i].isDefault){
    				defaultIndex=i;
    			}
    		}
    		if(defaultIndex>0){
    			var obj=this.addrs[defaultIndex];
    			this.addrs.splice(defaultIndex,1)
    			this.addrs.unshift(obj)
    		}
    		return this.addrs;
    	}
    },
    methods:{
        initData: function(){
          var self = this;
          api.getAddressList().then(function(data){
              if (data.status == 200){
                  var resultCode = data && data.data && data.data.result;
                  var result = data && data.data && data.data.value;
                  if (resultCode == 0) {
                      self.addrs = result;
                  } else if (resultCode == -100) {
                      window.location.href = api.getCommonConfig("loginUrl");
                  }
              } else {
                self.showTip("服务器异常");
              }
          },function(err){
              self.showTip("网络异常");
            }
          )
        },
        enableAdd:function(){
        	if(this.addrs&&this.addrs.length==5){
        		this.showTip("您已保存超过5条地址，请返回修改！");
        	}else{
        		this.$router.push({name: "addAddr"});
        	}
        	return;
        },
        selectAddr:function(item){
        	//此处作调整，不是从确认订单页面过来的，不保存到缓存中            
            var fromurl = this.$route.query.fromurl || "";	//商品详情
            var comes = this.$route.query.come || "";		//个人中心
            if(fromurl){
            	//商品详情进入，点击地址列表保存缓存，跳转到商品详情页面
            	window.localStorage.setItem("selectAddr",JSON.stringify(item));
             	window.location.href="/index.html#"+fromurl+"/selectedaddr"
							//var catId=
							//var from="goodDetail";
            	//self.$router.push({name:'orderConfirm',params:{"orderNo":0,catId:self.business.details.catId},query:{from:self.$route.fullPath}});
            }
            if (comes){
            	//个人中心进入进入，点击地址列表后回退
              window.history.back();
            }
        },
        back:function(){
            window.history.go(-1);
        },
        showTip: function(msg){
          this.tipShow = true;
          this.tip = msg;
        },
        hideTip: function(){
              this.tipShow = false;
              this.tip = "";
        }
    }
  }
</script>

<style lang="less" scoped>
  @import url("./../assets/css/address.less");
</style>
