# React Native Qiniu SDK

纯JavaScript实现的Qiniu SDK,

**非官方SDK**

##安装
npm i react-native-qiniu

##使用方法

```javascript
var qiniu = require('react-native-qiniu');
qiniu.conf.ACCESS_KEY = <AK>
qiniu.conf.SECRET_KEY = <SK>

//upload file to Qiniu
var putPolicy = new qiniu.auth.PutPolicy2(
    {scope: "<Bucket>:<Key>"}
);
var uptoken = putPolicy.token();
qiniu.rpc.uploadImage(<LOCAL_URL>, <KEY>, uptoken, function (resp) {
   console.log(JSON.stringify(resp));
});

//download private file
var getPolicy = new qiniu.auth.GetPolicy();
let url = getPolicy.makeRequest('http://7xp19y.com2.z0.glb.qiniucdn.com/5.jpg');
//fetch from this url

//image sync operation
var imgInfo = new qiniu.imgOps.ImageView(1,100,200);
let url = imgInfo.makeRequest('http://7xoaqn.com2.z0.glb.qiniucdn.com/16704/6806d20a359f43c88f1cb3c59980e5ef');
//fetch from this url

//image info 
var self = this;
var imgInfo = new qiniu.imgOps.ImageInfo();
let url = imgInfo.makeRequest('http://7xoaqn.com2.z0.glb.qiniucdn.com/16704/6806d20a359f43c88f1cb3c59980e5ef');
fetch(url).then((response) => {
      return response.text();
    }).then((responseText) => {
      self.setState({info: responseText});
    }).catch((error) => {
      console.warn(error);
    });

//resource operation
//stat info
var self = this;
qiniu.rs.Client.stat(<BUCKET>, <KEY)
        .then((response) => response.text())
        .then((responseText) => {
          self.setState({info: responseText});
        })
        .catch((error) => {
          console.warn(error);
        });
```

##进行中

- [x] 上传文件
- [x] 私有库中文件下载功能
- [x] Image Ops
- [x] 资源管理
- [ ] 上传进度支持
