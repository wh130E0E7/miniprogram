var WxParse = require('../../wxParse/wxParse.js');
var Util = require('../../utils/util.js');
var article_id = ''
var myComment = ''
Page({
  data:{
    author:{  avatar:'https://img-1301061617.cos.ap-nanjing.myqcloud.com/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.YjAQjZRE77EAfb7a2c86d412360724a9cd0b738ba416.png',
      nickname:'爱瞌睡的猫'
    },
    article:{
        title:'钟南山团队开发出新型试剂盒：一滴血15分钟出结果，现场即可检测',
        content: '<p>新冠病毒非常狡猾，具有超长潜伏期。最近，越来越多的检测产品已经研制出来，针对不同情况，更高效、便捷、安全地进行检测。据了解，钟南山团队于近日成功研发了一款新型的新冠病毒抗体检测试剂盒。该试剂盒仅需采取一滴血就有望在15分钟内肉眼观察得出结果，大大缩短了检测的时间。</p> <img src="https://img-1301061617.cos.ap-nanjing.myqcloud.com/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.mhpO9ON0qd8m1602dea1cdee73c9ccf97b4f5ee72785.jpeg"></img> <p>它应用胶体金免疫层析技术，采用间接法检测新型冠状病毒（SARS-COV2）IgM抗体。据多个中心的临床标本检测评价证实，该检测试剂临床检测的敏感性高达88.66%，检测特异性为90.63%；IgM-IgG联合抗体检测的敏感性远高于IgM或IgG单抗体检测。这样一来，能够有效突破现有检测技术对人员、场所的限制，缩短时间的同时，也可以实现现场筛查、指尖即可采血，将更快发现感染者！据悉，目前该试剂盒（科研用）样品已送至湖北省多地基层卫生机构，用于新冠病毒感染检测。近日，这一研究的具体结果，已经在线发表在《医学病毒学杂志》上。</p>',
       read_cnt:5586,
       publishTime:'2020-03-25',
    },
    commentList: [
      {
        avatar: 'https://img-1301061617.cos.ap-nanjing.myqcloud.com/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.YjAQjZRE77EAfb7a2c86d412360724a9cd0b738ba416.png',
        nickname: '爱瞌睡的猫',
        content: '这是一篇好文章============================',
        publishTime: '2020-03-25',
        replynum: 0
      },
      {
        avatar: 'https://img-1301061617.cos.ap-nanjing.myqcloud.com/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.YjAQjZRE77EAfb7a2c86d412360724a9cd0b738ba416.png',
        nickname: '爱瞌睡的猫',
        content: '这是一篇好文章',
        publishTime: '2020-03-25',
        replynum: 5
      },
      {
        avatar: 'https://img-1301061617.cos.ap-nanjing.myqcloud.com/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.YjAQjZRE77EAfb7a2c86d412360724a9cd0b738ba416.png',
        nickname: '爱瞌睡的猫',
        content: '这是一篇好文章',
        publishTime: '2020-03-25',
        replynum: 1
      }
    ],
    isfollow: false,
    islike:false,
    isfavorite:false
  },
  onTextChanged: function(e){
    myComment = e.detail.value
  },
  onSendClicked: function(e){
    //判断是否登录
    
    var that = this
    //发送评论评论 该功能无法使用，仅作保留
    wx.request({
      url: 'http://localhost:8080/news/comment',
        method: 'POST',
        data : {
          uid:'',
          token:'',
          article_id: article_id,
          content: myComment
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success : function(res){
          //（需要判断是否登录失效）
          //评论成功成功
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 2000
          })
          //刷新评论
          that.loadComments()
        }
    })
  },
  onLoad:function(options){
    var that = this
    article_id = options.articleId 
    WxParse.wxParse('content', 'html',this.data.article.content, that, 0);
    //请求文章详情
    wx.request({
        url : 'http://localhost:8080/article/selectArticleById',
        method: 'GET',
        data : {
          //文章id由列表栏传递过来
          articleId: articleId
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success : function(res){
          var _content = res.data.article['content']
          that.setData({
              article: res.data.article
          });
          WxParse.wxParse('content', 'html', _content, that,0);
        }
    })
    //加载评论
    this.loadComments();

    //登录则判断

    //判断是否关注了该作者
    wx.request({
      url: '',
      method: 'GET',
      data: {
        //用户token
        
        //作者id
        
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //关注了则修改isfollow
      }
    })
    //判断该文章是否点赞了
    wx.request({
      url: '',
      method: 'GET',
      data: {
        //用户token

        //文章id

      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //根据res.result判断是否关注了然后修改islike
      }
    })
    //判断该文章是否收藏了
    wx.request({
      url: '',
      method: 'GET',
      data: {
        //用户token

        //文章id

      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //根据res.result判断是否关注了然后修改isfavorite
      }
    })
  },
  follow:function(){
  //判断是否登录
  //关注，取消关注（需要判断是否登录失效）
  },
  like:function(){
    //判断是否登录
    //点赞，取消点赞（需要判断是否登录失效）
  },
  favorite:function(){
      //判断是否登录
    //收藏，取消收藏（需要判断是否登录失效）
  },
  loadComments:function(){
    var that = this
    //请求评论
    wx.request({
      url: 'http://localhost:8080/article/commentList',
        method: 'GET',
        data : {
          articleId: articleId
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success : function(res){
          
        }
    }) 
  }
})