<template>
  <div>
    <div class="maskTip" v-show="tipShowFlag" v-if="type!='mall'">
      <div class="tipMsg" v-show="tipShowFlag" :class="{fadeIn: tipShowFlag}">
        <span class="tip-text">{{tip}}</span>
      </div>
    </div>

    <div class="mall-tip" v-show="tipShowFlag" v-if="type=='mall'">
      <div class="content">
        <div class="msg">
          <div class="main">{{tip}}</div>
          <div class="sub">{{sub}}</div>
        </div>
        <div class="btn" v-on:click="hide">确定</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'tip',
  props:{
    tipShow: Boolean,
    tip: String,
    sub:String,
    type:''
  },
  data:function(){
    return {
      tipShowFlag:false,
      time:""
    }
  },
  mounted: function(){
    //console.log("mounted",this.tipShow)
    var self = this;
    self.tipShowFlag = this.tipShow;
    setTimeout(function(){
      self.$emit("hideTip");
    },1500)
  },
  methods:{
      hide : function(){
          //console.log("hide");
          this.$emit("hideTip");
      }
  }
//  ,
//  watch:{
//    tipShow:function(curVal,oldVal){
//      var _this=this;
//      //清楚定时器
//      window.clearTimeout(_this.time);
//      if(curVal===true) {
//        _this.tipShowFlag=curVal;
//        _this.time=setTimeout(function(){
//          _this.tipShowFlag=false;
////          _this.$emit("updateTipShow");
//        },1500)
//      }
//    }
//  }
}
</script>

<style lang="less" scoped>
.mall-tip{
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background: rgba(0,0,0,.3);
  z-index:110000;
  .content {
    position:absolute;
    width:80%;
    left:50%;
    top:50%;
    transform:translate3d(-50%,-50%);
    -webkit-transform:translate(-50%,-50%);
    border-radius:0.08rem;
    background:#fff;
  }
  .msg {
    text-align:center;
    padding:.60rem 0;
    border-bottom:1px solid #ddd;
    .main {
      text-align:center;
      font-size:.30rem;
      color:#222;
      padding-bottom:.26rem;
    }
    .sub {
      font-size:.28rem;
      text-align:center;
      color:#999;
    }
  }
  .btn {
    width:100%;
    font-size:.34rem;
    padding:.20rem 0;
    color:#ff8b3d;
    text-align:center;
  }
}
.maskTip {
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  /*background: rgba(0,0,0,.3);*/
  z-index:110000;
  .tipMsg {
    position:absolute;
    /*background:rgba(17, 17, 17, 0.9);*/
    top:50%;
    left:50%;
    transform:translate3d(-50%,-50%,0);
    -webkit-transform:translate3d(-50%,-50%,0);
    -moz-transform:translate3d(-50%,-50%,0);
    -o-transform: translate3d(-50%,-50%,0);
    /*width: 3rem;*/
    /*height: .8rem;*/
    /*line-height: .8rem;*/
    max-width:5.0rem;
    padding:0.2rem;
    background: rgba(0,0,0,.8);
    border-radius: 5px;
    color: #fff;
    text-align:center;
  }
}





@-webkit-keyframes fadeIn {
  0% {opacity: 0}
  100% {opacity: 1}
}

@keyframes fadeIn {
  0% {opacity: 0}
  100% {opacity: 1}
}

@keyframes fadeOut {
  0% {opacity: 1}
  100% {opacity: 0;display:none;}
}
@-webkit-keyframes fadeOut {
  0% {opacity: 1}
  100% {opacity: 0;display:none;}
}


.fadeOut {
  -webkit-animation-name: fadeOut;
  animation-name: fadeOut;
  animation-duration:500ms;
  animation-iteration-count: 1;
  animation-timing-function: ease-out;
}
.fadeIn {
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
  animation-duration:300ms;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
}
.fadeOut {

}
</style>
