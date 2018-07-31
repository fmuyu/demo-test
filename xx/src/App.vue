<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width:100%;
  height:100%;
}
::-webkit-scrollbar{
  width:0;
}
select {
  /*Chrome和Firefox里面的边框是不一样的，所以复写了一下*/
  border: solid 1px #ddd;
  height: .50rem;
  text-align: center;
  line-height: .50rem;
  /*很关键：将默认的select选择框样式清除*/
  appearance:none;
  -moz-appearance:none;
  -webkit-appearance:none;
  /*在选择框的最右侧中间显示小箭头图片*/
  background: url("http://ourjs.github.io/static/2015/arrow.png") no-repeat scroll right center transparent;
  /*为下拉小箭头留出一点位置，避免被文字覆盖*/
  padding-right: .28rem;

}
select option{
  text-align:center;
}


/*清除ie的默认选择框样式清除，隐藏下拉箭头*/
select::-ms-expand { display: none; }
body{
  -webkit-overflow-scrolling: touch;
  font-family: "Helvetica Neue-Light","Helvetica Neue Light","Helvetica Neue",Helvetica,Roboto,Arial,"Lucida Grande",sans-serif;
  line-height:20px;
}
button,input {
  border: 0 none;
  outline: none;
}
input {
  -webkit-appearance: none;
}
input[type="search"] {
  box-sizing: border-box;
  -webkit-appearance: textfield;
}
input[type="search"]::-webkit-search-cancel-button{
  display: none;
}
a, div, header, span {
  -webkit-tap-highlight-color: rgba(255,255,255,0);
}
button, input, select, textarea {
  margin: 0;
  font-size: 100%;
  font-family: inherit;
  outline-offset: 0;
  outline-style: none;
  outline-width: 0;
  -webkit-font-smoothing: inherit;
  background-image: none;
}
input[type=month], input[type=time], input[type=week], input[type=number], input[type=email], input[type=url], input[type=search], input[type=tel], input[type=color], input[type=text], input[type=password], input[type=datetime], input[type=datetime-local], input[type=date], textarea {
  display: block;
  padding-top: 2px;
  padding-left: 0;
  height: 34px;
  color: #111;
  vertical-align: middle;
  font-size: 14px;
  line-height: 16px;
  border: 0;
}

.flex-vertical {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
}
</style>