(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
//  import html2canvas from '../../node_modules/html2canvas/dist/types/index';
//  import html2canvas from 'html2canvas';
var html2canvas = window.html2canvas;
console.log(html2canvas);

var Canvas = function () {
    function Canvas(params) {
        _classCallCheck(this, Canvas);

        this.params = params;
    }

    _createClass(Canvas, [{
        key: "capture",
        value: function capture(size) {
            var _this = this;

            /**
             * todo:
             * 1. 设置宽高，特别是高度最小是100vh
             * 2. 用html2canvas获取页面截图
             * 3. 通过宽高及偏移切边
             * 4. 再转成图片
             */
            this.size = size;
            // todo1:
            var height = document.body.clientHeight;
            if (height < this.params.minHeight) {
                document.body.style.height = '100vh';
            }
            // todo2:
            html2canvas(document.body, {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            }).then(function (canvas) {
                _this.canvas = canvas;
                // document.body.appendChild(canvas);
                var imgData = _this.canvas.toDataURL('image/jpeg', 0.5);
                // console.log(imgData);
                // todo3:
                _this.drawImage(imgData);
            });
        }
        /**
         * 切片
         * @param img
         */

    }, {
        key: "drawImage",
        value: function drawImage(img) {
            var _this2 = this;

            console.log('size', this.size);
            var ctx = this.canvas.getContext('2d');
            var size = this.size;
            var image = new Image();
            image.src = img;
            image.onload = function () {
                _this2.canvas.width = size.width;
                _this2.canvas.height = size.height;
                ctx.drawImage(image, size.offsetX, size.offsetY, size.width, size.height, 0, 0, size.width, size.height);
                _this2.copySwitch();
            };
        }
        /**
         * 保存的方式
         */

    }, {
        key: "copySwitch",
        value: function copySwitch() {
            console.log(this.params.copyType);
            switch (this.params.copyType) {
                case 'all':
                    this.popupCopy();
                    break;
                case '_blank':
                    this.blankCopy();
                    break;
                case 'download':
                    this.downloadCopy();
                    break;
            }
        }
        /**
         * 新窗口打开
         */

    }, {
        key: "blankCopy",
        value: function blankCopy() {
            var windowImage = new Image();
            windowImage.src = this.canvas.toDataURL('image/jpeg', 0.5);
            var newWindow = window.open('', '_blank'); //直接新窗口打开
            newWindow.document.write(windowImage.outerHTML);
        }
        /**
         * 直接下载
         */

    }, {
        key: "downloadCopy",
        value: function downloadCopy() {
            var downloadTarget = this.params.UITarget.downloadTarget;
            downloadTarget.href = this.canvas.toDataURL('image/jpeg', 0.5);
            downloadTarget.download = new Date().getTime() + '.jpg';
            downloadTarget.click();
        }
        /**
         * 弹窗下载
         */

    }, {
        key: "popupCopy",
        value: function popupCopy() {
            this.params.UITarget.imgTarget.src = this.canvas.toDataURL('image/jpeg', 0.5);
            this.params.UI.showPopup();
        }
    }]);

    return Canvas;
}();

exports.default = Canvas;

},{}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");

var Painting = function () {
    function Painting(params) {
        _classCallCheck(this, Painting);

        this.startX = 0;
        this.startY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.rangeX = 0;
        this.rangeY = 0;
        this.target = params.target;
        this.dragingCb = params.dragingCb;
        this.dragEndCb = params.dragEndCb;
        this.drawingCb = params.drawingCb;
        this.drawEndCb = params.drawEndCb;
    }
    /**
     * 初始化拖拽事件
     */


    _createClass(Painting, [{
        key: "initDrag",
        value: function initDrag() {
            this.onDragStart();
        }
        /**
         * 获取绘画后的几何信息，用于边界判断
         * @param size 几何信息
         */

    }, {
        key: "setScreenSize",
        value: function setScreenSize(size) {
            this.size = Object.assign({
                width: 0,
                height: 0,
                clientW: document.body.clientWidth,
                clientH: document.body.clientHeight,
                offsetX: 0,
                offsetY: 0
            }, size);
            this.lastX = this.size.offsetX;
            this.lastY = this.size.offsetY;
            console.log('size', this.size);
        }
    }, {
        key: "setCursor",
        value: function setCursor(attr) {
            this.target.style.cursor = attr;
        }
        /**
         * 拖拽 start
         */

    }, {
        key: "onDragStart",
        value: function onDragStart() {
            var _this = this;
            this._dragStartHandler = this.dragStartHandler.bind(this);
            this.target.addEventListener('mousedown', this._dragStartHandler, false);
        }
    }, {
        key: "dragStartHandler",
        value: function dragStartHandler() {
            console.log(arguments);
            var e = arguments[0];
            e.stopPropagation();
            this.setCursor('move');
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.onDraging();
            this.onDragEnd();
            console.log(this.lastX, this.lastY);
        }
        /**
         * 拖拽中
         * @param dragingCb
         */

    }, {
        key: "onDraging",
        value: function onDraging() {
            var _this = this;
            this.setCursor('move');
            this._dragingHandler = this.dragingHandler.bind(this);
            this.target.addEventListener('mousemove', this._dragingHandler, false);
        }
    }, {
        key: "dragingHandler",
        value: function dragingHandler() {
            var e = arguments[0];
            e.stopPropagation();
            var throttleCb = utils_1.default.throttle(this.dragingCb, 10);
            this.rangeX = e.clientX - this.startX + this.lastX;
            this.rangeY = e.clientY - this.startY + this.lastY;
            // console.log(this.rangeX+this.size.width,this.rangeY+this.size.height)
            //  边界判断
            if (this.rangeX < 0) {
                this.rangeX = 0;
            }
            if (this.rangeX + this.size.width > this.size.clientW + document.body.offsetLeft) {
                this.rangeX = this.size.clientW + document.body.offsetLeft - this.size.width;
            }
            if (this.rangeY < 0) {
                this.rangeY = 0;
            }
            if (this.rangeY + this.size.height > this.size.clientH + document.body.offsetTop) {
                this.rangeY = this.size.clientH + document.body.offsetTop - this.size.height;
            }
            throttleCb(this.rangeX, this.rangeY);
        }
        /**
         * 拖拽结束
         */

    }, {
        key: "onDragEnd",
        value: function onDragEnd() {
            this._dragEndHandler = this.dragEndHandler.bind(this);
            this.target.addEventListener('mouseup', this._dragEndHandler, false);
            this.target.addEventListener('mouseleave', this._dragEndHandler, false);
        }
    }, {
        key: "dragEndHandler",
        value: function dragEndHandler() {
            var e = arguments[0];
            this.lastX = this.rangeX;
            this.lastY = this.rangeY;
            this.target.removeEventListener('mousemove', this._dragingHandler, false);
            this.target.removeEventListener('mouseup', this._dragEndHandler, false);
            this.dragEndCb(this.rangeX, this.rangeY);
        }
        // ========================================
        /**
         * 初始化绘画事件
         */

    }, {
        key: "initDraw",
        value: function initDraw() {
            this.onDrawStart();
        }
        /**
         * 开始绘画
         */

    }, {
        key: "onDrawStart",
        value: function onDrawStart() {
            this.setCursor('crosshair');
            this._drawStartHandler = this.drawStartHandler.bind(this);
            this.target.addEventListener('mousedown', this._drawStartHandler, false);
        }
    }, {
        key: "drawStartHandler",
        value: function drawStartHandler() {
            var e = arguments[0];
            e.stopPropagation();
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.onDrawing();
            this.onDrawEnd();
        }
        /**
         * 绘画中
         */

    }, {
        key: "onDrawing",
        value: function onDrawing() {
            this._drawingHandler = this.drawingHandler.bind(this);
            this.target.addEventListener('mousemove', this._drawingHandler, false);
        }
    }, {
        key: "drawingHandler",
        value: function drawingHandler() {
            var e = arguments[0];
            e.stopPropagation();
            this.rangeX = e.clientX - this.startX;
            this.rangeY = e.clientY - this.startY;
            // debugger;
            var throttleCb = utils_1.default.throttle(this.drawingCb, 10);
            throttleCb(this.rangeX, this.rangeY, this.startX, this.startY);
        }
        /**
         * 绘画结束
         */

    }, {
        key: "onDrawEnd",
        value: function onDrawEnd() {
            this._drawEndHandler = this.drawEndHandler.bind(this);
            this.target.addEventListener('mouseup', this._drawEndHandler, false);
        }
    }, {
        key: "drawEndHandler",
        value: function drawEndHandler() {
            this.target.removeEventListener('mousemove', this._drawingHandler, false);
            this.target.removeEventListener('mouseup', this._drawEndHandler, false);
            this.drawEndCb(this.startX, this.startY);
        }
    }]);

    return Painting;
}();

exports.default = Painting;

},{"./utils":6}],3:[function(require,module,exports){
"use strict";
// UI集合

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");

var UI = function () {
    function UI() {
        _classCallCheck(this, UI);
    }
    /**
     * 初始化UI界面
     */


    _createClass(UI, [{
        key: "initUI",
        value: function initUI(uuid) {
            this.uuid = uuid;
            this.createWrapper();
            this.createPopup();
            this.createDownload();
            this.createNumberView();
        }
        /**
         * 创建蒙层
         */

    }, {
        key: "createWrapper",
        value: function createWrapper() {
            this.maskTarget = document.querySelector(".screenCapture-" + this.uuid);
            if (this.maskTarget) return;
            this.maskTarget = document.createElement('div');
            this.maskTarget.className = "screenCapture-wrapper screenCapture-" + this.uuid;
            document.body.appendChild(this.maskTarget);
        }
        /**
         * 创建popup弹窗
         */

    }, {
        key: "createPopup",
        value: function createPopup() {
            this.popupTarget = document.querySelector('.sccreenCapture-hide-img');
            if (this.popupTarget) return;
            this.popupTarget = document.createElement('div');
            this.popupTarget.className = 'screenCapture-popup flex align-center flex-center';
            // utils.Class(this.popupTarget,'add','');
            this.popupTarget.innerHTML = "\n        <div class=\"popup-wrapper \">\n            <div class=\"popup-header flex space-between\">\n\n                <h2 class=\"popup-title\">\u56FE\u7247\u622A\u56FE</h2>\n                <img class=\"popup-close\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAwUlEQVRIid3VwQ3CMAyF4X+EjsAIGaGjdAPYgG4AG8Bo3YBuEC6JVCE7sZNwgCf5UMnOF7VKA/+aE3AFQsPsBJzTGmoC8AJiqsUBmGe3Q5MH+gRiehazC0gNkoCY1hKzKIgGaUD1DVihZsAKdQMWaAhggYYAHqgLyFkLwHMEUPrIuW7fBnI9RgPan8EF1c5B6IWsB60Z8p7kErRqyOYALJB48UnNJaAGichyaNiNgAbdS80zcKFyTyuZ0sbmhtkfyRtSZ9VFfwHZEgAAAABJRU5ErkJggg==\" alt=\"\">\n            </div>\n            <img src=\"\" alt=\"\u622A\u56FE\" class=\"popup-content-img\">\n            <div class=\"popup-footer flex space-between align-center\">\n                <p class=\"popup-tip\">tips: \u53F3\u51FB\u56FE\u7247\u9009\u62E9\u590D\u5236\u56FE\u50CF\uFF0C\u53EF\u4EE5\u62F7\u8D1D\u5230\u5FAE\u4FE1\u548CQQ\u8F6F\u4EF6\u4E2D ^.^</p>\n                <button class=\"popup-download\">download</button>\n            </div>\n        </div>\n        ";
            document.body.appendChild(this.popupTarget);
        }
        /**
         * 创建下载需要用到的标签
         */

    }, {
        key: "createDownload",
        value: function createDownload() {
            this.downloadTarget = document.querySelector('.screenCapture-download-href');
            if (this.downloadTarget) return;
            this.downloadTarget = document.createElement('a');
            utils_1.default.Class(this.downloadTarget, 'add', 'screenCapture-download-href');
            document.body.appendChild(this.downloadTarget);
        }
        /**
         * 创建宽高数据显示区
         */

    }, {
        key: "createNumberView",
        value: function createNumberView() {
            this.numberTarget = this.maskTarget.querySelector('.screenCapture-number-view');
            if (this.numberTarget) return;
            this.numberTarget = document.createElement('div');
            utils_1.default.Class(this.numberTarget, 'add', 'screenCapture-number-view');
            this.functionView = document.createElement('div');
            utils_1.default.Class(this.functionView, 'add', 'screenCapture-selectbox');
            this.functionView.innerHTML = "\n                <p class=\"screenCapture-w-h i-b v-m\">\n                    <span class=\"screenCapture-w\">0</span> x \n                    <span class=\"screenCapture-h\">0</span>\n                </p>\n                <p class=\"screenCapture-function i-b v-m\">\n                    <span class=\"function-item function-doodling v-m\">\u6D82\u9E26</span>\n                    <img alt=\"\u53D6\u6D88\" class=\"function-close v-m\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAnUlEQVRIie3UMQ6FMAgG4C509gJwdbmRbvRNepO6vTybYMHi8BL/tZAvJNCU3vxNtilNjwOFYPkgzJZ6QWBr7QkolGuhXHvNgsDWWrXxqrmtEwQ2IxZoGOhBYYAGFcpbKHABxQJfiPLeThQLKJO4VtYDtBMNQ9oWWe/oNqC9uyHrHQxBv829NT1BCKvr9xYEtt6BILAbuJPHgTehOQCS9eOOOnME1QAAAABJRU5ErkJggg==\" >\n                    <img alt=\"\u5B8C\u6210\" class=\"function-success v-m\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAuElEQVRIie3QwQ3CMAwF0IyQC1LsUy5U9o1RugEdgREYhQ1gA7pBR6HXWJXMBUFBBAIk4tD+87eebWPmTCY4VDUIHZ1QUwRwQg0KKworCLVFARTW7JdMALDqrRNaW/W2CGCMMSDUXgrdp1Dyi1BoNyomQyC8uc1Rj0NVR8tWvR1doyjcOSX/CrhfjPqFLFcpiz1edIoNfg2kQj8D76BsQAyCwPusQATKDzyHCgBXKNAWAh+KAXP+kjOxSufHfawyfwAAAABJRU5ErkJggg==\" >\n                </p>\n        ";
            this.numberTarget.appendChild(this.functionView);
            this.maskTarget.appendChild(this.numberTarget);
            this.setUITarget();
        }
        /**
         * 设置UITarget
         */

    }, {
        key: "setUITarget",
        value: function setUITarget() {
            this.UITarget = {
                maskTarget: this.maskTarget,
                selectTarget: this.selectTarget,
                numberTarget: this.numberTarget,
                functionView: this.functionView,
                captureWidth: this.numberTarget.querySelector('.screenCapture-w'),
                captureHeight: this.numberTarget.querySelector('.screenCapture-h'),
                captureSure: this.numberTarget.querySelector('.function-success'),
                captureClose: this.numberTarget.querySelector('.function-close'),
                captureDoodling: this.numberTarget.querySelector('.function-doodling'),
                imgTarget: this.popupTarget.querySelector('.popup-content-img'),
                downloadTarget: this.downloadTarget,
                popupCloseTarget: this.popupTarget.querySelector('.popup-close'),
                popupDownloadTarget: this.popupTarget.querySelector('.popup-download')
            };
        }
        /**
         * 显示蒙层
         */

    }, {
        key: "showMask",
        value: function showMask() {
            utils_1.default.Class(this.maskTarget, 'add', 'screenCapture-wrapper-show');
        }
        /**
         * 隐藏蒙层
         */

    }, {
        key: "hideMask",
        value: function hideMask() {
            utils_1.default.Class(this.maskTarget, 'del', 'screenCapture-wrapper-show');
        }
        /**
         * 显示信息功能区
         * @param width
         * @param height
         * @param x
         * @param y
         *
         */

    }, {
        key: "showFunctionView",
        value: function showFunctionView(width, height, x, y) {
            /**
             * todo:
             * 1. 给 numberTarget设置宽高和位置
             * 2. 显示 functionView
             * 3. 判断functionView的位置有没有超出
             * 4. 显示宽高参数
             */
            if (width <= 0 || height <= 0) return; //目前只支持左->右，上->下设置位置和宽高
            //todo1:
            this.numberTarget.style.cssText = "\n            width:" + width + "px;\n            height: " + height + "px;\n            transform: translate(" + x + "px," + y + "px);\n        ";
            // todo2:
            utils_1.default.Class(this.functionView, 'add', 'screenCapture-selectbox-show');
            // todo3:
            var offsetWidth = this.functionView.offsetWidth;
            var offsetHeight = this.functionView.offsetHeight;
            if (offsetWidth > x) {
                this.functionView.style.left = '0px';
            } else {
                this.functionView.style.left = 'none';
            }
            console.log(offsetHeight + y + height, this.maskTarget.offsetHeight);
            if (offsetHeight + y + height >= this.maskTarget.offsetHeight) {
                this.functionView.style.top = '0px';
            } else {
                this.functionView.style.top = height + 'px';
            }
            // todo4:
            this.UITarget.captureWidth.innerText = width;
            this.UITarget.captureHeight.innerText = height;
        }
        /**
         * 设置几何信息(位置和大小)
         * @param width
         * @param height
         * @param x
         * @param y
         */

    }, {
        key: "setViewLayout",
        value: function setViewLayout(width, height, x, y) {
            if (width <= 0 || height <= 0) return; //目前只支持左->右，上->下设置位置和宽高
            this.numberTarget.style.cssText = "\n            width:" + width + "px;\n            height: " + height + "px;\n            transform: translate(" + x + "px," + y + "px);\n        ";
        }
        /**
         * 隐藏选择框
         */

    }, {
        key: "hideViewLayout",
        value: function hideViewLayout() {
            this.numberTarget.style.cssText = "\n            width:0px;\n            height: 0px;\n            transform: translate(-100000px,-100000px); \n        ";
            utils_1.default.Class(this.functionView, 'del', 'screenCapture-selectbox-show');
        }
        /**
         * 显示弹窗
         */

    }, {
        key: "showPopup",
        value: function showPopup() {
            var _this = this;

            this.popupTarget.style.display = 'flex';
            setTimeout(function () {
                utils_1.default.Class(_this.popupTarget, 'add', 'screenCapture-popup-show');
            }, 50);
        }
        /**
         * 隐藏弹窗
         */

    }, {
        key: "hidePopup",
        value: function hidePopup() {
            var _this2 = this;

            utils_1.default.Class(this.popupTarget, 'del', 'screenCapture-popup-show');
            setTimeout(function () {
                _this2.popupTarget.style.display = 'none';
            }, 500);
        }
    }]);

    return UI;
}();

exports.default = UI;

},{"./utils":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var screenCapture_1 = require("./screenCapture");
var UI_1 = require("./UI");
var Painting_1 = require("./Painting");
var Canvas_1 = require("./Canvas");
window.UI = UI_1.default;
window.Painting = Painting_1.default;
window.Canvas = Canvas_1.default;
window.ScreenCapture = screenCapture_1.default;
// export default ScreenCapture;
// export default UI;

},{"./Canvas":1,"./Painting":2,"./UI":3,"./screenCapture":5}],5:[function(require,module,exports){
"use strict";
/**
 * 核心类 -- 连接UI.js和Canvas.js
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var UI_1 = require("./UI");
var Canvas_1 = require("./Canvas");
var Painting_1 = require("./Painting");
var utils_1 = require("./utils");

var ScreenCapture = function () {
    function ScreenCapture(options) {
        _classCallCheck(this, ScreenCapture);

        this.width = 0;
        this.height = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.options = Object.assign({
            copyType: 'all',
            keyCode: 66,
            fkeyCode: 77
        }, options);
    }
    /**
     * 公开的init方法
     */


    _createClass(ScreenCapture, [{
        key: "init",
        value: function init() {
            this.initUI();
            this.initDrag();
            this.initDraw();
            this.initCanvas();
            this.initEvents();
        }
        /**
         * 初始化UI类
         */

    }, {
        key: "initUI",
        value: function initUI() {
            this.UIInstance = new UI_1.default();
            this.UIInstance.initUI(utils_1.default.uuid());
        }
        /**
         * 初始化拖拽实例
         */

    }, {
        key: "initDrag",
        value: function initDrag() {
            this.dragingCb = this.dragingCb.bind(this);
            this.dragEndCb = this.dragEndCb.bind(this);
            this.DragInstance = new Painting_1.default({
                target: this.UIInstance.UITarget.numberTarget,
                dragingCb: this.dragingCb,
                dragEndCb: this.dragEndCb
            });
            this.DragInstance.initDrag();
        }
        /**
         * 拖拽中的回调
         */

    }, {
        key: "dragingCb",
        value: function dragingCb(x, y) {
            this.UIInstance.setViewLayout(this.width, this.height, x, y);
        }
        /**
         * 拖拽结束后的回调
         */

    }, {
        key: "dragEndCb",
        value: function dragEndCb(x, y) {
            this.offsetX = x;
            this.offsetY = y;
            this.UIInstance.showFunctionView(this.width, this.height, x, y);
        }
        /**
         * 初始化绘画类
         */

    }, {
        key: "initDraw",
        value: function initDraw() {
            this.drawingCb = this.drawingCb.bind(this);
            this.drawEndCb = this.drawEndCb.bind(this);
            this.DrawInstance = new Painting_1.default({
                target: this.UIInstance.UITarget.maskTarget,
                drawingCb: this.drawingCb,
                drawEndCb: this.drawEndCb
            });
            this.DrawInstance.initDraw();
        }
        /**
         * 绘画中的回调
         */

    }, {
        key: "drawingCb",
        value: function drawingCb(w, h, x, y) {
            this.width = w;
            this.height = h;
            this.UIInstance.setViewLayout(w, h, x, y);
        }
        /**
         * 绘画结束后的回调
         */

    }, {
        key: "drawEndCb",
        value: function drawEndCb(x, y) {
            this.offsetX = x;
            this.offsetY = y;
            this.UIInstance.showFunctionView(this.width, this.height, x, y);
            this.DragInstance.setScreenSize({
                width: this.width,
                height: this.height,
                clientW: this.UIInstance.UITarget.maskTarget.clientWidth,
                clientH: this.UIInstance.UITarget.maskTarget.clientHeight,
                offsetX: x,
                offsetY: y
            });
        }
        /**
         * 初始化canvas
         */

    }, {
        key: "initCanvas",
        value: function initCanvas() {
            this.CanvasInstance = new Canvas_1.default({
                minHeight: this.UIInstance.UITarget.maskTarget.clientHeight,
                copyType: this.options.copyType,
                UITarget: this.UIInstance.UITarget,
                UI: this.UIInstance
            });
        }
        /**
         * 初始化事件
         */

    }, {
        key: "initEvents",
        value: function initEvents() {
            this.keydownHandler();
            this.captureSureHandler();
            this.captureCloseHandler();
            this.stopMouseDown();
            this.closePopupHandler();
            this.popupDownloadHandler();
        }
        /**
         * 监听键盘事件
         */

    }, {
        key: "keydownHandler",
        value: function keydownHandler() {
            var _this = this;

            document.addEventListener('keydown', function (e) {
                console.log(e);
                var ctrl = e.ctrlKey || e.metaKey;
                var keyCode = e.keyCode || e.which || e.charCode;
                _this.normalScreenCapture(ctrl, keyCode, e);
                _this.fullScreenCapture(ctrl, keyCode, e);
                _this.stopScreenCapture(keyCode, e);
            }, false);
        }
        /**
         * 普通的截图
         * @param ctrl
         * @param keyCode
         * @param e
         */

    }, {
        key: "normalScreenCapture",
        value: function normalScreenCapture(ctrl, keyCode, e) {
            // ctrl+b
            if (ctrl && keyCode == this.options.keyCode) {
                // 显示蒙层
                e.preventDefault();
                this.UIInstance.showMask();
            }
        }
        /**
         * 全屏截图
         * @param ctrl
         * @param keyCode
         * @param e
         */

    }, {
        key: "fullScreenCapture",
        value: function fullScreenCapture(ctrl, keyCode, e) {
            // ctrl+n
            if (ctrl && keyCode == this.options.fkeyCode) {
                // 显示蒙层
                e.preventDefault();
                this.CanvasInstance.capture({
                    width: document.body.clientWidth,
                    height: document.body.clientHeight,
                    offsetX: 0,
                    offsetY: 0
                });
            }
        }
        /**
         * 停止截图
         * @param keyCode
         * @param e
         */

    }, {
        key: "stopScreenCapture",
        value: function stopScreenCapture(keyCode, e) {
            if (keyCode == 27) {
                e.stopPropagation();
                this.UIInstance.hidePopup();
                this.UIInstance.hideMask();
                this.UIInstance.hideViewLayout();
            }
        }
        /**
         * 点击确认截图
         */

    }, {
        key: "captureSureHandler",
        value: function captureSureHandler() {
            var _this2 = this;

            this.UIInstance.UITarget.captureSure.addEventListener('click', function (e) {
                _this2.UIInstance.hideMask();
                _this2.UIInstance.hideViewLayout();
                _this2.CanvasInstance.capture({
                    width: _this2.width,
                    height: _this2.height,
                    offsetX: _this2.offsetX,
                    offsetY: _this2.offsetY
                });
            }, false);
        }
        /**
         * 取消截图
         */

    }, {
        key: "captureCloseHandler",
        value: function captureCloseHandler() {
            var _this3 = this;

            this.UIInstance.UITarget.captureClose.addEventListener('click', function (e) {
                e.stopPropagation();
                _this3.UIInstance.hideMask();
                _this3.UIInstance.hideViewLayout();
            }, false);
        }
        /**
         * 这里添加一个mousedown，是为了阻止触发父级的mousedown事件
         */

    }, {
        key: "stopMouseDown",
        value: function stopMouseDown() {
            this.UIInstance.UITarget.functionView.addEventListener('mousedown', function (e) {
                e.stopPropagation();
                return false;
            }, false);
        }
        /**
         * 点击关闭弹窗
         */

    }, {
        key: "closePopupHandler",
        value: function closePopupHandler() {
            var _this4 = this;

            this.UIInstance.UITarget.popupCloseTarget.addEventListener('click', function (e) {
                _this4.UIInstance.hidePopup();
                _this4.UIInstance.hideMask();
                _this4.UIInstance.hideViewLayout();
            });
        }
        /**
         * 弹窗点击下载
         */

    }, {
        key: "popupDownloadHandler",
        value: function popupDownloadHandler() {
            var _this5 = this;

            this.UIInstance.UITarget.popupDownloadTarget.addEventListener('click', function (e) {
                _this5.CanvasInstance.downloadCopy();
                _this5.UIInstance.hidePopup();
                _this5.UIInstance.hideMask();
                _this5.UIInstance.hideViewLayout();
            });
        }
    }]);

    return ScreenCapture;
}();

exports.default = ScreenCapture;

},{"./Canvas":1,"./Painting":2,"./UI":3,"./utils":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    /**
     * css class 操作
     * @param target 对象
     * @param op 添加(add)， 删除(del)， 包含(has)， 等于(eq), 切换(tog)， 替换(rep)
     * @param className
     * @param oldClass
     */
    Class: function Class(target) {
        var op = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'add';
        var className = arguments[2];
        var oldClass = arguments[3];

        var result = void 0;
        switch (op) {
            case 'add':
                target.classList.add(className);
                break;
            case 'del':
                target.classList.remove(className);
                break;
            case 'has':
                result = target.classList.contains(className);
                break;
            case 'eq':
                target.className = className;
                break;
            case 'tog':
                //ie10以下不支持
                target.classList.toggle(className);
                break;
            case 'rep':
                //safari不支持
                target.classList.replace(oldClass, className);
                break;
        }
    },

    /**
     * 节流
     * @param fn
     * @param time
     */
    throttle: function throttle(fn, time) {
        var bool = true;
        return function () {
            if (!bool) return;
            bool = !bool;
            fn.apply(this, arguments);
            setTimeout(function () {
                bool = !bool;
            }, time);
        };
    },

    uuid: uuid()
};
function uuid() {
    var id = 1;
    return function () {
        return id++;
    };
}

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvQ2FudmFzLnRzIiwic3JjL3RzL1BhaW50aW5nLnRzIiwic3JjL3RzL1VJLnRzIiwic3JjL3RzL2luZGV4LnRzIiwic3JjL3RzL3NjcmVlbkNhcHR1cmUudHMiLCJzcmMvdHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FDaUJBO0FBQ0E7QUFDQSxJQUFNLGNBQWUsT0FBZSxXQUFwQztBQUNDLFFBQVEsR0FBUixDQUFZLFdBQVo7O0lBRU0sTTtBQUlILG9CQUFZLE1BQVosRUFBMEI7QUFBQTs7QUFDdEIsYUFBSyxNQUFMLEdBQWMsTUFBZDtBQUlIOzs7O2dDQUVjLEksRUFBYTtBQUFBOztBQUN4Qjs7Ozs7OztBQU9BLGlCQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0E7QUFDQSxnQkFBSSxTQUFTLFNBQVMsSUFBVCxDQUFjLFlBQTNCO0FBQ0EsZ0JBQUcsU0FBTyxLQUFLLE1BQUwsQ0FBWSxTQUF0QixFQUFnQztBQUM1Qix5QkFBUyxJQUFULENBQWMsS0FBZCxDQUFvQixNQUFwQixHQUE2QixPQUE3QjtBQUNIO0FBQ0Q7QUFDQSx3QkFBWSxTQUFTLElBQXJCLEVBQTBCO0FBQ3RCLHVCQUFPLFNBQVMsSUFBVCxDQUFjLFdBREM7QUFFdEIsd0JBQVEsU0FBUyxJQUFULENBQWM7QUFGQSxhQUExQixFQUdHLElBSEgsQ0FHUSxrQkFBUTtBQUNaLHNCQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0E7QUFDQSxvQkFBSSxVQUFVLE1BQUssTUFBTCxDQUFZLFNBQVosQ0FBc0IsWUFBdEIsRUFBb0MsR0FBcEMsQ0FBZDtBQUNBO0FBQ0E7QUFDQSxzQkFBSyxTQUFMLENBQWUsT0FBZjtBQUNILGFBVkQ7QUFXSDtBQUVEOzs7Ozs7O2tDQUlrQixHLEVBQVc7QUFBQTs7QUFDekIsb0JBQVEsR0FBUixDQUFZLE1BQVosRUFBbUIsS0FBSyxJQUF4QjtBQUNBLGdC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LFNBQTFCLENBQVQ7QUFDSjtBQUNBLGlCQUFLLElBQUw7QUFDSSx1QkFBTyxTQUFQLEdBQW1CLFNBQW5CO0FBQ0o7QUFDQSxpQkFBSyxLQUFMO0FBQVk7QUFDUix1QkFBTyxTQUFQLENBQWlCLE1BQWpCLENBQXdCLFNBQXhCO0FBQ0o7QUFDQSxpQkFBSyxLQUFMO0FBQVk7QUFDUix1QkFBTyxTQUFQLENBQWlCLE9BQWpCLENBQXlCLFFBQXpCLEVBQWtDLFNBQWxDO0FBQ0o7QUFsQko7QUFvQkgsS0E5QlU7O0FBZ0NYOzs7OztBQUtBLFlBckNXLG9CQXFDRixFQXJDRSxFQXFDWSxJQXJDWixFQXFDd0I7QUFDL0IsWUFBSSxPQUFPLElBQVg7QUFDQSxlQUFPLFlBQUE7QUFDSCxnQkFBRyxDQUFDLElBQUosRUFBVTtBQUNWLG1CQUFPLENBQUMsSUFBUjtBQUNBLGVBQUcsS0FBSCxDQUFTLElBQVQsRUFBYyxTQUFkO0FBQ0EsdUJBQVcsWUFBSTtBQUNYLHVCQUFPLENBQUMsSUFBUjtBQUNILGFBRkQsRUFFRSxJQUZGO0FBR0gsU0FQRDtBQVFILEtBL0NVOztBQWlEWCxVQUFLO0FBakRNLENBQWY7QUFvREEsU0FBUyxJQUFULEdBQWE7QUFDVCxRQUFJLEtBQUssQ0FBVDtBQUNBLFdBQU8sWUFBSTtBQUNQLGVBQU8sSUFBUDtBQUNILEtBRkQ7QUFHSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxyXG4gKiDnu5jliLZjYW52YXNcclxuICog6ZyA6KaB5YCf5YqpaHRtbDJjYW52YXNcclxuICovXHJcbmludGVyZmFjZSBzaXplSW5mbyB7XHJcbiAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgICBvZmZzZXRYOiBudW1iZXIsXHJcbiAgICBvZmZzZXRZOiBudW1iZXIsXHJcbn1cclxuXHJcbmludGVyZmFjZSBwYXJhbXMge1xyXG4gICAgbWluSGVpZ2h0OiBudW1iZXIsXHJcbiAgICBjb3B5VHlwZTogc3RyaW5nLCAvL+ijgeWJquWQjueahOexu+Wei+aTjeS9nDogYWxsPeW8ueeql++8m19ibGFuaz3mlrDnqpflj6PmiZPlvIDvvJtkb3dubG9hZD3nm7TmjqXkuIvovb1cclxuICAgIFVJVGFyZ2V0OiBhbnksXHJcbiAgICBVSTogYW55XHJcbn1cclxuLy8gIGltcG9ydCBodG1sMmNhbnZhcyBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvaHRtbDJjYW52YXMvZGlzdC90eXBlcy9pbmRleCc7XHJcbi8vICBpbXBvcnQgaHRtbDJjYW52YXMgZnJvbSAnaHRtbDJjYW52YXMnO1xyXG5jb25zdCBodG1sMmNhbnZhcyA9ICh3aW5kb3cgYXMgYW55KS5odG1sMmNhbnZhc1xyXG4gY29uc29sZS5sb2coaHRtbDJjYW52YXMpOyAgIFxyXG5cclxuIGNsYXNzIENhbnZhcyB7XHJcbiAgICBwcml2YXRlIHBhcmFtczogcGFyYW1zOyBcclxuICAgIHByaXZhdGUgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHByaXZhdGUgc2l6ZTogc2l6ZUluZm87XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXM6IHBhcmFtcyl7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjYXB0dXJlKHNpemU6c2l6ZUluZm8pOnZvaWR7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogdG9kbzpcclxuICAgICAgICAgKiAxLiDorr7nva7lrr3pq5jvvIznibnliKvmmK/pq5jluqbmnIDlsI/mmK8xMDB2aFxyXG4gICAgICAgICAqIDIuIOeUqGh0bWwyY2FudmFz6I635Y+W6aG16Z2i5oiq5Zu+XHJcbiAgICAgICAgICogMy4g6YCa6L+H5a696auY5Y+K5YGP56e75YiH6L65XHJcbiAgICAgICAgICogNC4g5YaN6L2s5oiQ5Zu+54mHXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgICAgICAvLyB0b2RvMTpcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgaWYoaGVpZ2h0PHRoaXMucGFyYW1zLm1pbkhlaWdodCl7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuaGVpZ2h0ID0gJzEwMHZoJztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdG9kbzI6XHJcbiAgICAgICAgaHRtbDJjYW52YXMoZG9jdW1lbnQuYm9keSx7XHJcbiAgICAgICAgICAgIHdpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0LFxyXG4gICAgICAgIH0pLnRoZW4oY2FudmFzPT57XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgICAgICAvLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XHJcbiAgICAgICAgICAgIGxldCBpbWdEYXRhID0gdGhpcy5jYW52YXMudG9EYXRhVVJMKCdpbWFnZS9qcGVnJywgMC41KTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaW1nRGF0YSk7XHJcbiAgICAgICAgICAgIC8vIHRvZG8zOlxyXG4gICAgICAgICAgICB0aGlzLmRyYXdJbWFnZShpbWdEYXRhKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YiH54mHXHJcbiAgICAgKiBAcGFyYW0gaW1nIFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGRyYXdJbWFnZShpbWc6IHN0cmluZyk6dm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3NpemUnLHRoaXMuc2l6ZSlcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICBsZXQgc2l6ZSA9IHRoaXMuc2l6ZTtcclxuICAgICAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBpbWFnZS5zcmMgPSBpbWc7XHJcbiAgICAgICAgaW1hZ2Uub25sb2FkID0gKCk9PntcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSBzaXplLndpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBzaXplLmhlaWdodDtcclxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWFnZSxzaXplLm9mZnNldFgsc2l6ZS5vZmZzZXRZLHNpemUud2lkdGgsc2l6ZS5oZWlnaHQsMCwwLHNpemUud2lkdGgsc2l6ZS5oZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb3B5U3dpdGNoKCk7IFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5L+d5a2Y55qE5pa55byPXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY29weVN3aXRjaCgpOnZvaWR7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5wYXJhbXMuY29weVR5cGUpO1xyXG4gICAgICAgIHN3aXRjaCh0aGlzLnBhcmFtcy5jb3B5VHlwZSl7XHJcbiAgICAgICAgICAgIGNhc2UgJ2FsbCc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVwQ29weSgpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnX2JsYW5rJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtDb3B5KCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdkb3dubG9hZCc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRvd25sb2FkQ29weSgpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5paw56qX5Y+j5omT5byAXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYmxhbmtDb3B5KCk6dm9pZHtcclxuXHJcbiAgICAgICAgbGV0IHdpbmRvd0ltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgd2luZG93SW1hZ2Uuc3JjID0gdGhpcy5jYW52YXMudG9EYXRhVVJMKCdpbWFnZS9qcGVnJywgMC41KTtcclxuICAgICAgICBjb25zdCBuZXdXaW5kb3cgPSB3aW5kb3cub3BlbignJywnX2JsYW5rJyk7IC8v55u05o6l5paw56qX5Y+j5omT5byAXHJcbiAgICAgICAgbmV3V2luZG93LmRvY3VtZW50LndyaXRlKHdpbmRvd0ltYWdlLm91dGVySFRNTCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnm7TmjqXkuIvovb1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGRvd25sb2FkQ29weSgpOnZvaWR7XHJcbiAgICAgICAgbGV0IGRvd25sb2FkVGFyZ2V0ID0gdGhpcy5wYXJhbXMuVUlUYXJnZXQuZG93bmxvYWRUYXJnZXQ7XHJcbiAgICAgICAgZG93bmxvYWRUYXJnZXQuaHJlZiA9IHRoaXMuY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvanBlZycsIDAuNSk7XHJcbiAgICAgICAgZG93bmxvYWRUYXJnZXQuZG93bmxvYWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArJy5qcGcnO1xyXG4gICAgICAgIGRvd25sb2FkVGFyZ2V0LmNsaWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvLnnqpfkuIvovb1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHBvcHVwQ29weSgpOnZvaWQge1xyXG4gICAgICAgIHRoaXMucGFyYW1zLlVJVGFyZ2V0LmltZ1RhcmdldC5zcmMgPSB0aGlzLmNhbnZhcy50b0RhdGFVUkwoJ2ltYWdlL2pwZWcnLCAwLjUpO1xyXG4gICAgICAgIHRoaXMucGFyYW1zLlVJLnNob3dQb3B1cCgpO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gfVxyXG5cclxuIGV4cG9ydCBkZWZhdWx0IENhbnZhczsiLCJpbXBvcnQgdXRpbHMgZnJvbSBcIi4vdXRpbHNcIjtcclxuXHJcbi8qKlxyXG4gKiDnu5jnlLsgLS0g57G7ICjmqKHmi5/mi5bmi73lj4rnoa7lrprlpKflsI/kvY3nva4pXHJcbiAqL1xyXG5pbnRlcmZhY2UgcGFyYW1zIHtcclxuICAgIHRhcmdldDogSFRNTEVsZW1lbnQsXHJcbiAgICBkcmFnaW5nQ2I/OiBGdW5jdGlvbixcclxuICAgIGRyYWdFbmRDYj86IEZ1bmN0aW9uLFxyXG4gICAgZHJhd2luZ0NiPzogRnVuY3Rpb24sXHJcbiAgICBkcmF3RW5kQ2I/OiBGdW5jdGlvbiwgXHJcbn1cclxuXHJcbmludGVyZmFjZSBzaXplIHtcclxuICAgIHdpZHRoPzogbnVtYmVyLFxyXG4gICAgaGVpZ2h0PzogbnVtYmVyLFxyXG4gICAgY2xpZW50Vz86IG51bWJlcixcclxuICAgIGNsaWVudEg/OiBudW1iZXIsXHJcbiAgICBvZmZzZXRYPzogbnVtYmVyLFxyXG4gICAgb2Zmc2V0WT86IG51bWJlclxyXG59XHJcbmNsYXNzIFBhaW50aW5nIHtcclxuICAgIHByaXZhdGUgdGFyZ2V0OiBIVE1MRWxlbWVudDsgLy/nu5jnlLvnmoTlr7nosaFcclxuICAgIHByaXZhdGUgZHJhZ2luZ0NiOiBGdW5jdGlvbjsgLy/mi5bmi73kuK3nmoTlm57osINcclxuICAgIHByaXZhdGUgZHJhZ0VuZENiOiBGdW5jdGlvbjsgLy/mi5bmi73nu5PmnZ/nmoTlm57osINcclxuXHJcbiAgICBwcml2YXRlIGRyYXdpbmdDYjogRnVuY3Rpb247IC8v57uY55S75Lit55qE5Zue6LCDXHJcbiAgICBwcml2YXRlIGRyYXdFbmRDYjogRnVuY3Rpb247IC8v57uY55S757uT5p2f55qE5Zue6LCDXHJcblxyXG4gICAgcHJpdmF0ZSBzdGFydFg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHN0YXJ0WTogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgbGFzdFg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIGxhc3RZOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSByYW5nZVg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHJhbmdlWTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwcml2YXRlIHNpemU6IHNpemUgO1xyXG5cclxuICAgIHByaXZhdGUgX2RyYWdTdGFydEhhbmRsZXI6IEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3Q7XHJcbiAgICBwcml2YXRlIF9kcmFnaW5nSGFuZGxlcjogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdDtcclxuICAgIHByaXZhdGUgX2RyYWdFbmRIYW5kbGVyOiBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0O1xyXG5cclxuICAgIHByaXZhdGUgX2RyYXdTdGFydEhhbmRsZXI6IEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3Q7XHJcbiAgICBwcml2YXRlIF9kcmF3aW5nSGFuZGxlcjogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdDtcclxuICAgIHByaXZhdGUgX2RyYXdFbmRIYW5kbGVyOiBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogcGFyYW1zKXsgXHJcbiAgICAgICAgdGhpcy50YXJnZXQgPSBwYXJhbXMudGFyZ2V0O1xyXG4gICAgICAgIHRoaXMuZHJhZ2luZ0NiID0gcGFyYW1zLmRyYWdpbmdDYjtcclxuICAgICAgICB0aGlzLmRyYWdFbmRDYiA9IHBhcmFtcy5kcmFnRW5kQ2I7XHJcbiAgICAgICAgdGhpcy5kcmF3aW5nQ2IgPSBwYXJhbXMuZHJhd2luZ0NiO1xyXG4gICAgICAgIHRoaXMuZHJhd0VuZENiID0gcGFyYW1zLmRyYXdFbmRDYjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMluaLluaLveS6i+S7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaW5pdERyYWcoKTp2b2lkIHtcclxuICAgICAgIFxyXG4gICAgICAgIHRoaXMub25EcmFnU3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlue7mOeUu+WQjueahOWHoOS9leS/oeaBr++8jOeUqOS6jui+ueeVjOWIpOaWrVxyXG4gICAgICogQHBhcmFtIHNpemUg5Yeg5L2V5L+h5oGvXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRTY3JlZW5TaXplKHNpemU6IHNpemUpOnZvaWR7XHJcbiAgICAgICAgdGhpcy5zaXplID0gT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIHdpZHRoOjAsXHJcbiAgICAgICAgICAgIGhlaWdodDowLFxyXG4gICAgICAgICAgICBjbGllbnRXOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLFxyXG4gICAgICAgICAgICBjbGllbnRIOiBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCxcclxuICAgICAgICAgICAgb2Zmc2V0WDogMCxcclxuICAgICAgICAgICAgb2Zmc2V0WTogMFxyXG4gICAgICAgIH0sc2l6ZSk7XHJcbiAgICAgICAgdGhpcy5sYXN0WCA9IHRoaXMuc2l6ZS5vZmZzZXRYO1xyXG4gICAgICAgIHRoaXMubGFzdFkgPSB0aGlzLnNpemUub2Zmc2V0WTsgXHJcbiAgICAgICAgY29uc29sZS5sb2coJ3NpemUnLHRoaXMuc2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRDdXJzb3IoYXR0cjogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS5jdXJzb3IgPSBhdHRyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5ouW5ou9IHN0YXJ0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvbkRyYWdTdGFydCgpOnZvaWQge1xyXG4gICAgICAgIGxldCBfdGhpcz0gIHRoaXM7XHJcbiAgICAgICAgdGhpcy5fZHJhZ1N0YXJ0SGFuZGxlciA9IHRoaXMuZHJhZ1N0YXJ0SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsdGhpcy5fZHJhZ1N0YXJ0SGFuZGxlcixmYWxzZSk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmFnU3RhcnRIYW5kbGVyKCk6dm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYXJndW1lbnRzKTtcclxuICAgICAgICBsZXQgZTogYW55ID0gYXJndW1lbnRzWzBdOyBcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2V0Q3Vyc29yKCdtb3ZlJyk7XHJcbiAgICAgICAgdGhpcy5zdGFydFggPSBlLmNsaWVudFg7XHJcbiAgICAgICAgdGhpcy5zdGFydFkgPSBlLmNsaWVudFk7XHJcbiAgICAgICAgdGhpcy5vbkRyYWdpbmcoKTtcclxuICAgICAgICB0aGlzLm9uRHJhZ0VuZCgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMubGFzdFgsIHRoaXMubGFzdFkpO1xyXG4gICAgfSBcclxuXHJcbiAgICAvKipcclxuICAgICAqIOaLluaLveS4rVxyXG4gICAgICogQHBhcmFtIGRyYWdpbmdDYiBcclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uRHJhZ2luZygpOnZvaWQge1xyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5zZXRDdXJzb3IoJ21vdmUnKTtcclxuICAgICAgICB0aGlzLl9kcmFnaW5nSGFuZGxlciA9IHRoaXMuZHJhZ2luZ0hhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLHRoaXMuX2RyYWdpbmdIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmFnaW5nSGFuZGxlcigpOnZvaWQge1xyXG4gICAgICAgIGxldCBlOiBhbnkgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBsZXQgdGhyb3R0bGVDYiA6RnVuY3Rpb24gPSB1dGlscy50aHJvdHRsZSh0aGlzLmRyYWdpbmdDYiwxMCk7XHJcbiAgICAgICAgdGhpcy5yYW5nZVggPSBlLmNsaWVudFggLSB0aGlzLnN0YXJ0WCArIHRoaXMubGFzdFg7XHJcbiAgICAgICAgdGhpcy5yYW5nZVkgPSBlLmNsaWVudFkgLSB0aGlzLnN0YXJ0WSArIHRoaXMubGFzdFk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5yYW5nZVgrdGhpcy5zaXplLndpZHRoLHRoaXMucmFuZ2VZK3RoaXMuc2l6ZS5oZWlnaHQpXHJcbiAgICAgICAgLy8gIOi+ueeVjOWIpOaWrVxyXG4gICAgICAgIGlmKHRoaXMucmFuZ2VYPDApe1xyXG4gICAgICAgICAgICB0aGlzLnJhbmdlWD0wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnJhbmdlWCt0aGlzLnNpemUud2lkdGg+dGhpcy5zaXplLmNsaWVudFcrZG9jdW1lbnQuYm9keS5vZmZzZXRMZWZ0KXtcclxuICAgICAgICAgICAgdGhpcy5yYW5nZVggPSB0aGlzLnNpemUuY2xpZW50Vytkb2N1bWVudC5ib2R5Lm9mZnNldExlZnQtdGhpcy5zaXplLndpZHRoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5yYW5nZVk8MCl7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VZID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5yYW5nZVkrdGhpcy5zaXplLmhlaWdodD50aGlzLnNpemUuY2xpZW50SCtkb2N1bWVudC5ib2R5Lm9mZnNldFRvcCl7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VZID0gdGhpcy5zaXplLmNsaWVudEgrZG9jdW1lbnQuYm9keS5vZmZzZXRUb3AtdGhpcy5zaXplLmhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3R0bGVDYih0aGlzLnJhbmdlWCx0aGlzLnJhbmdlWSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmi5bmi73nu5PmnZ9cclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uRHJhZ0VuZCgpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuX2RyYWdFbmRIYW5kbGVyID0gdGhpcy5kcmFnRW5kSGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLHRoaXMuX2RyYWdFbmRIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsdGhpcy5fZHJhZ0VuZEhhbmRsZXIsIGZhbHNlKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYWdFbmRIYW5kbGVyKCk6dm9pZHtcclxuICAgICAgICBsZXQgZTogYW55ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIHRoaXMubGFzdFggPSB0aGlzLnJhbmdlWDtcclxuICAgICAgICB0aGlzLmxhc3RZID0gdGhpcy5yYW5nZVk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJyx0aGlzLl9kcmFnaW5nSGFuZGxlcixmYWxzZSk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsdGhpcy5fZHJhZ0VuZEhhbmRsZXIsZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuZHJhZ0VuZENiKHRoaXMucmFuZ2VYLHRoaXMucmFuZ2VZKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMlue7mOeUu+S6i+S7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaW5pdERyYXcoKTp2b2lkIHtcclxuICAgICAgICB0aGlzLm9uRHJhd1N0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvIDlp4vnu5jnlLtcclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uRHJhd1N0YXJ0KCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5zZXRDdXJzb3IoJ2Nyb3NzaGFpcicpO1xyXG4gICAgICAgIHRoaXMuX2RyYXdTdGFydEhhbmRsZXIgPSB0aGlzLmRyYXdTdGFydEhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLHRoaXMuX2RyYXdTdGFydEhhbmRsZXIsZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd1N0YXJ0SGFuZGxlcigpOnZvaWQge1xyXG4gICAgICAgIGxldCBlOiBhbnkgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnN0YXJ0WCA9IGUuY2xpZW50WDtcclxuICAgICAgICB0aGlzLnN0YXJ0WSA9IGUuY2xpZW50WTtcclxuICAgICAgICB0aGlzLm9uRHJhd2luZygpO1xyXG4gICAgICAgIHRoaXMub25EcmF3RW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnu5jnlLvkuK1cclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uRHJhd2luZygpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuX2RyYXdpbmdIYW5kbGVyID0gdGhpcy5kcmF3aW5nSGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsdGhpcy5fZHJhd2luZ0hhbmRsZXIsZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd2luZ0hhbmRsZXIoKTp2b2lkIHtcclxuICAgICAgICBsZXQgZTogYW55ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5yYW5nZVggPSBlLmNsaWVudFggLSB0aGlzLnN0YXJ0WDtcclxuICAgICAgICB0aGlzLnJhbmdlWSA9IGUuY2xpZW50WSAtIHRoaXMuc3RhcnRZO1xyXG4gICAgICAgIC8vIGRlYnVnZ2VyO1xyXG4gICAgICAgIGxldCB0aHJvdHRsZUNiOiBGdW5jdGlvbiA9IHV0aWxzLnRocm90dGxlKHRoaXMuZHJhd2luZ0NiLDEwKTtcclxuICAgICAgICB0aHJvdHRsZUNiKHRoaXMucmFuZ2VYLHRoaXMucmFuZ2VZLHRoaXMuc3RhcnRYLHRoaXMuc3RhcnRZKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOe7mOeUu+e7k+adn1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb25EcmF3RW5kKCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZHJhd0VuZEhhbmRsZXIgPSB0aGlzLmRyYXdFbmRIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsdGhpcy5fZHJhd0VuZEhhbmRsZXIsZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd0VuZEhhbmRsZXIoKTp2b2lkIHtcclxuICAgICAgICB0aGlzLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLHRoaXMuX2RyYXdpbmdIYW5kbGVyLGZhbHNlKTtcclxuICAgICAgICB0aGlzLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJyx0aGlzLl9kcmF3RW5kSGFuZGxlcixmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5kcmF3RW5kQ2IodGhpcy5zdGFydFgsdGhpcy5zdGFydFkpO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBhaW50aW5nOyIsIi8vIFVJ6ZuG5ZCIXHJcblxyXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi91dGlscyc7XHJcblxyXG5jbGFzcyBVSSB7XHJcbiAgICBwdWJsaWMgVUlUYXJnZXQ6IGFueTtcclxuICAgIHByaXZhdGUgbWFza1RhcmdldDogSFRNTEVsZW1lbnQ7IC8v6JKZ5bGC55qEZWxlbWVudOWvueixoVxyXG4gICAgcHJpdmF0ZSBzZWxlY3RUYXJnZXQ6IEhUTUxFbGVtZW50OyAvL+WPr+aLluaLvemAieaLqeahhuWvueixoVxyXG4gICAgcHJpdmF0ZSBudW1iZXJUYXJnZXQ6IEhUTUxFbGVtZW50OyAvL+WuvemrmOaVsOaNruaYvuekuuWMulxyXG4gICAgcHJpdmF0ZSBmdW5jdGlvblZpZXc6IEhUTUxFbGVtZW50OyAvL+WKn+iDveaYvuekuuWMulxyXG4gICAgcHJpdmF0ZSBpbWdUYXJnZXQ6IEhUTUxJbWFnZUVsZW1lbnQ7IC8v6ZqQ6JeP55qEaW1n5qCH562+XHJcbiAgICBwcml2YXRlIHBvcHVwVGFyZ2V0OiBIVE1MRWxlbWVudDsgLy9wb3B1cOWvueixoVxyXG4gICAgcHJpdmF0ZSBkb3dubG9hZFRhcmdldDogSFRNTEVsZW1lbnQ7IC8v5LiL6L2955So5Yiw55qEYeagh+etvlxyXG4gICAgcHJpdmF0ZSB1dWlkOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe31cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMllVJ55WM6Z2iXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbml0VUkodXVpZDpudW1iZXIpOnZvaWR7XHJcbiAgICAgICAgdGhpcy51dWlkID0gdXVpZDtcclxuICAgICAgICB0aGlzLmNyZWF0ZVdyYXBwZXIoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVBvcHVwKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVEb3dubG9hZCgpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlTnVtYmVyVmlldygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu66JKZ5bGCXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY3JlYXRlV3JhcHBlcigpOnZvaWQge1xyXG4gICAgICAgIHRoaXMubWFza1RhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5zY3JlZW5DYXB0dXJlLSR7dGhpcy51dWlkfWApO1xyXG4gICAgICAgIGlmKHRoaXMubWFza1RhcmdldCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMubWFza1RhcmdldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMubWFza1RhcmdldC5jbGFzc05hbWUgPSBgc2NyZWVuQ2FwdHVyZS13cmFwcGVyIHNjcmVlbkNhcHR1cmUtJHt0aGlzLnV1aWR9YDtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMubWFza1RhcmdldCk7XHJcbiBcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7pwb3B1cOW8ueeql1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNyZWF0ZVBvcHVwKCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5wb3B1cFRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zY2NyZWVuQ2FwdHVyZS1oaWRlLWltZycpO1xyXG4gICAgICAgIGlmKHRoaXMucG9wdXBUYXJnZXQpIHJldHVybjtcclxuICAgICAgICB0aGlzLnBvcHVwVGFyZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5wb3B1cFRhcmdldC5jbGFzc05hbWUgPSAnc2NyZWVuQ2FwdHVyZS1wb3B1cCBmbGV4IGFsaWduLWNlbnRlciBmbGV4LWNlbnRlcic7XHJcbiAgICAgICAgLy8gdXRpbHMuQ2xhc3ModGhpcy5wb3B1cFRhcmdldCwnYWRkJywnJyk7XHJcbiAgICAgICAgdGhpcy5wb3B1cFRhcmdldC5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInBvcHVwLXdyYXBwZXIgXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwb3B1cC1oZWFkZXIgZmxleCBzcGFjZS1iZXR3ZWVuXCI+XHJcblxyXG4gICAgICAgICAgICAgICAgPGgyIGNsYXNzPVwicG9wdXAtdGl0bGVcIj7lm77niYfmiKrlm748L2gyPlxyXG4gICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cInBvcHVwLWNsb3NlXCIgc3JjPVwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCa0FBQUFaQ0FZQUFBREU2WVZqQUFBQXdVbEVRVlJJaWQzVndRM0NNQXlGNFgrRWpzQUlHYUdqZEFQWWdHNEFHOEJvM1lCdUVDNkpWQ0U3c1pOd2dDZjVVTW5PRjdWS0EvK2FFM0FGUXNQc0JKelRHbW9DOEFKaXFzVUJtR2UzUTVNSCtnUmllaGF6QzBnTmtvQ1kxaEt6S0lnR2FVRDFEVmloWnNBS2RRTVdhQWhnZ1lZQUhxZ0x5RmtMd0hNRVVQckl1VzdmQm5JOVJnUGFuOEVGMWM1QjZJV3NCNjBaOHA3a0VyUnF5T1lBTEpCNDhVbk5KYUFHaWNoeWFOaU5nQWJkUzgwemNLRnlUeXVaMHNibWh0a2Z5UnRTWjlWRmZ3SFpFZ0FBQUFCSlJVNUVya0pnZ2c9PVwiIGFsdD1cIlwiPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGltZyBzcmM9XCJcIiBhbHQ9XCLmiKrlm75cIiBjbGFzcz1cInBvcHVwLWNvbnRlbnQtaW1nXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwb3B1cC1mb290ZXIgZmxleCBzcGFjZS1iZXR3ZWVuIGFsaWduLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJwb3B1cC10aXBcIj50aXBzOiDlj7Plh7vlm77niYfpgInmi6nlpI3liLblm77lg4/vvIzlj6/ku6Xmi7fotJ3liLDlvq7kv6HlkoxRUei9r+S7tuS4rSBeLl48L3A+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicG9wdXAtZG93bmxvYWRcIj5kb3dubG9hZDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucG9wdXBUYXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu65LiL6L296ZyA6KaB55So5Yiw55qE5qCH562+XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY3JlYXRlRG93bmxvYWQoKTp2b2lke1xyXG4gICAgICAgIHRoaXMuZG93bmxvYWRUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2NyZWVuQ2FwdHVyZS1kb3dubG9hZC1ocmVmJyk7XHJcbiAgICAgICAgaWYodGhpcy5kb3dubG9hZFRhcmdldCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuZG93bmxvYWRUYXJnZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgdXRpbHMuQ2xhc3ModGhpcy5kb3dubG9hZFRhcmdldCwnYWRkJywnc2NyZWVuQ2FwdHVyZS1kb3dubG9hZC1ocmVmJyk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRvd25sb2FkVGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuWuvemrmOaVsOaNruaYvuekuuWMulxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNyZWF0ZU51bWJlclZpZXcoKTp2b2lke1xyXG4gICAgICAgIHRoaXMubnVtYmVyVGFyZ2V0ID0gdGhpcy5tYXNrVGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5zY3JlZW5DYXB0dXJlLW51bWJlci12aWV3Jyk7XHJcbiAgICAgICAgaWYodGhpcy5udW1iZXJUYXJnZXQpIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5udW1iZXJUYXJnZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB1dGlscy5DbGFzcyh0aGlzLm51bWJlclRhcmdldCwnYWRkJywnc2NyZWVuQ2FwdHVyZS1udW1iZXItdmlldycpO1xyXG5cclxuICAgICAgICB0aGlzLmZ1bmN0aW9uVmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHV0aWxzLkNsYXNzKHRoaXMuZnVuY3Rpb25WaWV3LCdhZGQnLCdzY3JlZW5DYXB0dXJlLXNlbGVjdGJveCcpO1xyXG5cclxuICAgICAgICB0aGlzLmZ1bmN0aW9uVmlldy5pbm5lckhUTUwgPSBgXHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInNjcmVlbkNhcHR1cmUtdy1oIGktYiB2LW1cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNjcmVlbkNhcHR1cmUtd1wiPjA8L3NwYW4+IHggXHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY3JlZW5DYXB0dXJlLWhcIj4wPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJzY3JlZW5DYXB0dXJlLWZ1bmN0aW9uIGktYiB2LW1cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZ1bmN0aW9uLWl0ZW0gZnVuY3Rpb24tZG9vZGxpbmcgdi1tXCI+5raC6bimPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWcgYWx0PVwi5Y+W5raIXCIgY2xhc3M9XCJmdW5jdGlvbi1jbG9zZSB2LW1cIiBzcmM9XCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJrQUFBQVpDQVlBQUFERTZZVmpBQUFBblVsRVFWUklpZTNVTVE2Rk1BZ0c0QzUwOWdKd2RibVJidlJOZXBPNnZUeWJZTUhpOEJML3RaQXZKTkNVM3Z4TnRpbE5qd09GWVBrZ3pKWjZRV0JyN1Frb2xHdWhYSHZOZ3NEV1dyWHhxcm10RXdRMkl4Wm9HT2hCWVlBR0ZjcGJLSEFCeFFKZmlQTGVUaFFMS0pPNFZ0WUR0Qk1OUTlvV1dlL29OcUM5dXlIckhReEJ2ODI5TlQxQkNLdnI5eFlFdHQ2QklMQWJ1SlBIZ1RlaE9RQ1M5ZU9PT25NRTFRQUFBQUJKUlU1RXJrSmdnZz09XCIgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWcgYWx0PVwi5a6M5oiQXCIgY2xhc3M9XCJmdW5jdGlvbi1zdWNjZXNzIHYtbVwiIHNyYz1cImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQmtBQUFBWkNBWUFBQURFNllWakFBQUF1RWxFUVZSSWllM1F3UTNDTUF3RjBJeVFDMUxzVXk1VTlvMVJ1Z0VkZ1JFWWhRMWdBN3BCUjZIWFdKWE1CVUZCQkFJazR0RCs4N2VlYldQbVRDWTRWRFVJSFoxUVV3UndRZzBLS3dvckNMVkZBUlRXN0pkTUFMRHFyUk5hVy9XMkNHQ01NU0RVWGdyZHAxRHlpMUJvTnlvbVF5Qzh1YzFSajBOVlI4dFd2UjFkb3lqY09TWC9DcmhmalBxRkxGY3BpejFlZElvTmZnMmtRajhENzZCc1FBeUN3UHVzUUFUS0R6eUhDZ0JYS05BV0FoK0tBWFAra2pPeFN1ZkhmYXd5ZndBQUFBQkpSVTVFcmtKZ2dnPT1cIiA+XHJcbiAgICAgICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgYDtcclxuICAgICAgICB0aGlzLm51bWJlclRhcmdldC5hcHBlbmRDaGlsZCh0aGlzLmZ1bmN0aW9uVmlldyk7XHJcbiAgICAgICAgdGhpcy5tYXNrVGFyZ2V0LmFwcGVuZENoaWxkKHRoaXMubnVtYmVyVGFyZ2V0KTtcclxuICAgICAgICB0aGlzLnNldFVJVGFyZ2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva5VSVRhcmdldFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0VUlUYXJnZXQoKTp2b2lke1xyXG4gICAgICAgIHRoaXMuVUlUYXJnZXQ9IHtcclxuICAgICAgICAgICAgbWFza1RhcmdldDogdGhpcy5tYXNrVGFyZ2V0LFxyXG4gICAgICAgICAgICBzZWxlY3RUYXJnZXQ6IHRoaXMuc2VsZWN0VGFyZ2V0LFxyXG4gICAgICAgICAgICBudW1iZXJUYXJnZXQ6IHRoaXMubnVtYmVyVGFyZ2V0LFxyXG4gICAgICAgICAgICBmdW5jdGlvblZpZXc6IHRoaXMuZnVuY3Rpb25WaWV3LFxyXG4gICAgICAgICAgICBjYXB0dXJlV2lkdGg6IHRoaXMubnVtYmVyVGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5zY3JlZW5DYXB0dXJlLXcnKSxcclxuICAgICAgICAgICAgY2FwdHVyZUhlaWdodDogdGhpcy5udW1iZXJUYXJnZXQucXVlcnlTZWxlY3RvcignLnNjcmVlbkNhcHR1cmUtaCcpLFxyXG4gICAgICAgICAgICBjYXB0dXJlU3VyZTogdGhpcy5udW1iZXJUYXJnZXQucXVlcnlTZWxlY3RvcignLmZ1bmN0aW9uLXN1Y2Nlc3MnKSxcclxuICAgICAgICAgICAgY2FwdHVyZUNsb3NlOiB0aGlzLm51bWJlclRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZnVuY3Rpb24tY2xvc2UnKSxcclxuICAgICAgICAgICAgY2FwdHVyZURvb2RsaW5nOiB0aGlzLm51bWJlclRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZnVuY3Rpb24tZG9vZGxpbmcnKSxcclxuICAgICAgICAgICAgaW1nVGFyZ2V0OiB0aGlzLnBvcHVwVGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5wb3B1cC1jb250ZW50LWltZycpLCBcclxuICAgICAgICAgICAgZG93bmxvYWRUYXJnZXQ6IHRoaXMuZG93bmxvYWRUYXJnZXQsIFxyXG4gICAgICAgICAgICBwb3B1cENsb3NlVGFyZ2V0OiB0aGlzLnBvcHVwVGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5wb3B1cC1jbG9zZScpLFxyXG4gICAgICAgICAgICBwb3B1cERvd25sb2FkVGFyZ2V0OiB0aGlzLnBvcHVwVGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5wb3B1cC1kb3dubG9hZCcpLFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaYvuekuuiSmeWxglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2hvd01hc2soKTp2b2lkIHtcclxuICAgICAgICB1dGlscy5DbGFzcyh0aGlzLm1hc2tUYXJnZXQsJ2FkZCcsJ3NjcmVlbkNhcHR1cmUtd3JhcHBlci1zaG93Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpmpDol4/okpnlsYJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGhpZGVNYXNrKCk6dm9pZCB7XHJcbiAgICAgICAgdXRpbHMuQ2xhc3ModGhpcy5tYXNrVGFyZ2V0LCdkZWwnLCdzY3JlZW5DYXB0dXJlLXdyYXBwZXItc2hvdycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pi+56S65L+h5oGv5Yqf6IO95Yy6XHJcbiAgICAgKiBAcGFyYW0gd2lkdGggXHJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IFxyXG4gICAgICogQHBhcmFtIHggXHJcbiAgICAgKiBAcGFyYW0geSBcclxuICAgICAqIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2hvd0Z1bmN0aW9uVmlldyh3aWR0aDpudW1iZXIsaGVpZ2h0Om51bWJlcix4Om51bWJlcix5Om51bWJlcik6dm9pZCB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogdG9kbzpcclxuICAgICAgICAgKiAxLiDnu5kgbnVtYmVyVGFyZ2V06K6+572u5a696auY5ZKM5L2N572uXHJcbiAgICAgICAgICogMi4g5pi+56S6IGZ1bmN0aW9uVmlld1xyXG4gICAgICAgICAqIDMuIOWIpOaWrWZ1bmN0aW9uVmlld+eahOS9jee9ruacieayoeaciei2heWHulxyXG4gICAgICAgICAqIDQuIOaYvuekuuWuvemrmOWPguaVsFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmKHdpZHRoPD0wIHx8IGhlaWdodDw9MCkgcmV0dXJuOyAvL+ebruWJjeWPquaUr+aMgeW3pi0+5Y+z77yM5LiKLT7kuIvorr7nva7kvY3nva7lkozlrr3pq5hcclxuICAgICAgICAvL3RvZG8xOlxyXG4gICAgICAgIHRoaXMubnVtYmVyVGFyZ2V0LnN0eWxlLmNzc1RleHQgPSBgXHJcbiAgICAgICAgICAgIHdpZHRoOiR7d2lkdGh9cHg7XHJcbiAgICAgICAgICAgIGhlaWdodDogJHtoZWlnaHR9cHg7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKCR7eH1weCwke3l9cHgpO1xyXG4gICAgICAgIGA7XHJcbiAgICAgICAgLy8gdG9kbzI6XHJcbiAgICAgICAgdXRpbHMuQ2xhc3ModGhpcy5mdW5jdGlvblZpZXcsJ2FkZCcsJ3NjcmVlbkNhcHR1cmUtc2VsZWN0Ym94LXNob3cnKTtcclxuICAgICAgICAvLyB0b2RvMzpcclxuICAgICAgICBsZXQgb2Zmc2V0V2lkdGg6IG51bWJlciA9IHRoaXMuZnVuY3Rpb25WaWV3Lm9mZnNldFdpZHRoO1xyXG4gICAgICAgIGxldCBvZmZzZXRIZWlnaHQ6IG51bWJlciA9IHRoaXMuZnVuY3Rpb25WaWV3Lm9mZnNldEhlaWdodDtcclxuICAgICAgICBpZihvZmZzZXRXaWR0aD54KXtcclxuICAgICAgICAgICAgdGhpcy5mdW5jdGlvblZpZXcuc3R5bGUubGVmdD0nMHB4JztcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5mdW5jdGlvblZpZXcuc3R5bGUubGVmdD0nbm9uZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKG9mZnNldEhlaWdodCt5K2hlaWdodCx0aGlzLm1hc2tUYXJnZXQub2Zmc2V0SGVpZ2h0KVxyXG4gICAgICAgIGlmKG9mZnNldEhlaWdodCt5K2hlaWdodD49dGhpcy5tYXNrVGFyZ2V0Lm9mZnNldEhlaWdodCl7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmZ1bmN0aW9uVmlldy5zdHlsZS50b3AgPSAnMHB4JztcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5mdW5jdGlvblZpZXcuc3R5bGUudG9wPWhlaWdodCsncHgnO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0b2RvNDpcclxuICAgICAgICB0aGlzLlVJVGFyZ2V0LmNhcHR1cmVXaWR0aC5pbm5lclRleHQgPSB3aWR0aDtcclxuICAgICAgICB0aGlzLlVJVGFyZ2V0LmNhcHR1cmVIZWlnaHQuaW5uZXJUZXh0ID0gaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6+572u5Yeg5L2V5L+h5oGvKOS9jee9ruWSjOWkp+WwjylcclxuICAgICAqIEBwYXJhbSB3aWR0aCBcclxuICAgICAqIEBwYXJhbSBoZWlnaHQgXHJcbiAgICAgKiBAcGFyYW0geCBcclxuICAgICAqIEBwYXJhbSB5IFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0Vmlld0xheW91dCh3aWR0aDpudW1iZXIsaGVpZ2h0Om51bWJlcix4Om51bWJlcix5Om51bWJlcik6dm9pZCB7XHJcbiAgICAgICAgaWYod2lkdGg8PTAgfHwgaGVpZ2h0PD0wKSByZXR1cm47IC8v55uu5YmN5Y+q5pSv5oyB5bemLT7lj7PvvIzkuIotPuS4i+iuvue9ruS9jee9ruWSjOWuvemrmFxyXG4gICAgICAgIHRoaXMubnVtYmVyVGFyZ2V0LnN0eWxlLmNzc1RleHQgPSBgXHJcbiAgICAgICAgICAgIHdpZHRoOiR7d2lkdGh9cHg7XHJcbiAgICAgICAgICAgIGhlaWdodDogJHtoZWlnaHR9cHg7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKCR7eH1weCwke3l9cHgpO1xyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpmpDol4/pgInmi6nmoYZcclxuICAgICAqL1xyXG4gICAgcHVibGljIGhpZGVWaWV3TGF5b3V0KCl7XHJcbiAgICAgICAgdGhpcy5udW1iZXJUYXJnZXQuc3R5bGUuY3NzVGV4dCA9IGBcclxuICAgICAgICAgICAgd2lkdGg6MHB4O1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDBweDtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTEwMDAwMHB4LC0xMDAwMDBweCk7IFxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgdXRpbHMuQ2xhc3ModGhpcy5mdW5jdGlvblZpZXcsJ2RlbCcsJ3NjcmVlbkNhcHR1cmUtc2VsZWN0Ym94LXNob3cnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaYvuekuuW8ueeql1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2hvd1BvcHVwKCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5wb3B1cFRhcmdldC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICAgICAgdXRpbHMuQ2xhc3ModGhpcy5wb3B1cFRhcmdldCwnYWRkJywnc2NyZWVuQ2FwdHVyZS1wb3B1cC1zaG93Jyk7XHJcbiAgICAgICAgfSw1MClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmakOiXj+W8ueeql1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaGlkZVBvcHVwKCk6dm9pZCB7XHJcbiAgICAgICAgdXRpbHMuQ2xhc3ModGhpcy5wb3B1cFRhcmdldCwnZGVsJywnc2NyZWVuQ2FwdHVyZS1wb3B1cC1zaG93Jyk7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLnBvcHVwVGFyZ2V0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfSw1MDApXHJcbiAgICB9XHJcblxyXG4gICAgIFxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFVJOyAiLCJpbXBvcnQgU2NyZWVuQ2FwdHVyZSBmcm9tICcuL3NjcmVlbkNhcHR1cmUnO1xyXG5pbXBvcnQgVUkgZnJvbSAnLi9VSSc7XHJcbmltcG9ydCBQYWludGluZyBmcm9tICcuL1BhaW50aW5nJztcclxuaW1wb3J0IENhbnZhcyBmcm9tICcuL0NhbnZhcyc7XHJcblxyXG4od2luZG93IGFzIGFueSkuVUkgPSBVSTtcclxuKHdpbmRvdyBhcyBhbnkpLlBhaW50aW5nID0gUGFpbnRpbmc7XHJcbih3aW5kb3cgYXMgYW55KS5DYW52YXMgPSBDYW52YXM7XHJcbih3aW5kb3cgYXMgYW55KS5TY3JlZW5DYXB0dXJlID0gU2NyZWVuQ2FwdHVyZTtcclxuLy8gZXhwb3J0IGRlZmF1bHQgU2NyZWVuQ2FwdHVyZTtcclxuLy8gZXhwb3J0IGRlZmF1bHQgVUk7ICIsIi8qKlxyXG4gKiDmoLjlv4PnsbsgLS0g6L+e5o6lVUkuanPlkoxDYW52YXMuanNcclxuICovXHJcblxyXG5pbXBvcnQgVUkgZnJvbSAnLi9VSSc7XHJcbmltcG9ydCBDYW52YXMgZnJvbSAnLi9DYW52YXMnO1xyXG5pbXBvcnQgUGFpbnRpbmcgZnJvbSAnLi9QYWludGluZyc7XHJcbmltcG9ydCB1dGlscyBmcm9tICcuL3V0aWxzJztcclxuXHJcbi8vIOmFjee9ruWPguaVsFxyXG5pbnRlcmZhY2Ugb3B0aW9ucyB7XHJcbiAgICBjb3B5VHlwZT86IHN0cmluZyxcclxuICAgIGtleUNvZGU/OiBudW1iZXJ8c3RyaW5nLFxyXG4gICAgZmtleUNvZGU/OiBudW1iZXJ8c3RyaW5nLFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JlZW5DYXB0dXJlIHtcclxuICAgIHByaXZhdGUgb3B0aW9uczpvcHRpb25zO1xyXG4gICAgcHJpdmF0ZSBVSUluc3RhbmNlOiBVSTsgLy91aeWunuS+i1xyXG4gICAgcHJpdmF0ZSBEcmFnSW5zdGFuY2U6IFBhaW50aW5nOyAvL+aLluaLveWunuS+i1xyXG4gICAgcHJpdmF0ZSBEcmF3SW5zdGFuY2U6IFBhaW50aW5nOyAvL+e7mOeUu+WunuS+i1xyXG4gICAgcHJpdmF0ZSBDYW52YXNJbnN0YW5jZTogQ2FudmFzOyAvL2NhbnZhc+WunuS+i1xyXG5cclxuICAgIHByaXZhdGUgd2lkdGg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIGhlaWdodDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgb2Zmc2V0WDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgb2Zmc2V0WTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOm9wdGlvbnMpe1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xyXG4gICAgICAgICAgICBjb3B5VHlwZTogJ2FsbCcsXHJcbiAgICAgICAgICAgIGtleUNvZGU6IDY2LCAvL2JcclxuICAgICAgICAgICAgZmtleUNvZGU6IDc3LCAvL21cclxuICAgICAgICB9LG9wdGlvbnMpIDsgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlhazlvIDnmoRpbml05pa55rOVXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbml0KCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbml0VUkoKTtcclxuICAgICAgICB0aGlzLmluaXREcmFnKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RHJhdygpO1xyXG4gICAgICAgIHRoaXMuaW5pdENhbnZhcygpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMllVJ57G7XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdFVJKCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5VSUluc3RhbmNlID0gbmV3IFVJKCk7IFxyXG4gICAgICAgIHRoaXMuVUlJbnN0YW5jZS5pbml0VUkodXRpbHMudXVpZCgpKTsgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJbmi5bmi73lrp7kvotcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbml0RHJhZygpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJhZ2luZ0NiID0gdGhpcy5kcmFnaW5nQ2IuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRyYWdFbmRDYiA9IHRoaXMuZHJhZ0VuZENiLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5EcmFnSW5zdGFuY2UgPSBuZXcgUGFpbnRpbmcoe1xyXG4gICAgICAgICAgICB0YXJnZXQ6IHRoaXMuVUlJbnN0YW5jZS5VSVRhcmdldC5udW1iZXJUYXJnZXQsXHJcbiAgICAgICAgICAgIGRyYWdpbmdDYjogdGhpcy5kcmFnaW5nQ2IsXHJcbiAgICAgICAgICAgIGRyYWdFbmRDYjogdGhpcy5kcmFnRW5kQ2JcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLkRyYWdJbnN0YW5jZS5pbml0RHJhZygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIOaLluaLveS4reeahOWbnuiwg1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGRyYWdpbmdDYih4Om51bWJlcix5Om51bWJlcik6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5VSUluc3RhbmNlLnNldFZpZXdMYXlvdXQodGhpcy53aWR0aCx0aGlzLmhlaWdodCx4LHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5ouW5ou957uT5p2f5ZCO55qE5Zue6LCDIFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGRyYWdFbmRDYih4Om51bWJlcix5Om51bWJlcik6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5vZmZzZXRYID0geDtcclxuICAgICAgICB0aGlzLm9mZnNldFkgPSB5O1xyXG4gICAgICAgIHRoaXMuVUlJbnN0YW5jZS5zaG93RnVuY3Rpb25WaWV3KHRoaXMud2lkdGgsdGhpcy5oZWlnaHQseCx5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMlue7mOeUu+exu1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGluaXREcmF3KCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5kcmF3aW5nQ2IgPSB0aGlzLmRyYXdpbmdDYi5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuZHJhd0VuZENiID0gdGhpcy5kcmF3RW5kQ2IuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLkRyYXdJbnN0YW5jZSA9IG5ldyBQYWludGluZyh7XHJcbiAgICAgICAgICAgIHRhcmdldDogdGhpcy5VSUluc3RhbmNlLlVJVGFyZ2V0Lm1hc2tUYXJnZXQsXHJcbiAgICAgICAgICAgIGRyYXdpbmdDYjogdGhpcy5kcmF3aW5nQ2IsXHJcbiAgICAgICAgICAgIGRyYXdFbmRDYjogdGhpcy5kcmF3RW5kQ2JcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLkRyYXdJbnN0YW5jZS5pbml0RHJhdygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog57uY55S75Lit55qE5Zue6LCDXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZHJhd2luZ0NiKHc6bnVtYmVyLGg6bnVtYmVyLHg6bnVtYmVyLHk6bnVtYmVyKTp2b2lkIHtcclxuICAgICAgICB0aGlzLndpZHRoID0gdztcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGg7XHJcbiAgICAgICAgdGhpcy5VSUluc3RhbmNlLnNldFZpZXdMYXlvdXQodyxoLHgseSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnu5jnlLvnu5PmnZ/lkI7nmoTlm57osINcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBkcmF3RW5kQ2IoeDpudW1iZXIseTpudW1iZXIpOnZvaWQge1xyXG4gICAgICAgIHRoaXMub2Zmc2V0WCA9IHg7XHJcbiAgICAgICAgdGhpcy5vZmZzZXRZID0geTtcclxuICAgICAgICB0aGlzLlVJSW5zdGFuY2Uuc2hvd0Z1bmN0aW9uVmlldyh0aGlzLndpZHRoLHRoaXMuaGVpZ2h0LHgseSk7XHJcblxyXG4gICAgICAgIHRoaXMuRHJhZ0luc3RhbmNlLnNldFNjcmVlblNpemUoe1xyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy53aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCwgIFxyXG4gICAgICAgICAgICBjbGllbnRXOiB0aGlzLlVJSW5zdGFuY2UuVUlUYXJnZXQubWFza1RhcmdldC5jbGllbnRXaWR0aCxcclxuICAgICAgICAgICAgY2xpZW50SDogdGhpcy5VSUluc3RhbmNlLlVJVGFyZ2V0Lm1hc2tUYXJnZXQuY2xpZW50SGVpZ2h0LFxyXG4gICAgICAgICAgICBvZmZzZXRYOiB4LFxyXG4gICAgICAgICAgICBvZmZzZXRZOiB5XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMlmNhbnZhc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGluaXRDYW52YXMoKTp2b2lkIHtcclxuICAgICAgICB0aGlzLkNhbnZhc0luc3RhbmNlID0gbmV3IENhbnZhcyh7XHJcbiAgICAgICAgICAgIG1pbkhlaWdodDogdGhpcy5VSUluc3RhbmNlLlVJVGFyZ2V0Lm1hc2tUYXJnZXQuY2xpZW50SGVpZ2h0LFxyXG4gICAgICAgICAgICBjb3B5VHlwZTogdGhpcy5vcHRpb25zLmNvcHlUeXBlLFxyXG4gICAgICAgICAgICBVSVRhcmdldDogdGhpcy5VSUluc3RhbmNlLlVJVGFyZ2V0LFxyXG4gICAgICAgICAgICBVSTogdGhpcy5VSUluc3RhbmNlXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMluS6i+S7tlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGluaXRFdmVudHMoKTp2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5rZXlkb3duSGFuZGxlcigpO1xyXG4gICAgICAgIHRoaXMuY2FwdHVyZVN1cmVIYW5kbGVyKCk7XHJcbiAgICAgICAgdGhpcy5jYXB0dXJlQ2xvc2VIYW5kbGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdG9wTW91c2VEb3duKCk7XHJcbiAgICAgICAgdGhpcy5jbG9zZVBvcHVwSGFuZGxlcigpO1xyXG4gICAgICAgIHRoaXMucG9wdXBEb3dubG9hZEhhbmRsZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOebkeWQrOmUruebmOS6i+S7tiAgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUga2V5ZG93bkhhbmRsZXIoKTp2b2lke1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLChlKT0+e1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBjdHJsID0gZS5jdHJsS2V5IHx8IGUubWV0YUtleTtcclxuICAgICAgICAgICAgbGV0IGtleUNvZGUgPSBlLmtleUNvZGUgfHxlLndoaWNoIHx8IGUuY2hhckNvZGU7XHJcbiAgICAgICAgICAgIHRoaXMubm9ybWFsU2NyZWVuQ2FwdHVyZShjdHJsLGtleUNvZGUsZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZnVsbFNjcmVlbkNhcHR1cmUoY3RybCxrZXlDb2RlLGUpO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3BTY3JlZW5DYXB0dXJlKGtleUNvZGUsZSk7XHJcbiAgICAgICAgfSxmYWxzZSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaZrumAmueahOaIquWbvlxyXG4gICAgICogQHBhcmFtIGN0cmwgXHJcbiAgICAgKiBAcGFyYW0ga2V5Q29kZSBcclxuICAgICAqIEBwYXJhbSBlIFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIG5vcm1hbFNjcmVlbkNhcHR1cmUoY3RybDogYm9vbGVhbiwga2V5Q29kZTogbnVtYmVyLGU6YW55KTp2b2lke1xyXG4gICAgICAgIC8vIGN0cmwrYlxyXG4gICAgICAgIGlmKGN0cmwmJmtleUNvZGUgPT0gdGhpcy5vcHRpb25zLmtleUNvZGUpe1xyXG4gICAgICAgICAgICAvLyDmmL7npLrokpnlsYJcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLlVJSW5zdGFuY2Uuc2hvd01hc2soKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlhajlsY/miKrlm75cclxuICAgICAqIEBwYXJhbSBjdHJsIFxyXG4gICAgICogQHBhcmFtIGtleUNvZGUgXHJcbiAgICAgKiBAcGFyYW0gZSBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBmdWxsU2NyZWVuQ2FwdHVyZShjdHJsOiBib29sZWFuLCBrZXlDb2RlOiBudW1iZXIsZTphbnkpOnZvaWQge1xyXG4gICAgICAgIC8vIGN0cmwrblxyXG4gICAgICAgIGlmKGN0cmwmJmtleUNvZGUgPT0gdGhpcy5vcHRpb25zLmZrZXlDb2RlKXtcclxuICAgICAgICAgICAgLy8g5pi+56S66JKZ5bGCXHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5DYW52YXNJbnN0YW5jZS5jYXB0dXJlKHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCxcclxuICAgICAgICAgICAgICAgIG9mZnNldFg6MCxcclxuICAgICAgICAgICAgICAgIG9mZnNldFk6IDBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlgZzmraLmiKrlm75cclxuICAgICAqIEBwYXJhbSBrZXlDb2RlIFxyXG4gICAgICogQHBhcmFtIGUgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RvcFNjcmVlbkNhcHR1cmUoa2V5Q29kZTpudW1iZXIsZTphbnkpOnZvaWQge1xyXG4gICAgICAgIGlmKGtleUNvZGUgPT0gMjcpIHtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgdGhpcy5VSUluc3RhbmNlLmhpZGVQb3B1cCgpO1xyXG4gICAgICAgICAgICB0aGlzLlVJSW5zdGFuY2UuaGlkZU1hc2soKTtcclxuICAgICAgICAgICAgdGhpcy5VSUluc3RhbmNlLmhpZGVWaWV3TGF5b3V0KCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOeCueWHu+ehruiupOaIquWbvlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNhcHR1cmVTdXJlSGFuZGxlcigpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuVUlJbnN0YW5jZS5VSVRhcmdldC5jYXB0dXJlU3VyZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGUpPT57XHJcbiAgICAgICAgICAgIHRoaXMuVUlJbnN0YW5jZS5oaWRlTWFzaygpO1xyXG4gICAgICAgICAgICB0aGlzLlVJSW5zdGFuY2UuaGlkZVZpZXdMYXlvdXQoKTtcclxuICAgICAgICAgICAgdGhpcy5DYW52YXNJbnN0YW5jZS5jYXB0dXJlKHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIG9mZnNldFg6dGhpcy5vZmZzZXRYLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0WTogdGhpcy5vZmZzZXRZXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxmYWxzZSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWPlua2iOaIquWbvlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNhcHR1cmVDbG9zZUhhbmRsZXIoKTp2b2lkIHtcclxuICAgICAgICB0aGlzLlVJSW5zdGFuY2UuVUlUYXJnZXQuY2FwdHVyZUNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZSk9PntcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgdGhpcy5VSUluc3RhbmNlLmhpZGVNYXNrKCk7XHJcbiAgICAgICAgICAgIHRoaXMuVUlJbnN0YW5jZS5oaWRlVmlld0xheW91dCgpO1xyXG4gICAgICAgIH0sZmFsc2UpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/memHjOa3u+WKoOS4gOS4qm1vdXNlZG93bu+8jOaYr+S4uuS6humYu+atouinpuWPkeeItue6p+eahG1vdXNlZG93buS6i+S7tlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0b3BNb3VzZURvd24oKTp2b2lkIHtcclxuICAgICAgICB0aGlzLlVJSW5zdGFuY2UuVUlUYXJnZXQuZnVuY3Rpb25WaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsKGUpPT57XHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LGZhbHNlKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog54K55Ye75YWz6Zet5by556qXXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY2xvc2VQb3B1cEhhbmRsZXIoKTp2b2lkIHtcclxuICAgICAgICB0aGlzLlVJSW5zdGFuY2UuVUlUYXJnZXQucG9wdXBDbG9zZVRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGUpPT57XHJcbiAgICAgICAgICAgIHRoaXMuVUlJbnN0YW5jZS5oaWRlUG9wdXAoKTtcclxuICAgICAgICAgICAgdGhpcy5VSUluc3RhbmNlLmhpZGVNYXNrKCk7XHJcbiAgICAgICAgICAgIHRoaXMuVUlJbnN0YW5jZS5oaWRlVmlld0xheW91dCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvLnnqpfngrnlh7vkuIvovb1cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBwb3B1cERvd25sb2FkSGFuZGxlcigpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuVUlJbnN0YW5jZS5VSVRhcmdldC5wb3B1cERvd25sb2FkVGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZSk9PntcclxuXHJcbiAgICAgICAgICAgIHRoaXMuQ2FudmFzSW5zdGFuY2UuZG93bmxvYWRDb3B5KCk7XHJcbiAgICAgICAgICAgIHRoaXMuVUlJbnN0YW5jZS5oaWRlUG9wdXAoKTtcclxuICAgICAgICAgICAgdGhpcy5VSUluc3RhbmNlLmhpZGVNYXNrKCk7XHJcbiAgICAgICAgICAgIHRoaXMuVUlJbnN0YW5jZS5oaWRlVmlld0xheW91dCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG5cclxufSIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgIC8qKlxyXG4gICAgICogY3NzIGNsYXNzIOaTjeS9nFxyXG4gICAgICogQHBhcmFtIHRhcmdldCDlr7nosaFcclxuICAgICAqIEBwYXJhbSBvcCDmt7vliqAoYWRkKe+8jCDliKDpmaQoZGVsKe+8jCDljIXlkKsoaGFzKe+8jCDnrYnkuo4oZXEpLCDliIfmjaIodG9nKe+8jCDmm7/mjaIocmVwKVxyXG4gICAgICogQHBhcmFtIGNsYXNzTmFtZSBcclxuICAgICAqIEBwYXJhbSBvbGRDbGFzcyBcclxuICAgICAqL1xyXG4gICAgQ2xhc3ModGFyZ2V0OiBhbnksb3A6U3RyaW5nPSdhZGQnLGNsYXNzTmFtZT86U3RyaW5nLG9sZENsYXNzPzpTdHJpbmcpOmFueXtcclxuICAgICAgICBsZXQgcmVzdWx0OiBhbnk7XHJcbiAgICAgICAgc3dpdGNoKG9wKXtcclxuICAgICAgICAgICAgY2FzZSAnYWRkJzpcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdkZWwnOlxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2hhcyc6XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdlcSc6XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAndG9nJzogLy9pZTEw5Lul5LiL5LiN5pSv5oyBXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncmVwJzogLy9zYWZhcmnkuI3mlK/mjIFcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVwbGFjZShvbGRDbGFzcyxjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6IqC5rWBXHJcbiAgICAgKiBAcGFyYW0gZm4gXHJcbiAgICAgKiBAcGFyYW0gdGltZSBcclxuICAgICAqL1xyXG4gICAgdGhyb3R0bGUoZm46IEZ1bmN0aW9uLCB0aW1lOiBudW1iZXIpOkZ1bmN0aW9uIHtcclxuICAgICAgICBsZXQgYm9vbCA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGlmKCFib29sKSByZXR1cm47XHJcbiAgICAgICAgICAgIGJvb2wgPSAhYm9vbDtcclxuICAgICAgICAgICAgZm4uYXBwbHkodGhpcyxhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgICAgICAgICAgICBib29sID0gIWJvb2w7XHJcbiAgICAgICAgICAgIH0sdGltZSlcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHV1aWQ6dXVpZCgpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHV1aWQoKXtcclxuICAgIGxldCBpZCA9IDE7XHJcbiAgICByZXR1cm4gKCk9PntcclxuICAgICAgICByZXR1cm4gaWQrKztcclxuICAgIH1cclxufSJdfQ==

//# sourceMappingURL=screenCapture.js.map
