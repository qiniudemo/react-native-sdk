/**
 * Created by guguyanhua on 16/4/12.
 */
import auth from "../core/auth.js";

var case1 = function(){
  auth.generateAccessToken("http://www.baidu.com");
}


case1();
