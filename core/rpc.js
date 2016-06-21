/**
 * Created by buhe on 16/4/12.
 */
import conf from './conf.js';

/**
 * 直传文件
 * formInput对象如何配置请参考七牛官方文档“直传文件”一节
 */
exports.uploadFile = function (uri, token, formInput) {
  if (typeof formInput !== 'object') {
    return false;
  }
  
  let formData = new FormData();
  for (let k in formInput) {
    formData.append(k, formInput[k]);
  }
  if(!formInput.file) formData.append('file', {uri: uri, type: 'application/octet-stream'});
  if(!formInput.token) formData.append('token', token);
  
  let options = {};
  options.body = formData;
  options.method = 'POST';
  return fetch(conf.UP_HOST, options);
}

//发送管理和fop命令,总之就是不上传文件
exports.post = function (uri, adminToken,content) {
  var headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  let payload = {
    headers: headers,
    method: 'POST',
    dataType: 'json',
    timeout: conf.RPC_TIMEOUT,
  };
  if(typeof content === 'undefined'){
    payload.headers['Content-Length'] = 0;
  }else{
    //carry data
    payload.body = content;
  }

  if (adminToken) {
    headers['Authorization'] = adminToken;
  }

  return fetch(uri, payload);
}
