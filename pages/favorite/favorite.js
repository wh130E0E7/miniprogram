// pages/favorite/favorite.js
var token=''
var app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    noMore: false,
    loadingFailed: false,
    currentpage: 1,
    articleList: [],
    totalpages: null,
    flag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    token = wx.getStorageSync('token');
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.host +'/user/getFavoriteList',
      method:'POST',
      data: {
        page: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: function (res) {
        wx.hideLoading()
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.setData({
            articleList: res.data.rows,
            totalpages: res.data.totalPages,
            currentpage: 1,
            loading: false,
            noMore: false,
            loadingFailed: false,
            flag: true
          })
        }
        else {
          app.dealStatuscode(res.statusCode)
        }  
      }
    })
  },
  loadMore: function () {
    if (!this.data.flag) {
      return
    }
    var that = this;
    that.setData({
      flag: false
    })
    if (this.data.currentpage == this.data.totalpages) {
      this.setData({
        noMore: true
      })
      return;
    }
    this.setData({
      loading: true
    })
    wx.request({
      url: app.globalData.host +'/user/getFavoriteList',
      method:'POST',
      data: {
        page: that.data.currentpage + 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.setData({
            flag: true,
            loading: false,
            articleList: that.data.articleList.concat(res.data.rows),
            totalpages: res.data.totalPages,
            currentpage: that.data.currentpage + 1
          })
        }
        else {
          that.setData({
            loadingFailed: true,
          })
          setTimeout(function () {
            that.setData({
              loadingFailed: false,
            })
          }, 2000)
          //显示加载失败,俩秒后改回
          app.dealStatuscode(res.statusCode)
        }  
        
      }
    })
  },
})