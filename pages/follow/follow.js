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
    var that = this;
    token = wx.getStorageSync('token');
    wx.request({
      url: app.globalData.host + '/user/getFollowList',
      method:'POST',
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
})