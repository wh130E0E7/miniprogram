// pages/searchResult/searchResult.js
var app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyword:'',
    loading: false,
    noMore: false,
    loadingFailed: false,
    currentpage: 1,
    searchResList: [],
    totalpages: 0,
    totalnums:0,
    flag: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      keyword:options.keyword
    })
    this.search();
  },
  bindkeyWordInput: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },

  search:function(){
    if (this.data.keyword == '') {
      wx.showToast({
        title: '搜索内容不得为空',
        icon: 'none',
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    var that=this;
   wx.request({
     url: app.globalData.host+'/search',
     data:{
       keyword:that.data.keyword,
       page: that.data.currentpage ,
     },
     success: function (res) {
       wx.hideLoading()
       that.setData({
         searchResList: res.data.rows,
         totalpages: res.data.totalPage,
         totalnums: res.data.totalNums
       })
     }
   })
  },
  loadMore: function () {
    if (!this.data.flag) {
      return
    }
    var that = this;
    that.setData({
      flag: false
    })
    if (this.data.currentpage == this.data.totalpages) {
      this.setData({
        noMore: true
      })
      return;
    }
    this.setData({
      loading: true
    })
    wx.request({
      url: app.globalData.host + '/search',
      data: {
        keyword: that.data.keyword,
        page: that.data.currentpage + 1,
      },
      success: function (res) {
        that.setData({
          flag: true,
          loading: false,
          searchResList: that.data.searchResList.concat(res.data.rows),
          currentpage: that.data.currentpage + 1
        })
      }
    })
  },
})