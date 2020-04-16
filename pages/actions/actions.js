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
    noMore: false,
    loadingFailed: false,
    currentpage: 1,
    articleList: [],
    totlapages: null,
    flag: true,
    islogin:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    token=wx.getStorageSync('token'),
    this.setData({
      islogin: app.globalData.islogin
    })
    if (app.globalData.islogin){
      this.loadContent();
    }
  },
  onShow:function(){
    //目前为登录状态但是之前未登录,重新加载文章
    if (app.globalData.islogin &&!this.data.islogin){
      this.loadContent();
      this.setData({
        loading: false,
        noMore: false,
        loadingFailed: false,
        flag: true,
      })
    }
    this.setData({
      islogin: app.globalData.islogin
    })
  },
  //加载内容
  loadContent:function(){
    wx.showLoading({
      title: '加载中',
    })
    //隐藏数字红点
    wx.hideTabBarRedDot({
      index: 1
    })
    //加载内容
    var that = this;
    wx.request({
      url:  app.globalData.host+'/user/getActionList',
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
            totlapages: res.data.totalPages
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
    if (this.data.currentpage == this.data.totlapages) {
      this.setData({
        noMore: true
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
            totlapages: res.data.totalPages,
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
    var that = this;
    wx.request({
      url: app.globalData.host + '/user/getActionSize',
      method:'POST',
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
              icon: 'none'
            })
            //重新加载页面
            wx.request({
              url: app.globalData.host + '/user/getActionList',
              data: {
                page: 1
              },
              header: {
                token: token
              },
              success: function (res) {
                that.setData({
                  articleList: res.data.rows,
                  totlapages: res.data.totalPages
                })
              }
            })
          } else {
            //提示暂无新动态
            wx.showToast({
              title: '暂无新动态',
              icon: 'none'
            })
          }
        }
        else {
          app.dealStatuscode(res.statusCode)
        }  
      }
    })
   
  }
})