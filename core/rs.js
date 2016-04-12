/**
 * Created by guguyanhua on 16/4/12.
 */
import util from './auth.js';
import conf from './conf.js';

exports.PutPolicy2 = PutPolicy2;

function PutPolicy2(putPolicyObj) {

  if (typeof putPolicyObj !== 'object') {
    return false;
  }

  this.scope = putPolicyObj.scope || null;
  this.expires = putPolicyObj.expires || 3600;
  this.insertOnly = putPolicyObj.insertOnly || null;

  this.saveKey = putPolicyObj.saveKey || null;
  this.endUser = putPolicyObj.endUser || null;

  this.returnUrl = putPolicyObj.returnUrl || null;
  this.returnBody = putPolicyObj.returnBody || null;

  this.callbackUrl = putPolicyObj.callbackUrl || null;
  this.callbackHost = putPolicyObj.callbackHost || null;
  this.callbackBody = putPolicyObj.callbackBody || null;
  this.callbackBodyType = putPolicyObj.callbackBodyType || null;

  this.persistentOps = putPolicyObj.persistentOps || null;
  this.persistentNotifyUrl = putPolicyObj.persistentNotifyUrl || null;
  this.persistentPipeline = putPolicyObj.persistentPipeline || null;

  this.fsizeLimit = putPolicyObj.fsizeLimit || null;

  this.fsizeMin = putPolicyObj.fsizeMin || null;

  this.detectMime = putPolicyObj.detectMime || null;

  this.mimeLimit = putPolicyObj.mimeLimit || null;
}

PutPolicy2.prototype.token = function() {
  var flags = this.getFlags();
  console.log(JSON.stringify(flags));
  var encodedFlags = util.urlsafeBase64Encode(JSON.stringify(flags));
  console.log(encodedFlags);
  var encoded = util.hmacSha1(encodedFlags, conf.SECRET_KEY);
  console.log(encoded);
  var encodedSign = util.base64ToUrlSafe(encoded);
  console.log(encodedSign);
  var uploadToken = conf.ACCESS_KEY + ':' + encodedSign + ':' + encodedFlags;
  return uploadToken;
}

PutPolicy2.prototype.getFlags = function() {
  var flags = {};
  var attrs = ['scope', 'insertOnly', 'saveKey', 'endUser', 'returnUrl', 'returnBody', 'callbackUrl', 'callbackHost', 'callbackBody', 'callbackBodyType', 'callbackFetchKey', 'persistentOps', 'persistentNotifyUrl', 'persistentPipeline', 'fsizeLimit','fsizeMin', 'detectMime', 'mimeLimit'];

  for (var i = attrs.length - 1; i >= 0; i--) {
    if (this[attrs[i]] !== null) {
      flags[attrs[i]] = this[attrs[i]];
    }
  }

  flags['deadline'] = this.expires + Math.floor(Date.now() / 1000);

  return flags;
}
