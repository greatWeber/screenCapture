# screenCapture
网页截图

## install
> 安装很简单，可以用npm 或者浏览器引入[screenCapture.js](https://raw.githubusercontent.com/greatWeber/screenCapture/master/dist/screenCapture.js)。
```js

npm i web_screencapture
// 或者
npm install web_screencapture -i

```

## use
```js
 
import ScreenCapture from 'web_screencapture';

let sc = new ScreenCapture({
    copyType: 'all'
});
sc.init();


```
> 键盘按下`ctrl+b`开始截图；`ctrl+m`全屏截图；`esc`退出截图

## options
> 初始化构建函数的参数如下：
- copyType: 截图后的行为：all : 弹出弹窗选择；download: 直接下载截图；_blank: 新窗口打开截图
- keyCode: 键盘触发截图的keyCode,默认66(b)
- fkeyCode: 键盘触发全屏截图的keyCode,默认77(m)

## screen capture

![开始截图](https://raw.githubusercontent.com/greatWeber/screenCapture/master/readmeImgs/1.png)

![截图完成](https://raw.githubusercontent.com/greatWeber/screenCapture/master/readmeImgs/2.png)

