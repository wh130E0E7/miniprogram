//app.js
App({
  
  onLaunch: function () {
    let that = this;
    that.globalData.token =wx.getStorageSync('token')
    console.log(that.globalData.token);
    //检查该用户账号是否过期，没过期直接加载userinfo
    //过期就直接跳转个人中心提示登录
    wx.request({
      url: 'http://localhost:8080/user/checkLogin',
      data:{
        token: that.globalData.token
      },
      success:function(res){
        if(res.data.islogin){
          that.globalData.userInfo=res.data.userInfo
          that.globalData.islogin=true
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    islogin:null,
    token:null
  }
})