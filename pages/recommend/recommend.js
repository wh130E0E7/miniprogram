// pages/recommend/recommend.js
var token=''
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendlist: [],
    recommend_flag: true,
    recommend_currentpage: 1,
    recommend_totalpages: null,
    recommend_loading: false,
    recommend_noMore: false,
    recommend_loadingFailed: false,
    islogin:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    token = wx.getStorageSync('token');
    this.setData({
      islogin: app.globalData.islogin
    })
    if (app.globalData.islogin) {
      //加载为该用户推荐的文章列表
      wx.showLoading({
        title: '为你生成推荐中',
      })
      //首先触发生成推荐列表，
      wx.request({
        url: app.globalData.host + '/article/setSpecialRecommendList',
        header: {
          token: token
        },
        success: function (res) {
          //调用成功之后加载推荐文章
          that.loadSpecialRecommend()
        }
      })
    } else {
      wx.showToast({
        title: '未登录，获取默认推荐列表',
        icon:'none',
        duration:3000
      })
      //加载默认的文章列表
      that.loadDefaultRecommend()
    }
  },
  //推荐列表加载下一页
  recommend_loadMore: function () {
    var url = '';
    var that = this;
    //如果已登录则设置为特定的推荐列表
    if (this.data.islogin) {
      url = app.globalData.host + '/article/getSpecialRecommendList'
    }
    //未登录则设置为默认的推荐列表
    else {
      url = app.globalData.host + '/article/getDefaultRecommendList'
    }
    if (!this.data.recommend_flag) {
      return
    }
    that.setData({
      recommend_flag: false
    })
    if (this.data.recommend_currentpage == this.data.recommend_totalpages) {
      this.setData({
        recommend_noMore: true
      })
      return;
    }
    this.setData({
      recommend_loading: true
    })
    wx.request({
      url: url,
      data: {
        page: that.data.recommend_currentpage + 1
      },
      header: {
        token: token
      },
      success: function (res) {
        that.setData({
          recommend_flag: true,
          recommend_loading: false,
          recommendlist: that.data.recommendlist.concat(res.data.rows),
          recommend_totalpages: res.data.totalPages,
          recommend_currentpage: that.data.recommend_currentpage + 1
        })
      }
    })
  },
  //未登录的情况加载默认的推荐列表
  loadDefaultRecommend: function () {
    var that = this;
    wx.request({
      url: app.globalData.host + '/article/getDefaultRecommendList',
      data: {
        page: 1
      },
      success: function (res) {
        that.setData({
          recommendlist: res.data.rows,
          recommend_totalpages: res.data.totalPages
        })
      }
    })
  },
  //登录的情况加载特定的推荐列表
  loadSpecialRecommend: function () {
    var that = this;
    wx.request({
      url: app.globalData.host + '/article/getSpecialRecommendList',
      data: {
        page: 1
      },
      header: {
        token: token
      },
      success: function (res) {
        wx.hideLoading();
        that.setData({
          recommendlist: res.data.rows,
          recommend_totalpages: res.data.totalPages
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
    var that = this;
    //如果app.globalData.islogin显示已经登录，而页面内的islogin还是未登录
    //重置推荐列表和页码数
    //就是一开始未登录的情况看了一下默认的推荐文章然后中途又登录了，则要重置为他的专属推荐
    if (app.globalData.islogin == true && this.data.islogin == false) {
      token = wx.getStorageSync('token');
      wx.request({
        url: app.globalData.host + '/article/setSpecialRecommendList',
        header: {
          token: token
        },
        success: function (res) {
          console.log(res);
          //调用成功之后加载推荐文章
          that.loadSpecialRecommend()
        }
      })
      //将页面置为1
      this.setData({
        recommend_currentpage: 1,
      })
    }
    //还有一种情况如果登录已过期(不考虑了，直接将过期时间设为一个月)
    this.setData({
      islogin: app.globalData.islogin
    })
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