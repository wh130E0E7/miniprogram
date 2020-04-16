var until = require('../../utils/util');
var app = getApp()
Page({
  data: {
    showTopTips: false,
    title: '',
    tag: '',
    type: 1,
    summary: '',
    content: '',
    index: 0,
    blocks: [],
    typeArray: []
  },
  onLoad: function() {
    let that = this;
    //动态获取类别
    wx.request({
      url: 'http://localhost:8080/type/getTypeList',
      success:function(res){
        that.setData({
          typeArray:res.data
        })
      }
    })
    //定义动画效果
    var fadeOutLeft = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })
    fadeOutLeft.translate3d("-100%", 0, 0).step();
    this.fadeOutLeft = fadeOutLeft;

    var fadeOutRight = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })
    fadeOutRight.translate3d("100%", 0, 0).step();
    this.fadeOutRight = fadeOutRight;
  },
  handPlus: function(e) {
    // 绑定增加编辑窗    
    let _order = e.target.dataset.order; //属性传值，所属列表位置
    let _blocks = this.data.blocks; //获得数组
    // 依次+1，插入编辑窗口
    _blocks.map(function(n, i) { //n为对象，i为该对象在数组位置
      if (n.index >= _order) {
        _blocks[i].index += 1;
      }
    })
    _blocks.push({
      'index': _order,
      'value': ''
    }); //map数组，index和内容
    _blocks.sort(function(a, b) {
      return a.index - b.index;
    }) //按index排序
    this.setData({
      'blocks': _blocks //赋值回去
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  //选择
  bingTypeSelect: function(e) {
    // 输入类型
    let type = e.target.dataset.type;
    let blocks = this.data.blocks;
    let index = e.target.dataset.index;
    if (type == "image") {
      blocks[index].type = type; //为什么有这个属性？可以直接添加       
      this._handImageUpload(index);
    } else {
      this._handTextInput(index);
    }
  },
  //上升
  handBlockUp: function(e) {
    let index = e.target.dataset.index;
    let _blocks = this.data.blocks;

    if (index == 0) return;
    //下降一
    _blocks[index - 1].index += 1;
    //上升一
    _blocks[index].index -= 1;
    _blocks.sort(function(a, b) {
      return a.index - b.index;
    })
    this.setData({
      'blocks': _blocks
    })
  },
  //下降
  handBlockDown: function(e) {
    let index = e.target.dataset.index;
    let _blocks = this.data.blocks;
    if (index == _blocks.length - 1) return;

    _blocks[index + 1].index -= 1;
    _blocks[index].index += 1;
    _blocks.sort(function(a, b) {
      return a.index - b.index;
    })
    this.setData({
      'blocks': _blocks
    })
  },
  //关闭
  handBlockClose: function(e) {
    let index = e.target.dataset.index;
    let _blocks = this.data.blocks;
    let self = this;
    wx.showModal({
      title: '确定要删除此段落吗？',
      success: function(res) {
        if (res.confirm) {
          _blocks.splice(index, 1);
          // 更新排序，删除之后index与数组位置已经不对应，要更新一下
          _blocks.map(function(n, i) {
            n.index = i
          })
          self.setData({
            'blocks': _blocks
          })
        }
      }
    });
  },
  //绑定标题
  bindTitleInput: function(e) {
    this.setData({
      title: e.detail.value
    })
  },
  //绑定标签
  bindTagInput: function(e) {
    this.setData({
      tag: e.detail.value
    })
  },
  //选择文字，绑定type与动画
  _handTextInput: function(index) {
    let blocks = this.data.blocks;

    blocks[index].fadeOutLeft = this.fadeOutLeft
    blocks[index].fadeOutRight = this.fadeOutRight

    this.setData({
      'blocks': blocks
    }) //先绑定动画

    setTimeout(function() { //为什么要用定时器？
      //bind() 方法的主要作用就是将函数绑定至某个对象，bind() 方法会创建一个函数，函数体内this对象的值会被绑定到传入bind() 函数的值。
      blocks[index].type = "text";
      this.setData({
        'blocks': blocks
      })
    }.bind(this), 250)
  },
  bindContentInput: function(e) {
    // 绑定输入事件
    let _index = e.target.dataset.index; //所编辑的位置
    let _blocks = this.data.blocks; //获得值

    _blocks[_index].value = e.detail.value;
    this.setData({
      'blocks': _blocks //赋值回去
    })
  },
  //将图片赋值给对应value
  _handImageUpload: function(index) {
    let blocks = this.data.blocks;
    let self = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFiles[0].path;
        blocks[index].value = tempFilePaths;
        self.setData({
          'blocks': blocks
        })
      }
    })
  },
  showMsg: function(msg) {
    var self = this;
    self.setData({
      'topTipMsg': msg,
      'showTopTips': true
    })
    setTimeout(function() {
      self.setData({
        'showTopTips': false,
        'topTipMsg': ''
      })
    }, 2000);
  },

  formSubmit: function(e) {
    let title = this.data.title;
    let tag = this.data.tag;
    let type = this.data.typeArray[this.data.index].typeId;
    var content = '';
    var summary = '';
    var containImgpath = '';
    var token = wx.getStorageSync('token');
    if (this.data.title.length == 0) {
      console.log('标题不得为空');
      //this.showMsg('请写些内容吧');
      return;
    }
    if (this.data.blocks.length == 0) {
      console.log('内容不得为空');
      //this.showMsg('请写些内容吧');
      return;
    }
    this.data.blocks.map(function(n, i) {
      //如果是图片就直接上传到cos服务器上，获得返回地址
      //拼接文章内容
      if (n.type == 'image') {
        containImgpath += until.upLoad(n.value) + ",";
        content += '<img src="' + until.upLoad(n.value) + '"></img>';
      } else {
        content += "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + n.value + "</p>";
        summary += n.value;
      }
    })
    //摘要为前100个字
    if (summary.length > 100)
      summary = summary.slice(0, 100);
    //提交文章
    wx.request({
      url: 'http://localhost:8080/article/insertArticle',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' ,// 默认值
        token: token,
      },
      data: {
        title: title,
        summary: summary,
        tag: tag,
        content: content,
        typeId: type,
        containImgpath: containImgpath
      },
      success: function(res) {
        if (res.data.result == 'success') {
          wx.navigateBack({
            success: function(res) {
              wx.showToast({
                title: '文章发布成功',
                duration: 1000,
                icon: 'success'
              })
            }
          })
        } else if (res.data.result == 'fail') {
          wx.showToast({
            title: '文章发布失败',
            duration: 1000,
            icon: 'loading'
          })
        } else {
          //登录过期，被拦截了
        }
      }
    })
  },
})