// pages/detail/detail.js
var app = getApp()
Page({
  data: {
    currentTab: 0,
    height:600,
    likeMessageList: [{
      "senderAvatarPath": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqoTOhI0YuqV8SFnxxFBJhEqLmqicvsSNHeTmKficY0xBliblQRdMgibpX3xibqKyiafa0sn07ia8LWzia4nQ/132",
      "senderId": "wanghui",
      "senderNickname":"世界末日",
      "title": "周杰伦的床边故事",
      "articleId": "1f58e397-db27-4cf9-b3fc-c35cbefd5ff6",
      "publishTime":"2019-9-3 14:20:16"
    }, {
        "senderAvatarPath": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqoTOhI0YuqV8SFnxxFBJhEqLmqicvsSNHeTmKficY0xBliblQRdMgibpX3xibqKyiafa0sn07ia8LWzia4nQ/132",
        "senderId": "wanghui",
        "senderNickname": "世界末日",
        "title": "周杰伦的床边故事",
        "articleId": "1f58e397-db27-4cf9-b3fc-c35cbefd5ff6",
        "publishTime":"2019-9-3 14:20:16"
      }
    ],
    like_currentpage:1,
    commentMessageList:[{
      "senderAvatarPath": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqoTOhI0YuqV8SFnxxFBJhEqLmqicvsSNHeTmKficY0xBliblQRdMgibpX3xibqKyiafa0sn07ia8LWzia4nQ/132",
      "senderId": "wanghui",
      "senderNickname": "世界末日",
      "title": "周杰伦的床边故事",
      "articleId": "1f58e397-db27-4cf9-b3fc-c35cbefd5ff6",
      "publishTime": "2019-9-3 14:20:16"
    }, {
    "senderAvatarPath": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqoTOhI0YuqV8SFnxxFBJhEqLmqicvsSNHeTmKficY0xBliblQRdMgibpX3xibqKyiafa0sn07ia8LWzia4nQ/132",
    "senderId": "wanghui",
    "senderNickname": "世界末日",
    "title": "周杰伦的床边故事",
    "articleId": "1f58e397-db27-4cf9-b3fc-c35cbefd5ff6",
    "publishTime": "2019-9-3 14:20:16"
  }
    ],
    comment_currentpage:1,
    followMessageList: [{
      "senderAvatarPath": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqoTOhI0YuqV8SFnxxFBJhEqLmqicvsSNHeTmKficY0xBliblQRdMgibpX3xibqKyiafa0sn07ia8LWzia4nQ/132",
      "senderId": "wanghui",
      "senderNickname": "世界末日"
    }] ,
    follow_currentpage:1
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    if (e.detail.source == 'touch') {
      this.setData({
        currentTab: e.detail.current
      })
    };
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})
