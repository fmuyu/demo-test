<template>
  <div class="add-address">
    <header class="header-wrapper header-shadow">
      <div class="left" v-on:click="back()">
        <i class="icon icon-back"></i>
        <div class="name">返回</div>
      </div>
      <div class="center">{{title}}</div>
    </header>

    <div class="add-content">
      <div class="items">
        <div class="item">
          <div class="left">
            收&nbsp;&nbsp;货&nbsp;&nbsp;人：
          </div>
          <div class="right">
            <input maxlength="20" v-model="userName"/>
          </div>
        </div>
        <div class="item">
          <div class="left">
            手&nbsp;&nbsp;机&nbsp;&nbsp;号：
          </div>
          <div class="right">
            <input maxlength="11" v-model="phone" />
          </div>
        </div>
        <div class="item">
          <div class="left">
            所在地区：
          </div>
          <div class="right" id="demo1">
            <input type="text" placeholder="请选择您的区域" id="value1"  readonly="readonly"/>
          </div>
        </div>
        <div class="item">
          <div class="left">
            详细地址：
          </div>
          <div class="right">
            <input maxlength="100" style="width: 5rem;overflow:hidden;text-overflow:ellipsis;" v-model="detail"/>
          </div>
        </div>
      </div>

      <div class="default">
        <div class="left">
          设为默认地址
        </div>
        <div class="right">
          <i class="icon" :class="{'icon-selected':isDefault,'icon-select':!isDefault}" v-on:click="changeDefault()"></i>
        </div>
      </div>
    </div>

    <footer class="add-footer" v-on:click="addAddress()">
      保存地址
    </footer>

    <tip :tip="support.tip" :tipShow="support.tipShow" v-if="support.tipShow" :type="'addr'" v-on:hideTip="hideTip()"></tip>
  </div>
</template>

<script>
  import {are} from './../../static/js/Area'
  import api from "./../api/data";
  export default {
    name:'addAddress',
    data: function(){
        return {
          id:0, //地址id
          title : "",
          userId : "",
          userName : "",
          province : "",
          city: "",
          district: "",
          detail: "",
          phone : "",
          isDefault: false,
          pcd:"",
          support :{
              tip:"",
              tipShow:false
          }
        };
    },
    created: function(){
      var id = this.$route.query.id || 0;
      this.id = id;
      if (id != 0) {
          // 修改...
        this.title = "修改地址";
        this.getAddressById(id);
      } else {
          //新增..
        this.title = "新增地址";
      }


    },
    mounted: function(){
//        this.addAddress();
      //console.log("mounted.........");
      api.isLogin();
      this.initArea();
    },
    methods: {
      initArea: function(){
        let ar= are().LArea;
        ar.init({
          'trigger': '#demo1', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
          'valueTo': '#value1', //选择完毕后id属性输出到该位置
          'keys': {
            id: 'name',
            name: 'name'
          }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
          'type': 1, //数据源类型
          'data': are().Data //数据源
        });
        ar.value=[1,13,3];//控制初始位置，注意：该方法并不会影响到input的value
      }  ,
      wrapperParams: function(){
      	console.log(this.userName)
      	console.log(this.phone)
      		var self=this
      		if(this.userName==""||!this.userName){
      			console.log(this.userName+":")
      			self.showTip("姓名不能为空！");
      			return;
      		}
      		var pattern = /^1[34578]\d{9}$/; //大陆手机号     11
      		if(this.phone==""||!this.phone){
      			self.showTip("手机号码不能为空！");
      			return;
      		}
      		if(!pattern.test(this.phone)){
      			self.showTip("手机号码格式不正确！");
      			return;
      		}
      		if($("#value1").val()==""){
      			self.showTip("请选择所在地区！");
      			return;
      		}
      		if(this.detail==""){
      			self.showTip("详细地址不能为空！");
      			return;
      		}
      		
          var params = {};
          var pcd = this.pcd;
          var id = this.$route.query.id || 0;
          var selectArea = $("#value1").val();
          var list = selectArea.split(",");
          //console.log("list",id,selectArea,this.id,list);
          if (this.id != 0) {
            params = {
              id:this.id,
              userId : this.userId,
              userName : this.userName,
              province : list[0],
              city: list[1],
              district: list[2],
              detail: this.detail,
              phone : this.phone,
              isDefault: this.isDefault
            }
          } else {
            params = {
              userId : this.userId,
              userName : this.userName,
              province : list[0],
              city: list[1],
              district: list[2],
              detail: this.detail,
              phone : this.phone,
              isDefault: this.isDefault
            }
          }
          return params;
      },
      addAddress: function(){
          var params = this.wrapperParams();
          if(!params){
          	return;
          }
          //console.log("参数:",params)
          var self = this;
          api.addAddress(params).then(function(data){
              //console.log("data:",data);
              if (data.status == 200) {
                var resultCode = data && data.data && data.data.result;
                var msg = data && data.data && data.data.msg;
                if(resultCode == 0) {
                   self.showTip("成功");
                   window.history.back();
                } else if (resultCode == -100) {
                    window.location.href = api.getCommonConfig("loginUrl");
                } else {
                    self.showTip(msg);
                }
              } else {
                  self.showTip("服务器异常");
              }
          },function(err){
              self.showTip("网络异常");
          })
       },
      back: function(){
           window.history.back();
      },
      changeDefault: function(){
          this.isDefault = !this.isDefault;
      },
      showTip: function(msg){
          this.support.tip = msg;
          this.support.tipShow = true;
      },
      hideTip: function(){
          this.support.tipShow = false;
      },
      getAddressById: function(id) {
          var self = this;
          api.getAddressById(id).then(function(data){
            if(data.status == 200) {
                var resultCode = data && data.data && data.data.result;
                var result = data && data.data && data.data.value;
                var msg = data && data.data && data.data.msg;
                if (resultCode == 0) {
                  self.userId = result.userId;
                  self.userName = result.userName;
                  self.province = result.province;
                  self.city = result.city;
                  self.district = result.district;
                  self.detail = result.detail;
                  self.phone = result.phone;
                  self.isDefault = result.isDefault
                  self.pcd = result.province + ","+result.city + "," + result.district;
                  $("#value1").val(self.pcd);
                } else {
                  self.showTip(msg);
                }
            } else {
                self.showTip("服务器异常");
            }
          },function(err){
              self.showTip("网络异常");
          })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url("./../assets/css/address.less");
  @import url("./../../static/css/dizhi.css");
  #value1 {
    height:.80rem;
    line-height:.80rem;
    display:inline-block;
    vertical-align:middle;
  }
</style>
