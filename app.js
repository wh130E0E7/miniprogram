//app.js
App({ 
  onLaunch: function () {
    console.log("app--->onLaunch")
    let that = this;
    that.globalData.token =wx.getStorageSync('token')
    wx.request({
      url: that.globalData.host+'/cos/getCosSecret',
      success:function(res){
        that.globalData.COS_SecretId=res.data.COS_SecretId
        that.globalData.COS_SecretKey = res.data.COS_SecretKey
      }
    })
    
    //检查该用户账号是否过期，没过期直接加载userinfo,如何让这个方法成为同步方法？
    wx.request({
      url: that.globalData.host +'/user/checkLogin',
      data:{
        token: that.globalData.token
      },
      success:function(res){
        if(res.data.islogin){
          console.log("app--->checklogin_finished")
          that.globalData.userInfo=res.data.userInfo
          that.globalData.islogin=true
           //连接websocket,设置newMessageNum
          that.openSocket(that);
           //判断关注的人有无新动态，有的话在动态栏上显示数字
           that.load_action_size()
        }
      }
    })
  },
  dealStatuscode:function(code){
  if(code> 500){
  wx.showToast({
    title: '服务器故障',
    icon:'none'
  })
  }else if(code>=400&&code<500) {
  wx.showToast({
    title: '客户端故障',
    icon: 'none'
  })
  }
  else if(code>=200&&code<300){

  }
  else {
    wx.showToast({
      title: '未知错误',
      icon: 'none'
    })
  }
} ,
  openSocket(app) {
    var that=app;
    //打开时的动作
    wx.onSocketOpen(() => {
      console.log('WebSocket 已连接')
      that.globalData.socketStatus = 'connected';
      //this.sendMessage();
    })
    //断开时的动作
    wx.onSocketClose(() => {
      console.log('WebSocket 已断开')
      that.globalData.socketStatus = 'closed'
    })
    //报错时的动作
    wx.onSocketError(error => {
      console.error('socket error:', error)
    })
    // 监听服务器推送的消息
    wx.onSocketMessage(message => {
      //把JSONStr转为JSON
      that.globalData.newMessageNums = message.data;
    })
    // 打开信道
    wx.connectSocket({
      url: that.globalData.websocketurl + wx.getStorageSync('token'),
    })
  },

  //关闭信道
  closeSocket() {
    if (this.globalData.socketStatus === 'connected') {
      wx.closeSocket({
        success: () => {
          this.globalData.socketStatus = 'closed'
        }
      })
    }
  },
  load_action_size:function(){
    let that = this;
    wx.request({
      url: that.globalData.host +'/user/getActionSize',
      method:'POST',
      header:{
        'content-type': 'application/x-www-form-urlencoded',
        token: that.globalData.token
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
              index: 2,
              text: '' + res.data + '',
            })
          }
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    islogin:false,
    token:null,
    newMessageNums:0,
    host:'https://www.simplecreate.club',
    websocketurl:"wss://www.simplecreate.club/websocket/",
    socketStatus: 'closed',
    COS_SecretId:'',
    COS_SecretKey:''
  }
})