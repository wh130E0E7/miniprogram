var WxParse = require('../../wxParse/wxParse.js');
var Util = require('../../utils/util.js');
var article_id = ''
var myComment = ''
Page({
  data:{
    article:{
      title:'测试标题',
      content: '<p class="csasf">  今天一早做了个恶梦，梦到被老板辞退了。虽然说在我们公司，只有我辞退老板的份，没有老板辞退我这一说，但是还是被吓得 4 点多都起来了。（主要是因为我掌握着公司所有的核心源码，哈哈哈）</p><p> 既然 4 点多起来，就得好好利用起来。于是我就挑选了 9 个堪称神器的学习网站，推荐给大家。如果觉得不错的话，文末请点赞。</p><img src="https://img-1301061617.cos.ap-nanjing.myqcloud.com/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.YjAQjZRE77EAfb7a2c86d412360724a9cd0b738ba416.png"></img>',
      read_cnt:5586
    }
    
  },
  onTextChanged: function(e){
    myComment = e.detail.value
  },
  onSendClicked: function(e){
    if(myComment.length<1 || myComment.length>200){
      return
    }
    var that = this
    //发送评论评论 该功能无法使用，仅作保留
    wx.request({
        url : 'http://你的服务器地址/news/comment',
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
    article_id = options.article_id 
    WxParse.wxParse('content', 'html',this.data.article.content, that, 0);
    //请求文章详情
    wx.request({
        url : 'http://你的服务器地址/news/detail',
        method: 'POST',
        data : {
          article_id: article_id
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
    this.loadComments()
  },
  loadComments:function(){
    var that = this
    //请求评论
    wx.request({
        url : 'http://你的服务器地址/news/commentList',
        method: 'POST',
        data : {
          article_id: article_id,
          orderType: 0,
          start_id:0,
          limit:100
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success : function(res){
          console.log(res)
          var _comments = res.data.comments
          for(var i in _comments){
            _comments[i].time = Util.getTime(_comments[i].time)
          }
          that.setData({
              commentList:_comments
          });
        }
    })
  }
})