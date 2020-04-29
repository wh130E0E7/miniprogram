var COS = require('./cos-wx-sdk-v5');
//cos图片上传
var app = getApp()
function upload(url){
  var cos = new COS({
    SecretId: app.globalData.COS_SecretId,
    SecretKey: app.globalData.COS_SecretKey,
  });
  var filename = url.substr(url.lastIndexOf('/') + 1);
  var Key = 'img/' + filename; // 这里指定上传的文件名
  cos.postObject({
      Bucket: 'img-1301061617', 
      Region: 'ap-nanjing', 
      Key: Key,
      FilePath: url,
      onProgress: function (info) {
      }
  }, requestCallback);
  return  'https://img-1301061617.cos.ap-nanjing.myqcloud.com/' + Key ;
}
function requestCallback(err, data) {
  console.log(err || data);
  if (err && err.error) {
      wx.showModal({title: '返回错误', content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode, showCancel: false});
  } else if (err) {
      wx.showModal({title: '请求出错', content: '请求出错：' + err + '；状态码：' + err.statusCode, showCancel: false});
  } 
}
module.exports = {
  upLoad: upload 
}
