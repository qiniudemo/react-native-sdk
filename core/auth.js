/**
 * Created by guguyanhua on 16/4/12.
 */
import base64 from 'base-64';
import CryptoJS from "crypto-js";
import conf from "./conf.js";
import parse from 'url-parse';

exports.PutPolicy2 = PutPolicy2;
exports.GetPolicy = GetPolicy;

exports.urlsafeBase64Encode = function(jsonFlags) {
  var encoded = base64.encode(jsonFlags);
  return exports.base64ToUrlSafe(encoded);
}

exports.base64ToUrlSafe = function(v) {
  return v.replace(/\//g, '_').replace(/\+/g, '-');
}

exports.hmacSha1 = function(encodedFlags, secretKey) {
  var encoded = CryptoJS.HmacSHA1(encodedFlags, secretKey).toString(CryptoJS.enc.Base64);;
  return encoded;
}

exports.generateAccessToken = function(url, body) {
  var u = parse(url, true);

  var path = u.pathname;
  var access = path + '\n';

  if (body) {
    access += body;
  }

  var digest = exports.hmacSha1(access, conf.SECRET_KEY);
  var safeDigest = exports.base64ToUrlSafe(digest);
  let token = 'QBox ' + conf.ACCESS_KEY + ':' + safeDigest;
  console.log(token);
  return token;
}

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
  var encodedFlags = exports.urlsafeBase64Encode(JSON.stringify(flags));
  var encoded = exports.hmacSha1(encodedFlags, conf.SECRET_KEY);
  var encodedSign = exports.base64ToUrlSafe(encoded);
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

function GetPolicy(expires) {
  this.expires = expires || 3600;
}

GetPolicy.prototype.makeRequest = function(baseUrl) {
  var deadline = this.expires + Math.floor(Date.now() / 1000);

  if (baseUrl.indexOf('?') >= 0) {
    baseUrl += '&e=';
  } else {
    baseUrl += '?e=';
  }
  baseUrl += deadline;

  var signature = exports.hmacSha1(baseUrl, conf.SECRET_KEY);
  var encodedSign = exports.base64ToUrlSafe(signature);
  var downloadToken = conf.ACCESS_KEY + ':' + encodedSign;

  return baseUrl + '&token=' + downloadToken;
}