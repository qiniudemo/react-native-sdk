/**
 * Created by guguyanhua on 16/4/12.
 */
import util from './auth.js';
import conf from './conf.js';
import rpc from './rpc.js';

exports.Client = new Client();
exports.Entry = Entry;
exports.EntryPath = EntryPath;
exports.EntryPathPair = EntryPathPair;
exports.BatchItemRet = BatchItemRet;
exports.BatchStatItemRet = BatchStatItemRet;

function Client(){}

Client.prototype.stat = function(bucket, key, onret) {
  var encodedEntryUri = getEncodedEntryUri(bucket, key);
  var uri = conf.RS_HOST + '/stat/' + encodedEntryUri;
  console.log('uri');
  console.log(uri);
  var digest = util.generateAccessToken(uri, null);

  return rpc.post(uri, digest, onret);
}

Client.prototype.remove = function(bucket, key, onret) {
  /*
   * func (this Client) Delete(bucket, key string) (err error)
   * */
  var encodedEntryUri = getEncodedEntryUri(bucket, key);
  var uri = conf.RS_HOST + '/delete/' + encodedEntryUri;
  var digest = util.generateAccessToken(uri, null);
  return rpc.post(uri, digest, onret);
}

Client.prototype.move = function(bucketSrc, keySrc, bucketDest, keyDest, onret) {
  var encodedEntryURISrc = getEncodedEntryUri(bucketSrc, keySrc);
  var encodedEntryURIDest = getEncodedEntryUri(bucketDest, keyDest);
  var uri = conf.RS_HOST + '/move/' + encodedEntryURISrc + '/' + encodedEntryURIDest;
  var digest = util.generateAccessToken(uri, null);
  return rpc.post(uri, digest, onret);
}

Client.prototype.forceMove = function(bucketSrc, keySrc, bucketDest, keyDest, force, onret) {

  var encodedEntryURISrc = getEncodedEntryUri(bucketSrc, keySrc);
  var encodedEntryURIDest = getEncodedEntryUri(bucketDest, keyDest);
  var uri = conf.RS_HOST + '/move/' + encodedEntryURISrc + '/' + encodedEntryURIDest +'/force/'+force;

  var digest = util.generateAccessToken(uri, null);
  return rpc.post(uri, digest, onret);
}

Client.prototype.copy = function(bucketSrc, keySrc, bucketDest, keyDest, onret) {
  var encodedEntryURISrc = getEncodedEntryUri(bucketSrc, keySrc);
  var encodedEntryURIDest = getEncodedEntryUri(bucketDest, keyDest);
  var uri = conf.RS_HOST + '/copy/' + encodedEntryURISrc + '/' + encodedEntryURIDest;

  var digest = util.generateAccessToken(uri, null);
  return rpc.post(uri, digest, onret);
}

Client.prototype.forceCopy = function(bucketSrc, keySrc, bucketDest, keyDest, force, onret) {

  var encodedEntryURISrc = getEncodedEntryUri(bucketSrc, keySrc);
  var encodedEntryURIDest = getEncodedEntryUri(bucketDest, keyDest);
  var uri = conf.RS_HOST + '/copy/' + encodedEntryURISrc + '/' + encodedEntryURIDest +'/force/'+force;

  var digest = util.generateAccessToken(uri, null);
  return rpc.post(uri, digest, onret);
}


Client.prototype.fetch = function(url, bucket, key, onret) {
  var bucketUri = getEncodedEntryUri(bucket, key);
  var fetchUrl = util.urlsafeBase64Encode(url);
  var uri = 'http://iovip.qbox.me/fetch/' + fetchUrl + '/to/' + bucketUri;
  var digest = util.generateAccessToken(uri, null);
  return rpc.post(uri, digest, onret);
}

function Entry(hash, fsize, putTime, mimeType, endUser) {
  this.hash = hash || null;
  this.fsize = fsize || null;
  this.putTime = putTime || null;
  this.mimeType = mimeType || null;
  this.endUser = endUser || null;
}

// ----- batch  -------

function EntryPath(bucket, key) {
  this.bucket = bucket || null;
  this.key = key || null;
}

EntryPath.prototype.encode = function() {
  return getEncodedEntryUri(this.bucket, this.key);
}

EntryPath.prototype.toStr = function(op) {
  return 'op=/' + op + '/' + getEncodedEntryUri(this.bucket, this.key) + '&';
}

function EntryPathPair(src, dest) {
  this.src = src || null;
  this.dest = dest || null;
}

EntryPathPair.prototype.toStr = function(op, force) {
  if(typeof(force)=='undefined'){

    return 'op=/' + op + '/' + this.src.encode() + '/' + this.dest.encode() + '&';

  }else{

    return 'op=/' + op + '/' + this.src.encode() + '/' + this.dest.encode() + '/force/' + force + '&';
  }
}

function BatchItemRet(error, code) {
  this.error = error || null;
  this.code = code || null;
}

function BatchStatItemRet(data, error, code) {
  this.data = data;
  this.error = error;
  this.code = code;
}

Client.prototype.batchStat = function(entries, onret) {
  return fileHandle('stat', entries, onret);
}

Client.prototype.batchDelete = function(entries, onret) {
  return fileHandle('delete', entries, onret);
}

Client.prototype.batchMove = function(entries, onret) {
  return fileHandle('move', entries, onret);
}

Client.prototype.forceBatchMove = function(entries, force, onret) {

  return fileHandleForce('move', entries, force, onret);

}

Client.prototype.batchCopy = function(entries, onret) {
  return fileHandle('copy', entries, onret);
}

Client.prototype.forceBatchCopy = function(entries, force, onret) {

  return fileHandleForce('copy', entries, force, onret);

}


function fileHandle(op, entries, onret) {
  var body = '';
  for (var i in entries) {
    body += entries[i].toStr(op);
  }

  var uri = conf.RS_HOST + '/batch';
  var digest = util.generateAccessToken(uri, body);
  return rpc.post(uri, body, digest, onret);
}

function fileHandleForce(op, entries, force, onret) {
  var body = '';
  for (var i in entries) {
    body += entries[i].toStr(op, force);
  }

  console.log(body);
  var uri = conf.RS_HOST + '/batch';
  var digest = util.generateAccessToken(uri, body);
  return rpc.post(uri, body, digest, onret);
}

function getEncodedEntryUri(bucket, key) {
  return util.urlsafeBase64Encode(bucket + (key ? ':' + key : ''));
}
