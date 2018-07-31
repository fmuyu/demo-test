var env = 'dev'
//var env = 'test'
var config = {
  method: ''
}
var defaultConfig = {
}

var errList = {
  rightPhone:"请输入正确的手机号码",
  userNameLen:"用户名最多20位字符",
  accountLen:"充值账号最多80位字符"
}
//正则表
var regList = {
  ImgCode: /^[0-9a-zA-Z]{4}$/,
  SmsCode: /^\d{4}$/,
  MailCode: /^\d{4}$/,
  UserName: /^[\w|\d]{4,16}$/,
  Password: /^[\w!@#$%^&*.]{6,16}$/,
  Mobile: /^1[0-9]{10}$/,  //不验证第二位.
  RealName: /^[\u4e00-\u9fa5 ]{2,10}$/,
  BankNum: /^\d{10,19}$/,
  Money: /^([1-9]\d*|0)$/,
  Answer: /^\S+$/,
  Mail: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
}

export default{
  root:'http://'.concat(config.site, config.method),
  regList:regList,
  config:defaultConfig
}

