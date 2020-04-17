// pages/fellow/fellow.js
var token = ''
var app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.loadFollow();
  },
  onLoad:function(options){
    token = wx.getStorageSync('token');
  },
  loadFollow:function(){
    var that=this;
    wx.request({
      url: app.globalData.host + '/user/getFollowList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.setData({
            userList: res.data
          })
        }
        else {
          app.dealStatuscode(res.statusCode)
        }
      }
    })
  },
  //取消关注
  unfollow:function(e){
    var userId=e.target.dataset.userid;
    var that = this;
      //关注，取消关注（需要判断是否登录失效）
      wx.request({
        url: app.globalData.host + '/article/follow',
        method: 'POST',
        data: {
          authorId: userId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          token: token
        },
        success: function (res) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            //操作成功
            if (res.data) {
              that.loadFollow();
            }else{
              wx.showToast({
                title: '操作失败',
                icon:'none'
              })
            }
          }
          else {
            app.dealStatuscode(res.statusCode)
          }
        }
      })
    }
})