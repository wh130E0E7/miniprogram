// pages/actions/actions.js
/*
在Page外部声明var变量时，当用户退出该页面时，只要该页面还驻留在内存中未被销毁，则当再次加载此页面时，变量的值不会改变。
*/
var app=getApp()
var token=''
Page({
  /**
   * 页面的初始数据
   */
  data: {
    refresh:false,
    loading: false,
    loadingFailed: false,
    currentpage: 1,
    articleList: [],
    totalpages: null,
    flag: true,
    islogin:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    token = wx.getStorageSync('token');
    this.setData({
      islogin: app.globalData.islogin
    })
    if (app.globalData.islogin){
      //因为app加载的时候就已经刷新过一次动态列表了，就直接获取就可以了
      wx.showLoading({
        title: '加载中',
      })
      this.loadContent();
    }
  },
  onShow:function(){
    token = wx.getStorageSync('token');
    console.log(token)
    if (app.globalData.islogin&&!this.data.islogin) {
      wx.showLoading({
        title: '加载中',
      })
      this.getnewContent();
    }
    this.setData({
      islogin: app.globalData.islogin
    })
  },
  //加载内容
  loadContent:function(){   
    //隐藏数字红点
    wx.hideTabBarRedDot({
      index: 2
    })
    //加载内容
    var that = this;
    wx.request({
      url: app.globalData.host+'/user/getActionList',
      method:'POST',
      data: {
        page: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: function (res) {
        wx.hideLoading()
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.setData({
            articleList: res.data.rows,
            totlapages: res.data.totalPages,
            loading: false,
            loadingFailed: false,
            flag: true,
            currentpage:1
          })
        }
        else {
          app.dealStatuscode(res.statusCode)
        }  
      }
    })
  },
  //加载下一页
  loadMore: function () {
    if (!this.data.flag) {
      return
    }
    var that = this;
    that.setData({
      flag: false
    })
    if (this.data.currentpage == this.data.totalpages) {
      //不可以上拉但是可以下拉
      this.setData({
        flag:true
      })
      wx.showToast({
        title: '没有更多了',
        icon:'none'
      })
      return;
    }
    this.setData({
      loading: true
    })
    wx.request({
      url: app.globalData.host +'/user/getActionList',
      method:'POST',
      data: {
        page: that.data.currentpage + 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          that.setData({
            flag: true,
            loading: false,
            articleList: that.data.articleList.concat(res.data.rows),
            totalpages: res.data.totalPages,
            currentpage: that.data.currentpage + 1
          })
        }
        else {
          that.setData({
            loadingFailed: true,
          })
          setTimeout(function () {
            that.setData({
              loadingFailed: false,
            })
          }, 2000)
          //显示加载失败,俩秒后改回
          app.dealStatuscode(res.statusCode)
        } 
      }
    })
  },
  //更新动态列表，并且重新加载
  getnewContent:function(){
    var that=this;
    wx.request({
      url: app.globalData.host + '/user/getActionSize',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: token
      },
      success: function (res) {
        that.setData({
          refresh: false,
          flag: true
        })
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (res.data > 0) {
            //提示新增多少动态
            wx.showToast({
              title: '新增' + res.data + '动态',
              icon: 'none',
              duration:3000
            })
          } 
            that.loadContent();
        }
        else {
          app.dealStatuscode(res.statusCode)
        }
      }
    })
  },
  //下拉刷新
  refresh:function(){
    if (!this.data.flag) {
      return
    }
    var that = this;
    that.setData({
      flag: false
    })
    this.setData({
      refresh: true
    })
    //加载内容
    this.getnewContent();
  }
})