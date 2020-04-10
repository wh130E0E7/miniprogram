var COS = require('./cos-wx-sdk-v5');
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
function throttle(fn, interval) {
  var enterTime = 0;//触发的时间
  var gapTime = interval || 300;//间隔时间，如果interval不传，则默认300ms
  return function () {
    var context = this;
    var backTime = new Date();//第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}
module.exports = {
  upLoad: upload ,
  throttle: throttle
}
