/**
 * Created by guguyanhua on 16/4/12.
 */
var base64 = require('base-64');
var CryptoJS = require("crypto-js");
//import url from "url";
import conf from "./conf.js";

exports.isQiniuCallback = isQiniuCallback;

// ------------------------------------------------------------------------------------------
// func encode

exports.urlsafeBase64Encode = function(jsonFlags) {
  var encoded = base64.encode(jsonFlags);
  return exports.base64ToUrlSafe(encoded);
}

exports.base64ToUrlSafe = function(v) {
  return v.replace(/\//g, '_').replace(/\+/g, '-');
}

exports.hmacSha1 = function(encodedFlags, secretKey) {
  /*
   *return value already encoded with base64
   * */
  //var hmac = crypto.createHmac('sha1', secretKey);
  //hmac.update(encodedFlags);
  //return hmac.digest('base64');
  var encoded = CryptoJS.HmacSHA1(encodedFlags, secretKey).toString(CryptoJS.enc.Base64);;
  return encoded;
}

// ------------------------------------------------------------------------------------------
//// func generateAccessToken
//
//exports.generateAccessToken = function(uri, body) {
//  var u = url.parse(uri);
//  var path = u.path;
//  var access = path + '\n';
//
//  if (body) {
//    access += body;
//  }
//
//  var digest = exports.hmacSha1(access, conf.SECRET_KEY);
//  var safeDigest = exports.base64ToUrlSafe(digest);
//  return 'QBox ' + conf.ACCESS_KEY + ':' + safeDigest;
//}

function isQiniuCallback(path, body, callbackAuth) {
  var auth = exports.generateAccessToken(path, body);
  return auth === callbackAuth;
}