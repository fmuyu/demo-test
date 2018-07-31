<template>
  <div class="mask" v-show="isShow">
    <div class="popup" v-if="pop=='password'">
      <div class="title">
        <div class="main-title">
          为保障您的账户安全
        </div>
        <div class="sub-title">
          请前往PC设置二级密码
        </div>
      </div>
      <!--<div class="btn btn-password">设置二级密码</div>-->
      <div class="btn btn-cancel" v-on:click="cancelPopup()">取消</div>
    </div>

    <div class="popup" v-if="pop=='lyq'">
      <div class="title">
        您的乐盈券为{{lyqNums}}, 不足以支付购买商品
      </div>
      <a class="btn btn-password" v-bind:href="rechargeUrl">充值乐盈券</a>
      <div class="btn btn-cancel" v-on:click="cancelPopup()">取消</div>
    </div>
  <div class="popup" v-if="pop=='lyqpay'">
    <div class="title input-label">
      <input type="password" placeholder="请输入二级密码" v-model="password"/>
    </div>
    <div class="opt">
      <div class="btn btn-cancel" v-on:click="cancelPopup()">取消</div>
      <a class="btn btn-confirm"  v-on:click="requestLyqPay()">确认</a>
    </div>
  </div>


</div>
</template>
<script>
  import api from "./../api/data";
  export default {
      name: 'passwordPopup',
      props: {
        pop: String,
        isShow: Boolean,
        lyqNums:Number
      },
      data : function(){
        return {
          rechargeUrl:api.getCommonConfig("rechargeUrl"),
          password:""
        }
      },
      mounted:function(){
        //console.log(this.isShow, this.pop);
      },
      methods: {
        cancelPopup : function(){
            //console.log("$emit");
            this.$emit("hidePopup");
        },
        requestLyqPay: function(){
            //console.log("this.password",this.password);
            this.$emit("requestLyqPay",{password:this.password});
        }
      }
  }
</script>
<style lang="less">
  .mask {
    position:fixed;
    width:100%;
    height:100%;
    top:0;
    left:0;
    right:0;
    bottom:0;
    overflow:hidden;
    z-index:9999;
    background:rgba(0,0,0,.5);
  }
  .popup {
    background:#fff;
    width:100%;
    position:absolute;
    bottom:0;
    left:0;
    right:0;
    display:inline-block;
    text-align:center;
    .title {
      padding:.80rem .70rem .70rem .70rem;
      font-size:.32rem;
      color:#000;
      .main-title {
        font-size:.30rem;
        color:#222;
        padding:.20rem;
      }
      .sub-title {
        /*padding:.80rem .70rem .70rem .70rem;*/
        font-size:.28rem;
        color:#999;
      }
    }
    .input-label {
      padding:0 1.25rem;
      padding-top:.72rem;
      padding-bottom:.46rem;
      input {
        display:inline-block;
        height:.90rem;
        line-height:.90rem;
        border-radius:.04rem;
        border:1px solid #ddd;
        width:100%;
        text-align:center;
      }
    }
    .opt {
      width:100%;
      display:inline-block;
      font-size:0;
      .btn {
        display:inline-block;
        vertical-align:top;
        font-size:.34rem;
        width:2.40rem;
        height:.90rem;
        border-radius:.08rem;
        line-height:.90rem;
        text-align:center;
        margin-bottom:.20rem;
        margin-right:.20rem;
      }
      .btn-confirm {
        background:#ff8b3d;
        color:#fff;
      }
    }
    .btn {
      display:inline-block;
      width:5rem;
      height:.90rem;
      border-radius:.08rem;
      line-height:.90rem;
      text-align:center;
      margin-bottom:.20rem;
    }
    .btn-password{
      background:#ff8b3d;
      color:#fff;
    }
    .btn-cancel {
      background:#fff;
      color:#666;
      border:1px solid #666;
    }
  }
</style>
