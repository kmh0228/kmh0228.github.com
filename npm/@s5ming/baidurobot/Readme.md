# baidu云 的一些相关工具
因为此插件需要请求百度ai上的接口,浏览器无法跨域,所以此插件只能在node服务上运行

# 引入
> var baiduRobot = require('@s5ming/baiduRobot');
>

# 使用说明
### baiduRobot.baiduocr
图片识字方法
```
var ocr = baiduRobot.baiduocr
ocr({
    id:'',                  // API Key
    secret:'',              // secret key
    image:'',               //图片,需要 urlencoded,
    url:'',                 //图片地址,与上面的图片只存在一个就可以了
    success:null            //成功的回调函数,参数参照baidu文字识别文档
});
```
[ocr apiKey和secretKey的申请地址](https://console.bce.baidu.com/ai/?_=1559635304389#/ai/ocr/overview/index)

### baiduRobot.baiduunit
对话工具
```
var unit = baiduRobot.baiduunit
ocr({
    id:'',                  // API Key
    secret:'',              // secret key
   'log_id': 'UNITTEST_10000',  //随便填写的一个客户端唯一识别码
    'service_id': 'S18930',     //机器人编码,可根据下面地址生成机器人
    'say':'这里是说话的地方',   //发送给机器人的内容
    'user_id': '88888',         //用户代码,随便填写一个
    success:null            //成功的回调函数,参数参照baidu unit文档,或自己打印出来看下
});
```

[unit apiKey和secretKey的申请地址](https://console.bce.baidu.com/ai/?_=1559635304389#/ai/unit/overview/index)
[机器人生成的地址](https://ai.baidu.com/unit/v2#/myrobot)
