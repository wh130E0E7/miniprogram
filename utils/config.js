/*
备注
city: 城市（在程序载入时获取一次）
count: 返回结果数量
baiduAK: 百度地图AK
apiList: api列表
hotKeyword: 搜索页热门关键词关键词
hotTag: 搜索页热门类型
bannerList: 首页（热映页）轮播图列表列表
skinList: “我的”页面背景列表
shakeSound: 摇一摇音效地址（带staticUrl表示远程地址）
shakeWelcomeImg: 摇一摇欢迎图片
*/
// 静态资源地址
var staticUrl = 'https://img-1301061617.cos.ap-nanjing.myqcloud.com'
module.exports = {
    skinList: [
      { title: '公路', imgUrl: staticUrl + '/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.YjAQjZRE77EAfb7a2c86d412360724a9cd0b738ba416.png'},
      { title: '黑夜森林', imgUrl: staticUrl + '/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.YjAQjZRE77EAfb7a2c86d412360724a9cd0b738ba416.png'},
      { title: '鱼与水', imgUrl: staticUrl + '/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.YjAQjZRE77EAfb7a2c86d412360724a9cd0b738ba416.png'},
      { title: '山之剪影', imgUrl: staticUrl + '/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.YjAQjZRE77EAfb7a2c86d412360724a9cd0b738ba416.png'},
      { title: '火山', imgUrl: staticUrl + '/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.YjAQjZRE77EAfb7a2c86d412360724a9cd0b738ba416.png'},
      { title: '科技', imgUrl: staticUrl + '/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.YjAQjZRE77EAfb7a2c86d412360724a9cd0b738ba416.png'},
      { title: '沙漠', imgUrl: staticUrl + '/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.YjAQjZRE77EAfb7a2c86d412360724a9cd0b738ba416.png'},
      { title: '叶子', imgUrl: staticUrl + '/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.YjAQjZRE77EAfb7a2c86d412360724a9cd0b738ba416.png'},
      { title: '早餐', imgUrl: staticUrl + '/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.YjAQjZRE77EAfb7a2c86d412360724a9cd0b738ba416.png'},
      { title: '英伦骑车', imgUrl: staticUrl + '/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.YjAQjZRE77EAfb7a2c86d412360724a9cd0b738ba416.png'},
      { title: '草原', imgUrl: staticUrl + '/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.YjAQjZRE77EAfb7a2c86d412360724a9cd0b738ba416.png'},
      { title: '城市', imgUrl: staticUrl + '/img/wxb2810458e3b57df3.o6zAJswPmyUQ467WdpP1mTdjOSW8.YjAQjZRE77EAfb7a2c86d412360724a9cd0b738ba416.png'}
    ]
}
