#to-do
1. goodDetail.vue ,,,, 区别实物还是虚拟  orderInfo.deliveryInfo = "普通快递" || "虚拟发货";  //
2. 超过限购数量,库存数量,
3. 生产订单号之后,就不能再生产了...
4/1： 实物还是虚拟是通过 order_type来区分吗？ 不过order_type是只有创建完订单才有的吗?
5.订单付款状态接口..
6.不能对同一个商品进行多个订单付款操作, orderConfirm..

7.虚拟的 充值类型: orderConfirm.vue ， 下拉框.
                   支付成功: title 充值账号要改成对应的充值类型(QQ号码，手机号码,其他账号).




*******************************注意事项****************************************
 1.orderInfo 是比较重要的信息, 是几个页面需要使用的.
 2.payStatus 支付状态是重要的信息.
*******************************************************************************

**************
1. 商品详情页面:  实物,虚拟.
2. 全系统需要获取到的数据,共享的数据， 只需要一次执行.
3. 中间的页面 的回退功能设计....  中心的页面的回退功能设计.  订单结算页面....多个入口点....


**样式
1. 文字两行, 一行 自动适应.
**************



*******************************************************************************
to-do list
_______________________________________________________________________________
1. 地址选择之后，回到订单确认页面，需要用地址.



# shop_v0.0.1

> shop

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# 做这个项目的时候，当时也是对vue一脸懵逼，后来找到参考借鉴，特此吧地址粘粘出来，个人真心不喜欢代码发到网上

 #git clone https://github.com/bailicangdu/vue2-elm.git
 # 好好看看基本上会知道90%
