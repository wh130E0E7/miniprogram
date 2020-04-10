//app.js
App({
  
  onLaunch: function () {
    let that = this;
    that.globalData.token =wx.getStorageSync('token')
    console.log(that.globalData.token);
    //检查该用户账号是否过期，没过期直接加载userinfo
    wx.request({
      url: 'http://localhost:8080/user/checkLogin',
      data:{
        token: that.globalData.token
      },
      success:function(res){
        if(res.data.islogin){
          that.globalData.userInfo=res.data.userInfo
          that.globalData.islogin=true
           //连接websocket
           
           //判断关注的人有无新动态，有的话在动态栏上显示数字
           that.load_action_size()
        }
      }
    })
  },
  load_action_size:function(){
    wx.request({
      url: 'http://localhost:8080/user/getActionSize',
      header:{
        token: wx.getStorageSync('token')
      },
      success:function(res){
        if(res.data>0){
          if (res.data > 100){
            wx.setTabBarBadge({
              index: 1,
              text: '99+',
            })
          }else{
            wx.setTabBarBadge({
              index: 1,
              text: '' + res.data + '',
            })
          }
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