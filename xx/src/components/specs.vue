<template>
  <div class="spec-wrapper spec-fixed ">
    <div class="mask-wrapper">

    </div>
    <div class="comp-specs ">
      <div class="good-desp">
        <div class="good-desp-logo">
          <img v-bind:src="pic"/>
        </div>
        <div class="good-stock">
          <span class="price">￥{{price}}</span>
          <span class="stock">库存{{stock}}件</span>
        </div>

        <div class="exit" v-on:click="exit()"></div>
      </div>
      <div class="body-wrapper">
        <div class="spec-details">
          <div class="spec-detail" v-for="(attr,attrIndex) in attrs">
            <div class="attr-name">{{attr.attr.name}}</div>
            <ul class="details">
              <li :class="{'active':selected[attrIndex] == attrDetail.id}" v-on:click="select(attrIndex,attrDetail.id)" v-for="attrDetail in attr.details">{{attrDetail.name}}</li>
            </ul>
          </div>
        </div>

        <div class="buy-num">
          <span class="name">购买数量</span>
          <div class="num-comp-wrapper">
              <num-comp v-on:subChangeNum="subChangeNum"></num-comp>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import numComp from './numComp';
  export default {
      name: 'specsComp',
      components:{
        'numComp':numComp
      },
      props:{
        attrs:Array,
        specs:Array,
        pic:String
      },
      data : function(){
        return {
          selectIds:[], // 所有已经选择的id.
          selected:[],
          price:0.00,
          stock:0,
          selectSpec:{}, //已经选择的spec的数组中某一项.
        }
      },
      mounted:function(){
          //console.log(this.specs);
          if(this.specs && this.specs.length > 0){
              for (var i = 0; i < this.specs[0].details.length; i++) {
                  this.selected.push(this.specs[0].details[i].attrDetailId);
                  this.selectSpec = this.specs[0];
                  this.price = this.specs[i].spec.price;
              }

          }
          var selectedStr = this.array2Str(this.selected,null);
          this.$emit("subUpdateSpec",{"info":this.selectSpec,"infoStr":selectedStr,"price":this.price});
          this.targetSpecs();
          //console.log("this.selected",this.selected);
      },
      methods:{
          exit: function(){
            this.$emit('exitSpec');
          },
          select: function(index,detailid){
           this.selected.splice(index, 1, detailid);
              //console.log(this.selected);
           this.targetSpecs();
          },
          //根据用户的选择，定位到规格列表的某个..
          targetSpecs:function(){
            var selectedStr = this.array2Str(this.selected,null);
            //console.log("selectedStr:",selectedStr);
            window.localStorage.setItem("attrIds",selectedStr);
            for(var i = 0; i <this.specs.length; i++) {
                var specsStr = this.array2Str(this.specs[i].details,"attrDetailId");
                if (selectedStr == specsStr) {
                    //console.log(this.specs[i].spec);
                    this.price = this.specs[i].spec.price;
                    this.stock = this.specs[i].spec.stock;
                    this.selectSpec = this.specs[i];
                    window.localStorage.setItem("selectSpec",this.selectSpec);
                    //console.log(JSON.stringify(this.selectSpec));
                    this.$emit("subUpdateSpec",{"info":this.selectSpec,"infoStr":selectedStr,"price":this.price});
                }
            }
          },

          //将数组的某个字段拼字符串
          array2Str: function(list,colName) {
            var result = "";
            for(var i = 0; i <list.length;i++) {
                result += colName == null ? list[i]+"," : list[i][colName] + ",";
            }
            return result;
          },


          //子组件更新..
          subChangeNum: function(info){
              this.$emit("subChangeNums",{info:info})
          }
      }
  }
</script>

<style lang="less" scoped>
  .mask-wrapper {
    width: 100%;
    opacity: .7;
    height: 100%;
    position: fixed;
    background-color: #000;
    top: 0;
    left: 0;
    z-index: 8000;
  }
  .spec-fixed {
    position:fixed;
    bottom:1rem;
    left:0;
    right:0;
    z-index:9999;
  }
  .spec-wrapper {
    /*height:8.27rem;*/
    width:100%;
    background:#fff;
  }
  .comp-specs {
    position:absolute;
    bottom:0;
    z-index:999999;
/*    height:8.07rem;*/
    width:100%;
    background:#fff;
    .good-desp{
      position:relative;
      padding-top:.20rem;
      height: 1.50rem;
      margin-left:.30rem;
      border-bottom: 1px solid #ddd;
      .good-desp-logo {
        width:1.50rem;
        height:1.50rem;
        border:1px solid #ddd;
        border-radius:5px;
        background:#fff;
        position:absolute;
        left:0;
        top:-0.20rem;
        right:.30rem;
        img {
          width:100%;
          height:100%;
          border-radius:5px;
        }
      }
      .good-stock {
        position:relative;
        display:block;
        right:.70rem;
        left:1.80rem;
        text-align:left;

        .price {
          display:inline-block;
          width:100%;
          color:#ff8b3d;
          font-size:.34rem;
        }
        .stock {
          display:inline-block;
          margin-top:.10rem;
          width:100%;
          color:#222;
          font-size:.24rem;
        }
      }
      .exit {
        width:.40rem;
        height:.40rem;
        background:url('./../assets/img/exit.png');
        background-size:.40rem .40rem;
        background-repeat:no-repeat;
        position:absolute;
        top:.20rem;
        right:.30rem;
      }
    }

    .body-wrapper{
      overflow-y:auto;
      height:7.2rem;
    }
    .spec-details{
      margin-left:.30rem;
      .spec-detail{
        padding:.40rem 0;
        border-bottom:1px solid #ddd;
        .attr-name {
          width:100%;
          text-align:left;
          font-size:.30rem;
          margin-bottom:.04rem;
        }
        .details {
          display:inline-block;
          font-size:0;
          width:100%;
          text-align:left;
          li {
            display: inline-block;
				    padding: 0 .2rem;
				    font-size: .24rem;
				    text-align: center;
				    border: 1px solid #999;
				    border-radius: .20rem;
				    margin-right: .20rem;
				    margin-top: .20rem;
          }
          li.active {
            background:#ff8b3d;
            color:#fff;
            border:1px solid #ff8b3d;
          }
        }
      }
    }

    .buy-num {
      width:100%;
      height:1.14rem;
      line-height:1.14rem;
      display:inline-block;
      font-size:0;
      text-align:left;
      padding:0 .30rem;
      border-bottom:1px solid #ddd;
      .name {
        display:inline-block;
        font-size:.30rem;
        color:#222;
        float:left;
        width:20%;
      }
      .num-comp-wrapper {
        display:inline-block;
        font-size:.30rem;
        width:80%;
        height:1.14rem;
        line-height:1.10rem;
        text-align: right;
      }
      &::after {
        clear:both;
       }
    }
  }
</style>
