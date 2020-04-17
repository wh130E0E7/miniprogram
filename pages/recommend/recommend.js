// pages/recommend/recommend.js
var token=''
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refresh: false,
    recommendlist: [],
    recommend_flag: true,
    recommend_currentpage: 1,
    recommend_totalpages: null,
    recommend_loading: false,
    recommend_loadingFailed: false,
    islogin:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow:function(){
    //一开始未登录后来登录了，要自动刷新页面
    if (app.globalData.islogin&&!this.data.islogin){
      this.setData({
        recommend_loading: false,
        recommend_loadingFailed: false,
        recommend_currentpage: 1,
        recommend_flag: true,
      })
      this.loadSetAndGetRecommend();
    }
    this.setData({
      islogin: app.globalData.islogin
    })
  },
  onLoad: function (options) {
    var that=this;
    token = wx.getStorageSync('token');
    this.setData({
      islogin: app.globalData.islogin
    })
    if (app.globalData.islogin) {
      //加载为该用户推荐的文章列表
     that.loadSetAndGetRecommend();
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
        recommend_flag: true
      })
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
      return;
    }
    this.setData({
      recommend_loading: true
    })
    wx.request({
      url: url,
      method:'POST',
      data: {
        page: that.data.recommend_currentpage + 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.setData({
            recommend_flag: true,
            recommend_loading: false,
            recommendlist: that.data.recommendlist.concat(res.data.rows),
            recommend_totalpages: res.data.totalPages,
            recommend_currentpage: that.data.recommend_currentpage + 1
          })
        }
        else {
          that.setData({
            recommend_loadingFailed: true,
          })
          setTimeout(function(){
            that.setData({
              recommend_loadingFailed: false,
            })
          },2000)
          //显示加载失败,俩秒后改回
          app.dealStatuscode(res.statusCode)
        }  
      }
    })
  },
  //未登录的情况加载默认的推荐列表
  loadDefaultRecommend: function () {
    var that = this;
    wx.request({
      url: app.globalData.host + '/article/getDefaultRecommendList',
      method: 'POST',
      data: {
        page: 1
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.setData({
            recommendlist: res.data.rows,
            recommend_totalpages: res.data.totalPages,
            recommend_currentpage: 1,
            flag: true
          })
        }
        else {
          app.dealStatuscode(res.statusCode)
        }  
      }
    })
  },
  //先生成一个推荐列表，然后获得第一页
  loadSetAndGetRecommend:function(){
    var that=this;
    wx.showLoading({
      title: '为你生成推荐中',
    })
    //首先触发生成推荐列表，
    wx.request({
      url: app.globalData.host + '/article/setSpecialRecommendList',
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.loadSpecialRecommend()
        }
        else {
          app.dealStatuscode(res.statusCode)
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '响应超时',
          icon: 'none'
        })
        wx.hideLoading()
      }
    })
  },
  //登录的情况加载特定的推荐列表
  loadSpecialRecommend: function () {
    var that = this;
    wx.request({
      url: app.globalData.host + '/article/getSpecialRecommendList',
      method:'POST',
      data: {
        page: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.setData({
            recommendlist: res.data.rows,
            recommend_totalpages: res.data.totalPages,
            recommend_currentpage: 1,
            flag: true
          })
        }
        else {
          //处理错误
          app.dealStatuscode(res.statusCode)
        }  
      }
    })
  },
  //下拉刷新
  refresh:function(){
    if (!this.data.flag) {
      return
    }
    var that = this;
    that.setData({
      flag: false
    })
    this.setData({
      refresh: true
    })
    //加载内容
    var that = this;
    if (app.globalData.islogin) {
      //加载为该用户推荐的文章列表
      wx.showLoading({
        title: '为你生成推荐中',
      })
      //首先触发生成推荐列表，
      wx.request({
        url: app.globalData.host + '/article/setSpecialRecommendList',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          token: token
        },
        success: function (res) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            //调用成功之后加载推荐文章
            that.setData({
              refresh:false
            })
            that.loadSpecialRecommend()
          }
          else {
            //处理错误
            app.dealStatuscode(res.statusCode)
          }  
        }
      })
    } else {
      //加载默认的文章列表
      that.loadDefaultRecommend()
    }
  }
})