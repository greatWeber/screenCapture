# screenCapture
网页截图

## install
> 安装很简单，可以用npm 或者浏览器引入[screenCapture.js]()。
```js

npm i web_screencapture
// 或者
npm install web_screencapture -i
// 或者

```

## use
```js
 
import ScreenCapture from 'web_screencapture';

let sc = new ScreenCapture({
    copyType: 'all'
});
sc.init();

```

## options
> 初始化构建函数的参数如下：
- copyType: 截图后的行为：all : 弹出弹窗选择；download: 直接下载截图；_blank: 新窗口打开截图

