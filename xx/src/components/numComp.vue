<template>
  <div class="num-comp">
    <div class="hhly-number">
      <button type="button" class="decrease disabled" v-on:click="decrease()">-</button>
      <input type="number" class="num" v-model="dnum"  min="1" max="24" step="" name="quantity" readonly="readonly"/>
      <button type="button" class="increase" v-on:click="increase()">+</button>
    </div>
  </div>
</template>

<script>
  export default {
      name:'numComp',
      props:[
          'buyNums'
      ],
      data: function(){
          return {
              dnum:1
          }
      },
      watch:{
        'buyNums':function(curValue,newValue){
              //console.log("watch:",curValue,newValue);
              this.dnum = curValue;
         }
      },
      mounted: function(){
        var buyNums = this.buyNums || 0 ;
        //console.log(buyNums,parseInt(buyNums));
        if (parseInt(buyNums) > 0)  {
            this.dnum = parseInt(buyNums);
        } else {
            this.dnum = 1;
        }
      },
      updated: function(){
        //console.log("updated",this.dnum);
        if (this.dnum < 1) {
            this.dnum = 1;
        }
        this.$emit("subChangeNum",{"num":this.dnum});
      },
      methods: {
          increase : function(){
              this.dnum = this.dnum + 1;
              this.setStorage("nums",this.dnum);
          },
          decrease: function(){
              if (this.dnum > 1)
                this.dnum = this.dnum - 1;
              this.setStorage("nums",this.dnum);
          },
          setStorage: function(item,num){
              window.localStorage.setItem(item,num);
              this.$emit("subChangeNum",{"num":this.dnum});
          }
      }
  }
</script>

<style lang="less" scoped>
  .num-comp {
    position:relative;
    text-align:right;
    .hhly-number{
      display:inline-block;
      vertical-align:middle;
      border:1px solid #d3d3d3;
      border-radius:3px;
      height:.50rem;
      line-height:.50rem;
      text-align:center;
      overflow:hidden;
      letter-spacing: 0;
      .decrease {
        float:left;
        display:inline-block;
        width:.54rem;
        height:100%;
        font-size:.20rem;
        font-weight:bold;
        color:#aaa;
      }
      .num {
        width:.80rem;
        float:left;
        text-align:center;
        height:.50rem;
        color:#222;
        font-weight:bold;
      }
      .increase {
        float:left;
        width:.54rem;
        height:100%;
        font-weight:bold;
        color:#aaa;
        font-size:.20rem;
      }

      &::after {
        clear:both;
       }
    }
  }
</style>
