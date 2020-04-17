import util from "../../utils/util.js";
var app = getApp()
var token=''
Page({
  data: {
    islogin:false,
    //消息数量
    newMessageNums:0,
    hotlist: [], //最热文章列表
    hot_currentpage: 1, //最热文章当前页
    hot_totalpages:null,
    hot_flag:true,
    newlist: [],
    new_flag: true,
    new_currentpage: 1,
    new_totalpages: null,
    new_loading:false,
    new_loadingFailed:false,
    hot_loading: false,
    hot_loadingFailed: false,
    currentTab: 0,
  },
  //最热列表加载下一页
  hot_loadMore:function(){
    var that = this;
    if (!this.data.hot_flag) {
      return
    }
    that.setData({
      hot_flag: false
    })
    if (this.data.hot_currentpage == this.data.hot_totalpages) {
      //flag不重新设为true,则将无法继续上拉
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
      return;
    }else{
      this.setData({
        hot_loading: true
      })
    }
    wx.request({
      url: app.globalData.host +'/article/getTopNList',
      method:'POST',
      data: {
        page: that.data.hot_currentpage + 1
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.setData({
            hot_flag: true,
            hot_loading: false,
            hotlist: that.data.hotlist.concat(res.data.rows),
            hot_totalpages: res.data.totalPages,
            hot_currentpage: that.data.hot_currentpage + 1
          })
        }
        else {
          that.setData({
            hot_loadingFailed: true,
          })
          setTimeout(function () {
            that.setData({
              hot_loadingFailed: false,
            })
          }, 2000)
          //显示加载失败,俩秒后改回
          app.dealStatuscode(res.statusCode)
        }  
      }
    })
  },
  //最新列表加载下一页
  new_loadMore:function(){
    if (!this.data.new_flag) {
      return
    }
    var that = this;
    that.setData({
      new_flag: false
    })
    if (this.data.new_currentpage == this.data.new_totalpages) {
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
      return;
    }
    this.setData({
      new_loading: true
    })
    wx.request({
      url: app.globalData.host +'/article/getNewNList',
      method:'POST',
      data: {
        page: that.data.new_currentpage + 1
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            that.setData({
              new_flag: true,
              new_loading: false,
              newlist: that.data.newlist.concat(res.data.rows),
              new_totalpages: res.data.totalPages,
              new_currentpage: that.data.new_currentpage + 1
            })
          }
          else {
            that.setData({
              new_loadingFailed: true,
            })
            setTimeout(function () {
              that.setData({
                new_loadingFailed: false,
              })
            }, 2000)
            //显示加载失败,俩秒后改回
            app.dealStatuscode(res.statusCode)
          }
        }
    })
  },
  onLoad: function(options) {
    //初始化新消息数量
    var that = this;
    that.setData({
      newMessageNums: app.globalData.newMessageNums
    })
    //每隔5秒获取新消息数量
    setInterval(function () {
      that.setData({
        newMessageNums: app.globalData.newMessageNums
      })
    }, 5000);
  },
  //每次返回都自动刷新页面
  onShow:function(){
    this.loadNewN();
    this.loadTopN();
    //重新将页面设为1
    this.setData({
      hot_currentpage: 1,
      new_currentpage: 1,
      new_flag: true,
      hot_flag: true,
    })
  },
  //加载最热文章
  loadTopN:function(){
    var that=this;
    wx.request({
      url: app.globalData.host +'/article/getTopNList',
      method:'POST',
      data:{
        page: 1
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.setData({
            hotlist: res.data.rows,
            hot_totalpages: res.data.totalPages
          })
        }
        else {
          app.dealStatuscode(res.statusCode)
        }  
        
      }
    })
  },
  //加载最新文章
  loadNewN: function () {
    var that = this;
    wx.request({
      url: app.globalData.host +'/article/getNewNList',
      method:'POST',
      data: {
        page: 1
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.setData({
            newlist: res.data.rows,
            new_totalpages: res.data.totalPages
          })
        }
        else {
          app.dealStatuscode(res.statusCode)
        } 
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
  //点击编写文章界面
  navigateToAddArticle: function() {
    if (app.globalData.islogin) {
      wx.navigateTo({
        url: '../editor/editor',
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
      })
      //提示请先登录  
      wx.switchTab({
        url: '../mine/mine',
      })
    }
  },
  //点击消息通知界面
  navigateToNotices: function() {
    if (app.globalData.islogin) {
      wx.navigateTo({
        url: '../notices/notices',
      })
    } else {
      //提示请先登录  
      wx.showToast({
        title: '请先登录',
        icon: 'none',
      })
      wx.switchTab({
        url: '../mine/mine',
      })
    }
  }

})