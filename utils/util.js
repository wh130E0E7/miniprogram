var COS = require('./cos-wx-sdk-v5');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//cos图片上传
function upload(url){
  console.log(url);
  var cos = new COS({
    SecretId: 'AKIDutshIdRdFcqvlMlpgIeqoXEl36uSK63p',
    SecretKey: 'jDSSCnAHCrITO4cvznMjtoV5QZT8YjeJ',
  });
  var filename = url.substr(url.lastIndexOf('/') + 1);
  var Key = 'img/' + filename; // 这里指定上传的文件名
  cos.postObject({
      Bucket: 'img-1301061617', 
      Region: 'ap-nanjing', 
      Key: Key,
      FilePath: url,
      onProgress: function (info) {
          console.log(JSON.stringify(info));
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
