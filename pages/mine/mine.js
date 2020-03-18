var app = getApp();
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: '',
    gridList: [{
        enName: 'favorite',
        zhName: '我的收藏'
      },
      {
        enName: 'history',
        zhName: '浏览记录'
      },
      {
        enName: 'shake',
        zhName: '我的关注'
      }
    ],
    skin: ''
    
  },
  onLoad: function() {
    this.setData({
      islogin: app.globalData.islogin,
      userInfo:app.globalData.userInfo
    })
  },
  onShow: function() {
    this.islogin=app.globalData.islogin;
    var that = this;
    wx.getStorage({
      key: 'skin',
      success: function(res) {
        if (res.data == "") {
          that.setData({
            skin: config.skinList[0].imgUrl
          })
        } else {
          that.setData({
            skin: res.data
          })
        }
      }
    })
  },
  login: function(){
    let userinfo=this.data.userInfo;
    var that = this;
    wx.login({
      success: res => {
        // 获取到用户的 code 之后：res.code
        //利用这个code向后端发送请求，解析出openid，然后判断数据库有无这个用户，有的话返回数据库的信息，没有则创建
        //返回自定义登陆态，存入storage中，同时后端也存入redis key为登录态 value为用户id，存活时间为60分钟，之后每次请求都会带上登录态，
        //后端拦截器拦截所有需要登录的请求，看redis中是否存在该登录态，存在则获取用户id，加入request中，不存在则提示登录已过期，跳转到登录界面
        //每次登录后自动发起websocket连接，带上登录态
         wx.request({
             // 自行补上自己的 APPID 和 SECRET
             url: 'http://localhost:8080/user/wxLogin',
             data:{
               "code": res.code,
               "nickname": userinfo.nickName,
               "gender": userinfo.gender,
               "province": userinfo.province,
               "age":20,
               "city":userinfo.city,
               "avatarPath": userinfo.avatarUrl
             },
           success(res) {
             //登录成功，将全局islogin设为true
             app.globalData.islogin=true;
             //并且将自定义登录态设为存入storage
             wx.setStorage({
               key: "token",
               data: res.data.token
             })
             that.setData({
               islogin: true,
               //将data赋值给userinfo
               userInfo:res.data
             })
             //开启websocket连接     

           }
         });
      }
    })
  },
  onPullDownRefresh: function() {
    this.onLoad(function() {
      wx.stopPullDownRefresh()
    })
  },
  viewGridDetail: function(e) {
    var data = e.currentTarget.dataset
    wx.navigateTo({
      url: "../" + data.url + '/' + data.url
    })
  },
  viewSkin: function() {
    wx.navigateTo({
      url: "../skin/skin"
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      this.data.userInfo = e.detail.userInfo;
      console.log("用户的信息如下：");
      console.log(this.data.userInfo);
      this.login();
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  }
})