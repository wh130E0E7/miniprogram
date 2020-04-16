// pages/detail/detail.js
var app = getApp()
var token=''
Page({
  data: {
    currentTab: 0,
    likeMessageList: [],
    like_currentpage:1,
    like_totalnums:null,
    commentMessageList:[],
    comment_currentpage:1,
    comment_totalnums: null,
    followMessageList: [] ,
    follow_currentpage:1,
    follow_totalnums: null,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    token = wx.getStorageSync('token');
    this.loadLikeMessage();
    this.loadFollowMessage();
    this.loadCommentMessage();
  },

  //滑动切换
  swiperTab: function (e) {
    var that = this;
    if (e.detail.source == 'touch') {
      this.setData({
        currentTab: e.detail.current
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
  //加载点赞消息
  loadLikeMessage: function () {
    var that = this;
    wx.request({
      url: app.globalData.host + '/message/getLikeMessage',
      header:{
        token:token
      },
      success: function (res) {
        that.setData({
          likeMessageList: res.data.rows,
          like_totalnums: res.data.totalNums
        })
      }
    })
  },
  //加载评论信息
  loadCommentMessage: function () {
    var that = this;
    wx.request({
      url: app.globalData.host + '/message/getCommentMessage',
      header: {
        token: token
      },
      success: function (res) {
        that.setData({
          commentMessageList: res.data.rows,
          like_totalnums: res.data.totalNums
        })
      }
    })
  },
  //加载关注信息
  loadFollowMessage: function () {
    var that = this;
    wx.request({
      url: app.globalData.host + '/message/getFollowMessage',
      header: {
        token: token
      },
      success: function (res) {
        that.setData({
          followMessageList: res.data.rows,
          follow_totalnums: res.data.totalNums
        })
      }
    })
  },
})
