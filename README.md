# React Native Qiniu SDK

纯JavaScript实现的Qiniu SDK,

##安装
npm i react-native-qiniu  --save

##使用方法

```javascript
import Qiniu,{Auth,ImgOps,Conf,Rs,Rpc} from 'react-native-qiniu';
Conf.ACCESS_KEY = <AK>
Conf.SECRET_KEY = <SK>

//upload file to Qiniu
var putPolicy = new Auth.PutPolicy2(
    {scope: "<Bucket>:<Key>"}
);
var uptoken = putPolicy.token();
let formInput = {
    key : "<Key>",
    // formInput对象如何配置请参考七牛官方文档“直传文件”一节
}
Rpc.uploadFile(<LOCAL_URL>, uptoken, formInput);

//download private file
var getPolicy = new Auth.GetPolicy();
let url = getPolicy.makeRequest('http://7xp19y.com2.z0.glb.qiniucdn.com/5.jpg');
//fetch from this url

//image sync operation
var imgInfo = new ImgOps.ImageView(1,100,200);
let url = imgInfo.makeRequest('http://7xoaqn.com2.z0.glb.qiniucdn.com/16704/6806d20a359f43c88f1cb3c59980e5ef');
//fetch from this url

//image info 
var self = this;
var imgInfo = new ImgOps.ImageInfo();
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
Rs.stat(<BUCKET>, <KEY)
        .then((response) => response.text())
        .then((responseText) => {
          self.setState({info: responseText});
        })
        .catch((error) => {
          console.warn(error);
        });
```

##进行中

- [ ] 上传进度支持

##Release Note
###0.1.0
- [x] 上传文件
- [x] 私有库中文件下载功能
- [x] Image Ops
- [x] 资源管理

###0.1.1
- 重构 upload 方法 (CaveyChan)

###0.2.0
- es6 style

##Contributor
- CaveyChan
- laukey


##相关文章

[React Native 文件上传 和 react-native-qiniu](https://medium.com/@bugu1986/react-native-%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0-%E5%92%8C-react-native-qiniu-4b3f7335090e#.ooux7ospa)
