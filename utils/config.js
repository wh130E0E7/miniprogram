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
shakeWelcomeImg: 摇一摇欢迎图片*/
// 静态资源地址
var staticUrl = 'https://img-1301061617.cos.ap-nanjing.myqcloud.com/skin'
module.exports = {
    skinList: [
      { title: '公路', imgUrl: staticUrl + '/0.jpg'},
      { title: '黑夜森林', imgUrl: staticUrl + '/1.jpg'},
      { title: '鱼与水', imgUrl: staticUrl + '/2.jpg'},
      { title: '山之剪影', imgUrl: staticUrl + '/3.jpg'},
      { title: '城市', imgUrl: staticUrl + '/4.jpg' },
    ]
}
