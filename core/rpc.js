/**
 * Created by guguyanhua on 16/4/12.
 * react native implements
 */
import conf from './conf.js';


exports.uploadImage = function (uri, key, token, onresp) {
  let formData = new FormData();
  formData.append('file', {uri: uri, type: 'application/octet-stream', name: key});
  formData.append('key', key);
  formData.append('token', token);

  let options = {};
  options.body = formData;
  options.method = 'post';
  return fetch(conf.UP_HOST, options).then((response) => {
    onresp(response);
  });
}
