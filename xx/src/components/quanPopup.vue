<template>
  <div class="mask">
    <div class="popup">
      <div class="title">
        您的乐盈券为{{}}, 不足以支付购买商品
      </div>
      <div class="btn btn-password">充值乐盈券</div>
      <div class="btn btn-cancel">取消</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'passwordPopup'
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
