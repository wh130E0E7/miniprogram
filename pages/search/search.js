// pages/search/search.js
var app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyword:'',
    hotlist:[],
    historylist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
   this.getHotKeyWord();
  },
  getHotKeyWord:function(){
    var that=this;
   wx.request({
     url: app.globalData.host + '/getHotKeyWord',
     success:function(res){
       that.setData({
         hotlist: res.data
       })
     }
   })
  },
  bindkeyWordInput: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  hotnav:function(e){
    this.setData({
      keyword: e.target.dataset.keyword
    })
    this.search();
  },
  search:function(){
    var that=this;
    console.log(this.data.keyword)
    if (this.data.keyword==''){
      wx.showToast({
        title: '搜索内容不得为空',
        icon: 'none',
      })
      return;
    }
    var keyword = that.data.keyword
    let history = wx.getStorageSync("history") || [];
    history.push(keyword)
    wx.setStorageSync("history", history);
    wx.navigateTo({
      url: '../searchResult/searchResult?keyword=' + keyword,
    })
    this.setData({
      keyword:''
    })
  },
  clearAllHistory:function(){
    this.setData({
      historylist: []
    })
    wx.setStorageSync("history", []);
  },
  clearHistoryByIndex:function(e){
    var index = e.currentTarget.dataset.i;
    var history;
    if (this.data.historylist.length==1){
      history=[];
    }else{
      history = this.data.historylist.splice(index - 1, 1)
    }
    this.setData({
      historylist: history
    })
    wx.setStorageSync("history", history);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      historylist: wx.getStorageSync("history") || []
    })
  },
})