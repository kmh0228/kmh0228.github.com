# 关于window.location 的一些操作

> import {getUrl,openUrl} from '@s5ming/url'
>

## getUrl
获取页面地址的信息
```
    let hrefInfo = getUrl()
    // hrefInfo.loc    页面的地址
    // hrefInfo.info    页面地址栏?后面的信息,json格式
```

## openUrl
打开地址
```
    openUrl(url,info)
    // @params url    页面的地址
    // @params info   页面地址栏?后面的信息,json格式
```