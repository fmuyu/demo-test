<template>
  <div v-if="isShow" v-on:click="gotoTop()">
    <!--<img v-bind:src="pic"/>-->
  </div>
</template>
<script>
import Scroll from './scroll'
//import backTopPic from "../assets/img/backTop.png";
export default {
	name: 'back-scroll',
	mixins: [Scroll],
	props: {
		flag: {
			type: Boolean,
			default: false
		}
	},
  data: function(){
	  return {
	      isShow : false
//        pic:backTopPic
    }
  },
  created: function(){
//    //console.log(this.pic);
  },
	methods: {
		onScroll() {
			const scroller = this.scroller
			const isWindow = scroller === window
			const height = Math.ceil(window.screen.height / 2);
			const scrollTop = isWindow ? scroller.scrollY : scroller.scrollTop;
			// 监听页面已滑动的位置，当页面滑动半屏之后，显示“返回顶部”按钮
			if (scrollTop > height) {
				!this.flag && this.$emit('toggle', 1);
				this.isShow = true;
			}else{
				this.flag && this.$emit('toggle');
        this.isShow = false;
			}
		},
    gotoTop(){
		    if (this.scroller)
		      $(this.scroller).scrollTop(0);
    }
	}
}
</script>

<style lang="less" scoped>
  /*@import url('./../assets/css/component.less');*/
</style>
