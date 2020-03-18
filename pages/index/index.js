// pages/detail/detail.js
var app = getApp()
Page({
  data: {
    hotlist:[],//最热文章列表
    hot_currtentpage:0,//最热文章当前显示了多少页
    newlist:[],
    new_currtentpage:0,
    recommander:[],
    recommand_currtentpage:0,
    currentTab: 0,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    if (e.detail.source == 'touch') {
      this.setData({
         currentTab: e.detail.current //获取当前轮播图片的下标
      })
    };
    
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  navigateToAddArticle:function(){
    if (app.globalData.islogin){
    wx.navigateTo({
      url: '../editor/editor',
    })
    }else{
      //提示请先登录  
      wx.switchTab({
        url: '../mine/mine',
      })
    }
  },
  navigateToNotices: function () {
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
