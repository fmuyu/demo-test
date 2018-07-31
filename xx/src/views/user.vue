<template>
  <div class="user-account">
    <header class="header-wrapper">
      <div class="left" v-on:click="back()">
        <i class="icon icon-back"></i>
        <div class="name">返回</div>
      </div>
      <div class="title">会员中心</div>
    </header>
    <div class="content">
      <div class="user-info">
        <div class="user-pic">
          <img class="avatar" v-bind:src="member.headIcon"  v-img-error:default="logo"/>
          <div class="name" v-if="isLogin == 'true'">{{userName}}</div>
          <div class="btn-group" v-if="isLogin == 'false'">
            <div class="btn btn-login" v-on:click="login()">登录</div>
            <div class="btn btn-reg" v-on:click="reg()">注册</div>
          </div>
        </div>
        <div class="exit" v-on:click="exit()" v-if="isLogin == 'true'">退出</div>
      </div>

      <div class="opt-list">
      	
        <!--<router-link :to="{name:'order'}" class="opt-item">-->
        <div class="opt-item" @click="myOrders()">
          <div  class="left">
            <i class="icon icon-order"></i>
            <div class="name">我的订单</div>
          </div>
          <div class="right">
            <i class="icon icon-go"></i>
          </div>
        </div>
        <!--<router-link :to="{name:'address',query:{come:'user'}}" class="opt-item">-->
        <div class="opt-item" @click="myAddress()">
          <div class="left">
            <i class="icon icon-address"></i>
            <div class="name">我的地址</div>
          </div>
          <div class="right">
            <i class="icon icon-go"></i>
          </div>
        </div>
        <div class="opt-item" v-on:click="open()">
          <div class="left">
            <i class="icon icon-phone"></i>
            <!--<a class="name" v-bind:href="'tel:'+ member.phone" v-if="member.phone!=undefined || member.phone != null">联系我们</a>-->
            <div class="name" >联系我们</div>
          </div>
          <div class="right">
            <i class="icon icon-go"></i>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>
<script>
  import api from "./../api/data";
  import defaultLogo from "./../assets/img/logo.png";
  export default {
      name:'user',
      data: function(){
          return {
              isLogin:"",
              userName:"",
              phone:"",
              member:{},
              logo:defaultLogo
          }
      },
      watch:{
        '$route': function () {
          var self = this
          self.isLoading = true
          self.fetchData().then(function () {
            self.isLoading = false
          })
        }
      },
      created: function(){
        this.initData();
      },
      mounted: function(){
        //console.log("history.back（）");
      },
      methods:{
          open: function(){
            window.open(api.getCommonConfig("concat"));
          },
          login: function(){
            window.location.href = api.getCommonConfig("loginUrl")+"?url="+window.location.href;
          },
          reg: function(){
            window.location.href = api.getCommonConfig("regUrl");
          },
          /*我的订单*/
          myOrders:function(){
          	if(this.isLogin==="true"){
          		window.location.href = "/index.html#/order"
          	}else{
          		this.login();
          	}
          },
          /*我的地址*/
          myAddress:function(){
          	if(this.isLogin=="true"){
          		window.location.href ="/index.html#/address?come=user"
          	}else{
          		this.login();
          	}
          },
          exit: function(){
            var self = this;
            api.logout().then(function(data){
                if (data.status == 200) {
                    var resultCode = data && data.data && data.data.result;
                    if (resultCode == 0) {
                        //debugger;
                      self.setCookie("user_lyy_com", "", -1);
                      self.setCookie("passport_lyy_com", "", -1);
                      self.setCookie("regTime_lyy_com", "", -1);
                      self.setCookie("UM_distinctid","",-1);
                      sessionStorage.removeItem('userId');
                      sessionStorage.removeItem('shopId');
                      sessionStorage.removeItem('icon');
                      sessionStorage.removeItem('status');
                      /*退出时刷新当前页面*/
                      var url=location.href;
                      if(url.indexOf('?')){
                      	url=url.substr(0,url.indexOf('?'))
                      }
                      window.location.href=url;
                      location.reload()
                    }
                }
            })
          },
          delCookie: function(name,value){
              var exp = new Date();
              exp.setTime(exp.getTime() - 1);
              var cval=this.getCookie(name);
              if(cval!=null)
                document.cookie= name + "="+value+";expires="+exp.toGMTString();
          },
          getCookie: function(name){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
              return unescape(arr[2]);
            else
              return null;
          },
          setCookie: function(c_name, value, expiredays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            document.cookie = c_name + "=" + value + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())+ ";path=/" + ((location.host.indexOf(api.getCommonConfig("cokieDomain")) > -1) ? ";domain=" + api.getCommonConfig("cokieDomain") + "" : "");
          },
        initData: function(){
            var self = this;
            api.isLogin().then(function(data){
                //console.log("data",data);
                if (data.status == 200) {
                    var resultCode = data && data.data && data.data.result;
                    var result = data && data.data && data.data.value;
                    if (resultCode == 0) {
                        self.userName = result.username;
                        self.isLogin = "true";
                        self.member = result.member;
                        self.phone = result.mobile ;
                    } else {
                        self.isLogin = "false";
                    }
                } else {
                    self.isLogin = "false";
                }
            },function(err){
                self.isLogin = "false";
            })
          },
          back: function(){
          	  //登录操作需要做特殊处理，只能返回上上级页面
              var loginInfo=this.$route.query
              if(loginInfo&&loginInfo.uid&&loginInfo.time&&loginInfo.sign){
              	window.location.href=window.location.origin+"/index.html"
              }else{
              	window.history.back()
              }
          }
      }
  }
</script>

<style lang="less" scoped>
  @import url("./../assets/css/user.less");
</style>
