// pages/detail/detail.js
import util from "../../utils/util.js";
var app = getApp()
Page({
  data: {
    hotlist: [], //最热文章列表
    hot_currentpage: 1, //最热文章当前页
    hot_totlapages:null,
    hot_flag:true,
    newlist: [],
    new_flag: true,
    new_currentpage: 1,
    new_totlapages: null,
    recommander: [],
    recommand_currentpage: 1,
    recommand_totlapages: null,
    new_loading:false,
    new_noMore:false,
    new_loadingFailed:false,
    hot_loading: false,
    hot_noMore: false,
    hot_loadingFailed: false,
    currentTab: 0,
  },
  hot_loadMore:function(){
    var that = this;
    if (!this.data.hot_flag) {
      return
    }
    that.setData({
      hot_flag: false
    })
    
    if (this.data.hot_currentpage == this.data.hot_totlapages) {
      this.setData({
        hot_noMore: true
      })
      return;
    }else{
      this.setData({
        hot_loading: true
      })
    }
    wx.request({
      url: 'http://localhost:8080/article/getTopNList',
      data: {
        page: that.data.hot_currentpage + 1
      },
      success: function (res) {
        that.setData({
          hot_flag:true,
          hot_loading: false,
          hotlist: that.data.hotlist.concat(res.data.rows),
          hot_totlapages: res.data.totalPages,
          hot_currentpage: that.data.hot_currentpage + 1
        })
      }
    })
  },
  new_loadMore:function(){
    if (!this.data.new_flag) {
      return
    }
    var that = this;
    that.setData({
      new_flag: false
    })
    if (this.data.new_currentpage == this.data.new_totlapages) {
      this.setData({
        new_noMore: true
      })
      return;
    }
    this.setData({
      new_loading: true
    })
    wx.request({
      url: 'http://localhost:8080/article/getNewNList',
      data: {
        page: that.data.new_currentpage + 1
      },
      success: function (res) {
        that.setData({
          new_flag: true,
          new_loading: false,
          newlist: that.data.newlist.concat(res.data.rows),
          new_totlapages: res.data.totalPages,
          new_currentpage: that.data.new_currentpage + 1
        })
      }
    })
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.loadTopN();
    this.loadNewN();
  },
  //加载最热文章
  loadTopN:function(){
    var that=this;
    wx.request({
      url: 'http://localhost:8080/article/getTopNList',
      data:{
        page: that.data.hot_currentpage
      },
      success:function(res){
        that.setData({
          hotlist:res.data.rows,
          hot_totlapages: res.data.totalPages
        })
      }
    })
  },
  //加载最新文章
  loadNewN: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/article/getNewNList',
      data: {
        page: that.data.new_currentpage
      },
      success: function (res) {
        that.setData({
          newlist: res.data.rows,
          new_totlapages: res.data.totalPages
        })
        console.log(that.data.hotlist)
      }
    })
  },
  //滑动切换
  swiperTab: function(e) {
    var that = this;
    if (e.detail.source == 'touch') {
      this.setData({
        currentTab: e.detail.current 
      })
    };
  },
  //点击切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },
  navigateToAddArticle: function() {
    if (app.globalData.islogin) {
      wx.navigateTo({
        url: '../editor/editor',
      })
    } else {
      //提示请先登录  
      wx.switchTab({
        url: '../mine/mine',
      })
    }
  },
  navigateToNotices: function() {
    if (app.globalData.islogin) {
      wx.navigateTo({
        url: '../notices/notices',
      })
    } else {
      //提示请先登录  
      wx.switchTab({
        url: '../mine/mine',
      })
    }
  }

})