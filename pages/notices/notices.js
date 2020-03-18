// pages/detail/detail.js
var app = getApp()
Page({
  data: {
    currentTab: 0,
    height:600,
    likenotices:[],
    like_currentpage:0,
    commentnotices:[],
    comment_currentpage:0,
    replynotices:[] ,
    reply_currentpage:0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

  },
  //滑动切换
  swiperTab: function (e) {
    console.log(e);
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
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
  }
})
