// pages/replyList/replyList.js
var commentId = ''
var commentSenderId = ''
var senderNickname = ''
var myReply = ''
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    comment: {},
    replyList: [],
    placeholder: '说些什么吧',
    type: 1,
    receiverId: '',
    receiverNickname: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    commentId = options.commentId
    commentSenderId = options.senderid
    senderNickname = options.senderNickname
    this.setData({
      comment: options,
      receiverNickname: senderNickname,
      receiverId: commentSenderId,
    });
    this.getReplyList();
  },
  getReplyList: function () {
    var that = this;
    //获取回复列表，回复共有俩种形式，一种直接回复评论，一种回复别人回复
    wx.request({
      url: app.globalData.host+'/comment/getReplyList',
      method:'POST',
      data: {
        commentId: commentId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',// 默认值
      },
      success: function (res) {
        that.setData({
          replyList: res.data
        })
      }
    })
  },
  reply: function (e) {
    console.log(e);
    //回复回复的情况
    if (!app.globalData.islogin) {
      //请先登录
      console.log("请先登录")
      return;
    }
    this.setData({
      placeholder: '回复' + e.currentTarget.dataset.sendernickname,
      type: 2,
      receiverNickname: e.currentTarget.dataset.sendernickname,
      receiverId: e.currentTarget.dataset.senderid,
    })
  },
  cancel: function () {
    this.setData({
      placeholder: '说些什么吧',
      type: 1,
      receiverNickname: senderNickname,
      receiverId: commentSenderId,
    })
  },
  onTextChanged: function (e) {
    myReply = e.detail.value
  },
  //发表回复
  sendReply: function () {
    var that = this;
    wx.request({
      url: app.globalData.host+'/article/insertReply',
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded',// 默认值
        token: wx.getStorageSync('token'),
      },
      data: {
        //回复内容
        replyContent: myReply,
        //回复所属评论
        commentId: commentId,
        //回复的人id
        receiverId: that.data.receiverId,
        //回复的人nickname
        receiverNickname: that.data.receiverNickname,
        //回复类型
        type: that.data.type
      },
      fail: function () {
        wx.showToast({
          title: '出错了',
          icon: 'success',
          duration: 2000
        })
      },
      success: function (res) {
        //修改数组的值
        /* 第一步：先用一个变量，把(info[0].gMoney)用字符串拼接起来。
          第二步：将变量写在[]里面即可。
         */
        if (res.data == true) {
          //回复成功
          wx.showToast({
            title: '回复成功',
            icon: 'success',
            duration: 2000,
          })
          //刷新回复列表
          that.getReplyList();
          //清空回复内容
          that.cancel();
          that.setData({
            inputcontent: '',
          })
        } else if (res.data == false) {
          wx.showToast({
            title: '回复失败',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '登录过期',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  }
})