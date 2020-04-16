var WxParse = require('../../wxParse/wxParse.js');
var Util = require('../../utils/util.js');
var app = getApp();
var articleId = ''
var title = ''
var authorId=''
var myComment = ''
var token = ''
Page({
  data:{
    article:{},
    commentList: [],
    isfollow: false,
    islike:false,
    isfavorite:false,
    inputcontent:'',
    iscomment:true,
    placeholder:'',
    focus:true,
    commentId:'',
    index:null,
    receiverId:'',
    receiverNickname:''
  },
  onTextChanged: function(e){
    myComment = e.detail.value
  },
  onLoad:function(options){
    token=wx.getStorageSync('token');
    articleId = options.articleId 
    wx.showLoading({
      title: '加载中',
    })
    this.loadArticle();
    
    wx.request({
      url: app.globalData.host +'/article/selectArticleByIdForLoginUser',
      data:{
        articleId:articleId
      },
      header:{
        token: token,
      }
    })
    //加载评论'
    this.loadComments();
  },
  //加载文章
  loadArticle:function(){
    var that = this
    wx.request({
      url: app.globalData.host +'/article/selectArticleById',
      method: 'GET',
      data: {
        //文章id由列表栏传递过来
        articleId: articleId
      },
      success: function (res) {
        var _content = res.data.article.content;
        title = res.data.article.title;
        authorId = res.data.article.author.openid;
        wx.hideLoading()
        //文章加载成功，则加载是否关注，评论，收藏等
        that.load();
        that.setData({
          article: res.data.article
        });
        WxParse.wxParse('content', 'html', _content, that, 0);
      }
    })
  },
  //加载关注，点赞，收藏
  load:function(){
    //登录则判断
    if (app.globalData.islogin) {
      var that = this;
      //判断是否关注了该作者
      wx.request({
        url: app.globalData.host +'/article/isFollow',
        method: 'GET',
        data: {
          //作者id
          authorId: authorId
        },
        header: {
          token: token,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data) {
            that.setData({
              isfollow: true
            })
          }
        }
      })
      //判断该文章是否点赞了
      wx.request({
        url: app.globalData.host +'/article/isLike',
        method: 'GET',
        data: {
          articleId: articleId
          //文章id
        },
        header: {
          token: token,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //根据res.result判断是否关注了然后修改islike
          if (res.data) {
            that.setData({
              islike: true
            })
          }
        }
      })
      //判断该文章是否收藏了
      wx.request({
        url: app.globalData.host +'/article/isFavorite',
        method: 'GET',
        data: {
          articleId: articleId
        },
        header: {
           token: token,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //根据res.result判断是否关注了然后修改isfavorite
          if (res.data) {
            that.setData({
              isfavorite: true
            })
          }
        }
      })
    }
  },
  //关注
  follow:function(){
    var that=this;
    //判断是否登录
    if (!app.globalData.islogin) {
      //提示登录
    } else {
    //关注，取消关注（需要判断是否登录失效）
      wx.request({
        url: app.globalData.host +'/article/follow',
        data:{
          authorId:authorId
        },
        header:{
          token:token
        },
        success:function(res){
          //操作成功
          if(res.data){
            that.setData({
              isfollow:!that.data.isfollow
            })
          }else if(res.data==false){
            //操作失败
          }else{
            //登录过期
          }
        }
      })
    }
  },
  //点赞
  like:function(){
    var that = this;
    //判断是否登录
    if (!app.globalData.islogin){
      //提示登录
    }else{
       //点赞，取消点赞（需要判断是否登录失效）
      wx.request({
        url: app.globalData.host +'/article/like',
        data:{
          authorId:authorId,
          articleId:articleId,
          title:title
        },
        header: {
          token: token
        },
        success:function(res){
          //操作成功
          if (res.data) {
            that.setData({
              islike: !that.data.islike
            })
          } else if (res.data == false) {
            //操作失败
          } else {
            //登录过期
          }
        }
      })
    }
  },
  //收藏
  favorite:function(){
    var that = this;
    //判断是否登录
    if (!app.globalData.islogin) {
      //提示登录
    } else {
      wx.request({
        url: app.globalData.host +'/article/favorite',
        data: {
          articleId: articleId,
        },
        header: {
          token: token
        },
        success: function (res) {
          //操作成功
          if (res.data) {
            that.setData({
              isfavorite: !that.data.isfavorite
            })
          } else if (res.data == false) {
            //操作失败
          } else {
            //登录过期
          }
        }
      })
    } 
  },
  //加载评论
  loadComments:function(){
    var that = this
    //请求评论
    wx.request({
        url: app.globalData.host +'/article/getCommentList',
        method: 'GET',
        data : {
          articleId: articleId
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success : function(res){
          that.setData({
            commentList:res.data
          })    
        }
    }) 
  },
  //发表评论
  sendComment: function (e) {
    //判断是否登录
    if (!app.globalData.islogin){
      //请先登录
      return;
    }
    var that = this
    //发送评论评论 该功能无法使用，仅作保留
    wx.request({
      url: app.globalData.host +'/article/insertComment',
      method: 'GET',
      header: {
        token: token
      },
      data: {
        articleId: articleId,
        //标题也带上
        title: title,
        commentContent: myComment,
        receiverId: authorId
      },
      success: function (res) {
        if (res.data == true) {
          //评论成功成功
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 2000,
          })
          //清空输入栏
          that.setData({
            inputcontent: ''
          })
          //刷新评论
          that.loadComments()
        } else if (res.data == true) {
          wx.showToast({
            title: '评论失败',
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
  },
  //点击回复Ta
  reply:function(e){
    if (!app.globalData.islogin) {
      //请先登录
      return;
    }
    this.setData({
      placeholder: '回复' + e.currentTarget.dataset.sendernickname,
      iscomment:false,
      receiverNickname: e.currentTarget.dataset.sendernickname,
      receiverId: e.currentTarget.dataset.senderid,
      commentId: e.currentTarget.dataset.commentid,
      index: e.currentTarget.dataset.index
    })
  },
  //
  cancel:function(){
    this.setData({
      iscomment: true
    })
  },
  //发表回复
  sendReply:function(){
    var that=this;
    wx.request({
      url: app.globalData.host +'/article/insertReply',
      method: 'GET',
      header: {
        token: wx.getStorageSync('token'),
      },
      data: {
        //回复内容
        replyContent: myComment,
        //回复所属评论
        commentId: that.data.commentId,
        //回复的人id
        receiverId: that.data.receiverId,
        //回复的人nickname
        receiverNickname: that.data.receiverNickname,
        //回复类型
        type: 1
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
          let temp = 'commentList[' + that.data.index + '].replyNums'
          //回复成功
          wx.showToast({
            title: '回复成功',
            icon: 'success',
            duration: 2000,
          })
          //该评论回复数加一
          //that.data.commentList[that.data.index].replyNums = 
          that.setData({
            inputcontent: '',
            iscomment:true,
            [temp]: that.data.commentList[that.data.index].replyNums + 1
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