// pages/actions/actions.js
/*
在Page外部声明var变量时，当用户退出该页面时，只要该页面还驻留在内存中未被销毁，则当再次加载此页面时，变量的值不会改变。
*/
var app=getApp()
var token=''
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
    totlapages: null,
    flag: true,
    islogin:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    token=wx.getStorageSync('token'),
    this.setData({
      islogin: app.globalData.islogin
    })
    if (app.globalData.islogin){
      this.loadContent();
    }
  },
  onshow:function(){
    this.setData({
      islogin: app.globalData.islogin
    })
    //登录了还是没有文章
    if (articleList.length = 0 && app.globalData.islogin){
      this.loadContent();
    }
  },
  loadContent:function(){
    wx.showLoading({
      title: '加载中',
    })
    //隐藏数字红点
    wx.hideTabBarRedDot({
      index: 1
    })
    //加载内容
    var that = this;
    wx.request({
      url: app.globalData.host+'/user/getActionList',
      data: {
        page: that.data.currentpage
      },
      header: {
        token: token
      },
      success: function (res) {
        wx.hideLoading()
        that.setData({
          articleList: res.data.rows,
          totlapages: res.data.totalPages
        })
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
    if (this.data.currentpage == this.data.totlapages) {
      this.setData({
        noMore: true
      })
      return;
    }
    this.setData({
      loading: true
    })
    wx.request({
      url: app.globalData.host +'/user/getActionList',
      data: {
        page: that.data.currentpage + 1
      },
      header: {
        token: token
      },
      success: function (res) {
        that.setData({
          flag: true,
          loading: false,
          articleList: that.data.articleList.concat(res.data.rows),
          totlapages: res.data.totalPages,
          currentpage: that.data.currentpage + 1
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})