<template>
  <div class="mask"  v-show="loadingShow" :class="{fadeIn: loadingShow,fadeOut:!loadingShow}">
    <div class="loading " v-show="loadingShow" :class="{fadeIn: loadingShow,fadeOut:!loadingShow}">

      <!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL
      <svg width="45" height="45" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
        <g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="2">
          <circle cx="22" cy="22" r="6" stroke-opacity="0">
            <animate attributeName="r"
                     begin="1.5s" dur="3s"
                     values="6;22"
                     calcMode="linear"
                     repeatCount="indefinite" />
            <animate attributeName="stroke-opacity"
                     begin="1.5s" dur="3s"
                     values="1;0" calcMode="linear"
                     repeatCount="indefinite" />
            <animate attributeName="stroke-width"
                     begin="1.5s" dur="3s"
                     values="2;0" calcMode="linear"
                     repeatCount="indefinite" />
          </circle>
          <circle cx="22" cy="22" r="6" stroke-opacity="0">
            <animate attributeName="r"
                     begin="3s" dur="3s"
                     values="6;22"
                     calcMode="linear"
                     repeatCount="indefinite" />
            <animate attributeName="stroke-opacity"
                     begin="3s" dur="3s"
                     values="1;0" calcMode="linear"
                     repeatCount="indefinite" />
            <animate attributeName="stroke-width"
                     begin="3s" dur="3s"
                     values="2;0" calcMode="linear"
                     repeatCount="indefinite" />
          </circle>
          <circle cx="22" cy="22" r="8">
            <animate attributeName="r"
                     begin="0s" dur="1.5s"
                     values="6;1;2;3;4;5;6"
                     calcMode="linear"
                     repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
-->
      <!-- simple weixin -->
      <svg width="120px" height="120px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-default"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#00b2ff" transform="rotate(0 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0s" repeatCount="indefinite"></animate></rect><rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#00b2ff" transform="rotate(30 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.08333333333333333s" repeatCount="indefinite"></animate></rect><rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#00b2ff" transform="rotate(60 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.16666666666666666s" repeatCount="indefinite"></animate></rect><rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#00b2ff" transform="rotate(90 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.25s" repeatCount="indefinite"></animate></rect><rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#00b2ff" transform="rotate(120 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.3333333333333333s" repeatCount="indefinite"></animate></rect><rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#00b2ff" transform="rotate(150 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.4166666666666667s" repeatCount="indefinite"></animate></rect><rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#00b2ff" transform="rotate(180 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.5s" repeatCount="indefinite"></animate></rect><rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#00b2ff" transform="rotate(210 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.5833333333333334s" repeatCount="indefinite"></animate></rect><rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#00b2ff" transform="rotate(240 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.6666666666666666s" repeatCount="indefinite"></animate></rect><rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#00b2ff" transform="rotate(270 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.75s" repeatCount="indefinite"></animate></rect><rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#00b2ff" transform="rotate(300 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.8333333333333334s" repeatCount="indefinite"></animate></rect><rect x="46.5" y="40" width="7" height="20" rx="5" ry="5" fill="#00b2ff" transform="rotate(330 50 50) translate(0 -30)">  <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.9166666666666666s" repeatCount="indefinite"></animate></rect></svg>
      <!--<i class="icon-loading"></i>-->
      <!--<span class="tip-text">数据加载中...</span>-->
    </div>
  </div>
</template>
<script>
export default {
    name: 'loading',
    props:{
        loadingShow: Boolean
    }
}
</script>
<style scoped>
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
    animation-duration:500ms;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
  }
  .fadeOut {

  }
  .mask {
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background: rgba(0,0,0,.3);
    z-index:9999;
  }
  .icon-loading {
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
    -webkit-animation: weuiLoading 1s steps(12, end) infinite;
    animation: weuiLoading 1s steps(12, end) infinite;
    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zd…ByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
    background-size: 100%;
  }
  .loading {
    position:absolute;
    background:rgba(17, 17, 17, 0.9);
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    -webkit-transform:translate(-50%,-50%);
    -moz-transform:translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    border-radius: 10px;
    padding:.20rem .20rem;
  }
  svg {
    width:.60rem;
    height:.60rem;
    display:block;
    margin:0 auto;
  }
  .tip-text {
    display:block;
    color:white;
    margin:0 auto;
  }
</style>
