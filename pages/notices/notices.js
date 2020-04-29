// pages/detail/detail.js
var app = getApp()
var token = ''
Page({
  data: {
    currentTab: 0,
    likeMessageList: [],
    like_totalnums: null,
    commentMessageList: [],
    comment_totalnums: null,
    followMessageList: [],
    follow_totalnums: null,
  },
  onShow: function() {
    // 页面初始化 options为页面跳转所带来的参数
      this.loadLikeMessage();
      this.loadFollowMessage();
      this.loadCommentMessage();
      //将新消息数量清零
      this.clearNewMessageNums();
      app.globalData.newMessageNums=0;
  },
  onLoad: function(options) {
    token = wx.getStorageSync('token');
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
        currentTab: e.target.dataset.current
      })
    }
  },
  //将该用户的未查看新消息数量减少指定数目
  clearNewMessageNums:function(){
    wx.request({
      url: app.globalData.host +'/message/clearNewMessageNums',
      method:'POST',
      header:{
        token:token,
        'content-type': 'application/x-www-form-urlencoded',
      }
    })
  },
  //加载点赞消息
  loadLikeMessage: function() {
    var that = this;
    wx.request({
      url: app.globalData.host + '/message/getLikeMessage',
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.setData({
            likeMessageList: res.data.rows,
            like_totalnums: res.data.totalNums
          })
        } else {
          app.dealStatuscode(res.statusCode)
        }
      }
    })
  },
  //读点赞消息
  readLikeMessage:function(e){
    var that=this;
    wx.request({
      url: app.globalData.host +'/message/readLikeMessageByIndex',
      method:'POST',
      header:{
        'content-type': 'application/x-www-form-urlencoded',
        token:token
      },
      data:{
        index: e.currentTarget.dataset.index,
        totalNums:that.data.like_totalnums
      }
    })
  },
  //全部已读点赞消息
  likeMessageAllRead: function() {
    var that = this;
    wx.request({
      url: app.globalData.host + '/message/likeMessageAllRead',
      method: 'POST',
      data: {
        num: that.data.like_totalnums
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.loadLikeMessage();
        } else {
          app.dealStatuscode(res.statusCode)
        }
      }
    })
  },
  //加载评论信息
  loadCommentMessage: function() {
    var that = this;
    wx.request({
      url: app.globalData.host + '/message/getCommentMessage',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.setData({
            commentMessageList: res.data.rows,
            comment_totalnums: res.data.totalNums
          })
        } else {
          app.dealStatuscode(res.statusCode)
        }
      }
    })
  },
  //单条读评论消息
  readCommentMessage:function(e){
    var that = this;
    console.log(e);
    wx.request({
      url: app.globalData.host + '/message/readCommentMessageByIndex',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      data: {
        index: e.currentTarget.dataset.index,
        totalNums: that.data.comment_totalnums
      }
    })
  },
  //评论消息全部已读
  commentMessageAllRead: function() {
    var that = this;
    wx.request({
      url: app.globalData.host + '/message/commentMessageAllRead',
      method:'POST',
      data: {
        num: that.data.comment_totalnums
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.loadCommentMessage();
        } else {
          app.dealStatuscode(res.statusCode)
        }
      }
    })
  },
  //加载关注信息
  loadFollowMessage: function() {
    var that = this;
    wx.request({
      url: app.globalData.host + '/message/getFollowMessage',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.setData({
            followMessageList: res.data.rows,
            follow_totalnums: res.data.totalNums
          })
        } else {
          app.dealStatuscode(res.statusCode)
        }
      }
    })
  },
  //关注消息全部已读
  followMessageAllRead: function() {
    var that = this;
    wx.request({
      url: app.globalData.host + '/message/followMessageAllRead',
      method:'POST',
      data: {
        num: that.data.follow_totalnums
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.loadFollowMessage();
        } else {
          app.dealStatuscode(res.statusCode)
        }
      }
    })
  }
})