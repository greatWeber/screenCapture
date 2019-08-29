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
                var imgData = _this.canvas.toDataURL();
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
            windowImage.src = this.canvas.toDataURL();
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
            downloadTarget.href = this.canvas.toDataURL();
            downloadTarget.download = new Date().getTime() + '.png';
            downloadTarget.click();
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
            this.dragEndCb();
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
                downloadTarget: this.downloadTarget
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
            }
            // console.log(offsetHeight+y,this.maskTarget.offsetHeight)
            if (offsetHeight + y >= this.maskTarget.offsetHeight) {
                this.functionView.style.top = '0px';
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
            this.numberTarget.style.cssText = "\n            width:0px;\n            height: 0px;\n            transform: translate(-999px,-999px);\n        ";
            utils_1.default.Class(this.functionView, 'del', 'screenCapture-selectbox-show');
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
            keyCode: 66
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
        value: function dragEndCb() {}
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
                UITarget: this.UIInstance.UITarget
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
        }
        /**
         * 监听键盘事件
         */

    }, {
        key: "keydownHandler",
        value: function keydownHandler() {
            var _this = this;

            document.addEventListener('keydown', function (e) {
                console.log(_this.options);
                var ctrl = e.ctrlKey || e.metaKey;
                var keyCode = e.keyCode || e.which || e.charCode;
                if (ctrl && keyCode == _this.options.keyCode) {
                    // 显示蒙层
                    e.preventDefault();
                    _this.UIInstance.showMask();
                }
            }, false);
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
                _this3.UIInstance.hideMask();
                _this3.UIInstance.hideViewLayout();
            }, false);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvQ2FudmFzLnRzIiwic3JjL3RzL1BhaW50aW5nLnRzIiwic3JjL3RzL1VJLnRzIiwic3JjL3RzL2luZGV4LnRzIiwic3JjL3RzL3NjcmVlbkNhcHR1cmUudHMiLCJzcmMvdHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FDZ0JBO0FBQ0E7QUFDQSxJQUFNLGNBQWUsT0FBZSxXQUFwQztBQUNDLFFBQVEsR0FBUixDQUFZLFdBQVo7O0lBRU0sTTtBQUlILG9CQUFZLE1BQVosRUFBMEI7QUFBQTs7QUFDdEIsYUFBSyxNQUFMLEdBQWMsTUFBZDtBQUlIOzs7O2dDQUVjLEksRUFBYTtBQUFBOztBQUN4Qjs7Ozs7OztBQU9BLGlCQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0E7QUFDQSxnQkFBSSxTQUFTLFNBQVMsSUFBVCxDQUFjLFlBQTNCO0FBQ0EsZ0JBQUcsU0FBTyxLQUFLLE1BQUwsQ0FBWSxTQUF0QixFQUFnQztBQUM1Qix5QkFBUyxJQUFULENBQWMsS0FBZCxDQUFvQixNQUFwQixHQUE2QixPQUE3QjtBQUNIO0FBQ0Q7QUFDQSx3QkFBWSxTQUFTLElBQXJCLEVBQTBCO0FBQ3RCLHVCQUFPLFNBQVMsSUFBVCxDQUFjLFdBREM7QUFFdEIsd0JBQVEsU0FBUyxJQUFULENBQWM7QUFGQSxhQUExQixFQUdHLElBSEgsQ0FHUSxrQkFBUTtBQUNaLHNCQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0E7QUFDQSxvQkFBSSxVQUFVLE1BQUssTUFBTCxDQUFZLFNBQVosRUFBZDtBQUVBO0FBQ0Esc0JBQUssU0FBTCxDQUFlLE9BQWY7QUFDSCxhQVZEO0FBV0g7QUFFRDs7Ozs7OztrQ0FJa0IsRyxFQUFXO0FBQUE7O0FBQ3pCLGdCQUFJLE1BQU0sS0FBSyxNQUFMLENBQVksVUFBWixDQUF1QixJQUF2QixDQUFWO0FBQ0EsZ0JBQUksT0FBTyxLQUFLLElBQWhC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Ozs7QUFLQSxZQXJDVyxvQkFxQ0YsRUFyQ0UsRUFxQ1ksSUFyQ1osRUFxQ3dCO0FBQy9CLFlBQUksT0FBTyxJQUFYO0FBQ0EsZUFBTyxZQUFBO0FBQ0gsZ0JBQUcsQ0FBQyxJQUFKLEVBQVU7QUFDVixtQkFBTyxDQUFDLElBQVI7QUFDQSxlQUFHLEtBQUgsQ0FBUyxJQUFULEVBQWMsU0FBZDtBQUNBLHVCQUFXLFlBQUk7QUFDWCx1QkFBTyxDQUFDLElBQVI7QUFDSCxhQUZELEVBRUUsSUFGRjtBQUdILFNBUEQ7QUFRSCxLQS9DVTs7QUFpRFgsVUFBSztBQWpETSxDQUFmO0FBb0RBLFNBQVMsSUFBVCxHQUFhO0FBQ1QsUUFBSSxLQUFLLENBQVQ7QUFDQSxXQUFPLFlBQUk7QUFDUCxlQUFPLElBQVA7QUFDSCxLQUZEO0FBR0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcclxuICog57uY5Yi2Y2FudmFzXHJcbiAqIOmcgOimgeWAn+WKqWh0bWwyY2FudmFzXHJcbiAqL1xyXG5pbnRlcmZhY2Ugc2l6ZUluZm8ge1xyXG4gICAgd2lkdGg6IG51bWJlcixcclxuICAgIGhlaWdodDogbnVtYmVyO1xyXG4gICAgb2Zmc2V0WDogbnVtYmVyLFxyXG4gICAgb2Zmc2V0WTogbnVtYmVyLFxyXG59XHJcblxyXG5pbnRlcmZhY2UgcGFyYW1zIHtcclxuICAgIG1pbkhlaWdodDogbnVtYmVyLFxyXG4gICAgY29weVR5cGU6IHN0cmluZywgLy/oo4HliarlkI7nmoTnsbvlnovmk43kvZw6IGFsbD3lvLnnqpfvvJtfYmxhbms95paw56qX5Y+j5omT5byA77ybZG93bmxvYWQ955u05o6l5LiL6L29XHJcbiAgICBVSVRhcmdldDogYW55XHJcbn1cclxuLy8gIGltcG9ydCBodG1sMmNhbnZhcyBmcm9tICcuLi8uLi9ub2RlX21vZHVsZXMvaHRtbDJjYW52YXMvZGlzdC90eXBlcy9pbmRleCc7XHJcbi8vICBpbXBvcnQgaHRtbDJjYW52YXMgZnJvbSAnaHRtbDJjYW52YXMnO1xyXG5jb25zdCBodG1sMmNhbnZhcyA9ICh3aW5kb3cgYXMgYW55KS5odG1sMmNhbnZhc1xyXG4gY29uc29sZS5sb2coaHRtbDJjYW52YXMpOyAgIFxyXG5cclxuIGNsYXNzIENhbnZhcyB7XHJcbiAgICBwcml2YXRlIHBhcmFtczogcGFyYW1zOyBcclxuICAgIHByaXZhdGUgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHByaXZhdGUgc2l6ZTogc2l6ZUluZm87XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXM6IHBhcmFtcyl7XHJcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjYXB0dXJlKHNpemU6c2l6ZUluZm8pOnZvaWR7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogdG9kbzpcclxuICAgICAgICAgKiAxLiDorr7nva7lrr3pq5jvvIznibnliKvmmK/pq5jluqbmnIDlsI/mmK8xMDB2aFxyXG4gICAgICAgICAqIDIuIOeUqGh0bWwyY2FudmFz6I635Y+W6aG16Z2i5oiq5Zu+XHJcbiAgICAgICAgICogMy4g6YCa6L+H5a696auY5Y+K5YGP56e75YiH6L65XHJcbiAgICAgICAgICogNC4g5YaN6L2s5oiQ5Zu+54mHXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgICAgICAvLyB0b2RvMTpcclxuICAgICAgICBsZXQgaGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgaWYoaGVpZ2h0PHRoaXMucGFyYW1zLm1pbkhlaWdodCl7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuaGVpZ2h0ID0gJzEwMHZoJztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdG9kbzI6XHJcbiAgICAgICAgaHRtbDJjYW52YXMoZG9jdW1lbnQuYm9keSx7XHJcbiAgICAgICAgICAgIHdpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0LFxyXG4gICAgICAgIH0pLnRoZW4oY2FudmFzPT57XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xyXG4gICAgICAgICAgICAvLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XHJcbiAgICAgICAgICAgIGxldCBpbWdEYXRhID0gdGhpcy5jYW52YXMudG9EYXRhVVJMKCk7XHJcblxyXG4gICAgICAgICAgICAvLyB0b2RvMzpcclxuICAgICAgICAgICAgdGhpcy5kcmF3SW1hZ2UoaW1nRGF0YSk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIh+eJh1xyXG4gICAgICogQHBhcmFtIGltZyBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBkcmF3SW1hZ2UoaW1nOiBzdHJpbmcpOnZvaWQge1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIGxldCBzaXplID0gdGhpcy5zaXplO1xyXG4gICAgICAgIGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIGltYWdlLnNyYyA9IGltZztcclxuICAgICAgICBpbWFnZS5vbmxvYWQgPSAoKT0+e1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHNpemUud2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHNpemUuaGVpZ2h0O1xyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltYWdlLHNpemUub2Zmc2V0WCxzaXplLm9mZnNldFksc2l6ZS53aWR0aCxzaXplLmhlaWdodCwwLDAsc2l6ZS53aWR0aCxzaXplLmhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvcHlTd2l0Y2goKTsgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDkv53lrZjnmoTmlrnlvI9cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjb3B5U3dpdGNoKCk6dm9pZHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnBhcmFtcy5jb3B5VHlwZSk7XHJcbiAgICAgICAgc3dpdGNoKHRoaXMucGFyYW1zLmNvcHlUeXBlKXtcclxuICAgICAgICAgICAgY2FzZSAnYWxsJzpcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ19ibGFuayc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsYW5rQ29weSgpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnZG93bmxvYWQnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5kb3dubG9hZENvcHkoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaWsOeql+WPo+aJk+W8gFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGJsYW5rQ29weSgpOnZvaWR7XHJcblxyXG4gICAgICAgIGxldCB3aW5kb3dJbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIHdpbmRvd0ltYWdlLnNyYyA9IHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpO1xyXG4gICAgICAgIGNvbnN0IG5ld1dpbmRvdyA9IHdpbmRvdy5vcGVuKCcnLCdfYmxhbmsnKTsgLy/nm7TmjqXmlrDnqpflj6PmiZPlvIBcclxuICAgICAgICBuZXdXaW5kb3cuZG9jdW1lbnQud3JpdGUod2luZG93SW1hZ2Uub3V0ZXJIVE1MKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOebtOaOpeS4i+i9vVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZG93bmxvYWRDb3B5KCk6dm9pZHtcclxuICAgICAgICBsZXQgZG93bmxvYWRUYXJnZXQgPSB0aGlzLnBhcmFtcy5VSVRhcmdldC5kb3dubG9hZFRhcmdldDtcclxuICAgICAgICBkb3dubG9hZFRhcmdldC5ocmVmID0gdGhpcy5jYW52YXMudG9EYXRhVVJMKCk7XHJcbiAgICAgICAgZG93bmxvYWRUYXJnZXQuZG93bmxvYWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArJy5wbmcnO1xyXG4gICAgICAgIGRvd25sb2FkVGFyZ2V0LmNsaWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiB9XHJcblxyXG4gZXhwb3J0IGRlZmF1bHQgQ2FudmFzOyIsImltcG9ydCB1dGlscyBmcm9tIFwiLi91dGlsc1wiO1xyXG5cclxuLyoqXHJcbiAqIOe7mOeUuyAtLSDnsbsgKOaooeaLn+aLluaLveWPiuehruWumuWkp+Wwj+S9jee9rilcclxuICovXHJcbmludGVyZmFjZSBwYXJhbXMge1xyXG4gICAgdGFyZ2V0OiBIVE1MRWxlbWVudCxcclxuICAgIGRyYWdpbmdDYj86IEZ1bmN0aW9uLFxyXG4gICAgZHJhZ0VuZENiPzogRnVuY3Rpb24sXHJcbiAgICBkcmF3aW5nQ2I/OiBGdW5jdGlvbixcclxuICAgIGRyYXdFbmRDYj86IEZ1bmN0aW9uLCBcclxufVxyXG5jbGFzcyBQYWludGluZyB7XHJcbiAgICBwcml2YXRlIHRhcmdldDogSFRNTEVsZW1lbnQ7IC8v57uY55S755qE5a+56LGhXHJcbiAgICBwcml2YXRlIGRyYWdpbmdDYjogRnVuY3Rpb247IC8v5ouW5ou95Lit55qE5Zue6LCDXHJcbiAgICBwcml2YXRlIGRyYWdFbmRDYjogRnVuY3Rpb247IC8v5ouW5ou957uT5p2f55qE5Zue6LCDXHJcblxyXG4gICAgcHJpdmF0ZSBkcmF3aW5nQ2I6IEZ1bmN0aW9uOyAvL+e7mOeUu+S4reeahOWbnuiwg1xyXG4gICAgcHJpdmF0ZSBkcmF3RW5kQ2I6IEZ1bmN0aW9uOyAvL+e7mOeUu+e7k+adn+eahOWbnuiwg1xyXG5cclxuICAgIHByaXZhdGUgc3RhcnRYOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBzdGFydFk6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIGxhc3RYOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBsYXN0WTogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgcmFuZ2VYOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSByYW5nZVk6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBfZHJhZ1N0YXJ0SGFuZGxlcjogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdDtcclxuICAgIHByaXZhdGUgX2RyYWdpbmdIYW5kbGVyOiBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0O1xyXG4gICAgcHJpdmF0ZSBfZHJhZ0VuZEhhbmRsZXI6IEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3Q7XHJcblxyXG4gICAgcHJpdmF0ZSBfZHJhd1N0YXJ0SGFuZGxlcjogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdDtcclxuICAgIHByaXZhdGUgX2RyYXdpbmdIYW5kbGVyOiBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0O1xyXG4gICAgcHJpdmF0ZSBfZHJhd0VuZEhhbmRsZXI6IEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3Q7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyYW1zOiBwYXJhbXMpeyBcclxuICAgICAgICB0aGlzLnRhcmdldCA9IHBhcmFtcy50YXJnZXQ7XHJcbiAgICAgICAgdGhpcy5kcmFnaW5nQ2IgPSBwYXJhbXMuZHJhZ2luZ0NiO1xyXG4gICAgICAgIHRoaXMuZHJhZ0VuZENiID0gcGFyYW1zLmRyYWdFbmRDYjtcclxuICAgICAgICB0aGlzLmRyYXdpbmdDYiA9IHBhcmFtcy5kcmF3aW5nQ2I7XHJcbiAgICAgICAgdGhpcy5kcmF3RW5kQ2IgPSBwYXJhbXMuZHJhd0VuZENiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yid5aeL5YyW5ouW5ou95LqL5Lu2XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbml0RHJhZygpOnZvaWQge1xyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy5vbkRyYWdTdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Q3Vyc29yKGF0dHI6IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy50YXJnZXQuc3R5bGUuY3Vyc29yID0gYXR0cjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaLluaLvSBzdGFydFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb25EcmFnU3RhcnQoKTp2b2lkIHtcclxuICAgICAgICBsZXQgX3RoaXM9ICB0aGlzO1xyXG4gICAgICAgIHRoaXMuX2RyYWdTdGFydEhhbmRsZXIgPSB0aGlzLmRyYWdTdGFydEhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLHRoaXMuX2RyYWdTdGFydEhhbmRsZXIsZmFsc2UpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhZ1N0YXJ0SGFuZGxlcigpOnZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgbGV0IGU6IGFueSA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2V0Q3Vyc29yKCdtb3ZlJyk7XHJcbiAgICAgICAgdGhpcy5zdGFydFggPSBlLmNsaWVudFg7XHJcbiAgICAgICAgdGhpcy5zdGFydFkgPSBlLmNsaWVudFk7XHJcbiAgICAgICAgdGhpcy5vbkRyYWdpbmcoKTtcclxuICAgICAgICB0aGlzLm9uRHJhZ0VuZCgpO1xyXG4gICAgfSBcclxuXHJcbiAgICAvKipcclxuICAgICAqIOaLluaLveS4rVxyXG4gICAgICogQHBhcmFtIGRyYWdpbmdDYiBcclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uRHJhZ2luZygpOnZvaWQge1xyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5zZXRDdXJzb3IoJ21vdmUnKTtcclxuICAgICAgICB0aGlzLl9kcmFnaW5nSGFuZGxlciA9IHRoaXMuZHJhZ2luZ0hhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLHRoaXMuX2RyYWdpbmdIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmFnaW5nSGFuZGxlcigpOnZvaWQge1xyXG4gICAgICAgIGxldCBlOiBhbnkgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBsZXQgdGhyb3R0bGVDYiA6RnVuY3Rpb24gPSB1dGlscy50aHJvdHRsZSh0aGlzLmRyYWdpbmdDYiwxMCk7XHJcbiAgICAgICAgdGhpcy5yYW5nZVggPSBlLmNsaWVudFggLSB0aGlzLnN0YXJ0WCArIHRoaXMubGFzdFg7XHJcbiAgICAgICAgdGhpcy5yYW5nZVkgPSBlLmNsaWVudFkgLSB0aGlzLnN0YXJ0WSArIHRoaXMubGFzdFk7XHJcbiAgICAgICAgdGhyb3R0bGVDYih0aGlzLnJhbmdlWCx0aGlzLnJhbmdlWSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmi5bmi73nu5PmnZ9cclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uRHJhZ0VuZCgpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuX2RyYWdFbmRIYW5kbGVyID0gdGhpcy5kcmFnRW5kSGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLHRoaXMuX2RyYWdFbmRIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsdGhpcy5fZHJhZ0VuZEhhbmRsZXIsIGZhbHNlKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYWdFbmRIYW5kbGVyKCk6dm9pZHtcclxuICAgICAgICBsZXQgZTogYW55ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIHRoaXMubGFzdFggPSB0aGlzLnJhbmdlWDtcclxuICAgICAgICB0aGlzLmxhc3RZID0gdGhpcy5yYW5nZVk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJyx0aGlzLl9kcmFnaW5nSGFuZGxlcixmYWxzZSk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsdGhpcy5fZHJhZ0VuZEhhbmRsZXIsZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuZHJhZ0VuZENiKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJbnu5jnlLvkuovku7ZcclxuICAgICAqL1xyXG4gICAgcHVibGljIGluaXREcmF3KCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5vbkRyYXdTdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5byA5aeL57uY55S7XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvbkRyYXdTdGFydCgpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuc2V0Q3Vyc29yKCdjcm9zc2hhaXInKTtcclxuICAgICAgICB0aGlzLl9kcmF3U3RhcnRIYW5kbGVyID0gdGhpcy5kcmF3U3RhcnRIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJyx0aGlzLl9kcmF3U3RhcnRIYW5kbGVyLGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdTdGFydEhhbmRsZXIoKTp2b2lkIHtcclxuICAgICAgICBsZXQgZTogYW55ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5zdGFydFggPSBlLmNsaWVudFg7XHJcbiAgICAgICAgdGhpcy5zdGFydFkgPSBlLmNsaWVudFk7XHJcbiAgICAgICAgdGhpcy5vbkRyYXdpbmcoKTtcclxuICAgICAgICB0aGlzLm9uRHJhd0VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog57uY55S75LitXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvbkRyYXdpbmcoKTp2b2lkIHtcclxuICAgICAgICB0aGlzLl9kcmF3aW5nSGFuZGxlciA9IHRoaXMuZHJhd2luZ0hhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLHRoaXMuX2RyYXdpbmdIYW5kbGVyLGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdpbmdIYW5kbGVyKCk6dm9pZCB7XHJcbiAgICAgICAgbGV0IGU6IGFueSA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIHRoaXMucmFuZ2VYID0gZS5jbGllbnRYIC0gdGhpcy5zdGFydFg7XHJcbiAgICAgICAgdGhpcy5yYW5nZVkgPSBlLmNsaWVudFkgLSB0aGlzLnN0YXJ0WTtcclxuICAgICAgICAvLyBkZWJ1Z2dlcjtcclxuICAgICAgICBsZXQgdGhyb3R0bGVDYjogRnVuY3Rpb24gPSB1dGlscy50aHJvdHRsZSh0aGlzLmRyYXdpbmdDYiwxMCk7XHJcbiAgICAgICAgdGhyb3R0bGVDYih0aGlzLnJhbmdlWCx0aGlzLnJhbmdlWSx0aGlzLnN0YXJ0WCx0aGlzLnN0YXJ0WSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnu5jnlLvnu5PmnZ9cclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uRHJhd0VuZCgpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuX2RyYXdFbmRIYW5kbGVyID0gdGhpcy5kcmF3RW5kSGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLHRoaXMuX2RyYXdFbmRIYW5kbGVyLGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYXdFbmRIYW5kbGVyKCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJyx0aGlzLl9kcmF3aW5nSGFuZGxlcixmYWxzZSk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsdGhpcy5fZHJhd0VuZEhhbmRsZXIsZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuZHJhd0VuZENiKHRoaXMuc3RhcnRYLHRoaXMuc3RhcnRZKTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQYWludGluZzsiLCIvLyBVSembhuWQiFxyXG5cclxuaW1wb3J0IHV0aWxzIGZyb20gJy4vdXRpbHMnO1xyXG5cclxuY2xhc3MgVUkge1xyXG4gICAgcHVibGljIFVJVGFyZ2V0OiBhbnk7XHJcbiAgICBwcml2YXRlIG1hc2tUYXJnZXQ6IEhUTUxFbGVtZW50OyAvL+iSmeWxgueahGVsZW1lbnTlr7nosaFcclxuICAgIHByaXZhdGUgc2VsZWN0VGFyZ2V0OiBIVE1MRWxlbWVudDsgLy/lj6/mi5bmi73pgInmi6nmoYblr7nosaFcclxuICAgIHByaXZhdGUgbnVtYmVyVGFyZ2V0OiBIVE1MRWxlbWVudDsgLy/lrr3pq5jmlbDmja7mmL7npLrljLpcclxuICAgIHByaXZhdGUgZnVuY3Rpb25WaWV3OiBIVE1MRWxlbWVudDsgLy/lip/og73mmL7npLrljLpcclxuICAgIHByaXZhdGUgaW1nVGFyZ2V0OiBIVE1MSW1hZ2VFbGVtZW50OyAvL+makOiXj+eahGltZ+agh+etvlxyXG4gICAgcHJpdmF0ZSBwb3B1cFRhcmdldDogSFRNTEVsZW1lbnQ7IC8vcG9wdXDlr7nosaFcclxuICAgIHByaXZhdGUgZG93bmxvYWRUYXJnZXQ6IEhUTUxFbGVtZW50OyAvL+S4i+i9veeUqOWIsOeahGHmoIfnrb5cclxuICAgIHByaXZhdGUgdXVpZDogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IoKXt9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJZVSeeVjOmdolxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaW5pdFVJKHV1aWQ6bnVtYmVyKTp2b2lke1xyXG4gICAgICAgIHRoaXMudXVpZCA9IHV1aWQ7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVXcmFwcGVyKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQb3B1cCgpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRG93bmxvYWQoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZU51bWJlclZpZXcoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuiSmeWxglxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNyZWF0ZVdyYXBwZXIoKTp2b2lkIHtcclxuICAgICAgICB0aGlzLm1hc2tUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuc2NyZWVuQ2FwdHVyZS0ke3RoaXMudXVpZH1gKTtcclxuICAgICAgICBpZih0aGlzLm1hc2tUYXJnZXQpIHJldHVybjtcclxuICAgICAgICB0aGlzLm1hc2tUYXJnZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB0aGlzLm1hc2tUYXJnZXQuY2xhc3NOYW1lID0gYHNjcmVlbkNhcHR1cmUtd3JhcHBlciBzY3JlZW5DYXB0dXJlLSR7dGhpcy51dWlkfWA7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm1hc2tUYXJnZXQpO1xyXG4gXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu6cG9wdXDlvLnnqpdcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVQb3B1cCgpOnZvaWQge1xyXG4gICAgICAgIHRoaXMucG9wdXBUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2NjcmVlbkNhcHR1cmUtaGlkZS1pbWcnKTtcclxuICAgICAgICBpZih0aGlzLnBvcHVwVGFyZ2V0KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wb3B1cFRhcmdldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMucG9wdXBUYXJnZXQuY2xhc3NOYW1lID0gJ3NjcmVlbkNhcHR1cmUtcG9wdXAgZmxleCBhbGlnbi1jZW50ZXIgZmxleC1jZW50ZXInO1xyXG4gICAgICAgIC8vIHV0aWxzLkNsYXNzKHRoaXMucG9wdXBUYXJnZXQsJ2FkZCcsJycpO1xyXG4gICAgICAgIHRoaXMucG9wdXBUYXJnZXQuaW5uZXJIVE1MID0gYFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwb3B1cC13cmFwcGVyIFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicG9wdXAtaGVhZGVyIGZsZXggc3BhY2UtYmV0d2VlblwiPlxyXG5cclxuICAgICAgICAgICAgICAgIDxoMiBjbGFzcz1cInBvcHVwLXRpdGxlXCI+5Zu+54mH5oiq5Zu+PC9oMj5cclxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJwb3B1cC1jbG9zZVwiIHNyYz1cImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQmtBQUFBWkNBWUFBQURFNllWakFBQUF3VWxFUVZSSWlkM1Z3UTNDTUF5RjRYK0Vqc0FJR2FHamRBUFlnRzRBRzhCbzNZQnVFQzZKVkNFN3NaTndnQ2Y1VU1uT0Y3VktBLythRTNBRlFzUHNCSnpUR21vQzhBSmlxc1VCbUdlM1E1TUgrZ1JpZWhhekMwZ05rb0NZMWhLektJZ0dhVUQxRFZpaFpzQUtkUU1XYUFoZ2dZWUFIcWdMeUZrTHdITUVVUHJJdVc3ZkJuSTlSZ1BhbjhFRjFjNUI2SVdzQjYwWjhwN2tFclJxeU9ZQUxKQjQ4VW5OSmFBR2ljaHlhTmlOZ0FiZFM4MHpjS0Z5VHl1WjBzYm1odGtmeVJ0U1o5VkZmd0haRWdBQUFBQkpSVTVFcmtKZ2dnPT1cIiBhbHQ9XCJcIj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxpbWcgc3JjPVwiXCIgYWx0PVwi5oiq5Zu+XCIgY2xhc3M9XCJwb3B1cC1jb250ZW50LWltZ1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicG9wdXAtZm9vdGVyIGZsZXggc3BhY2UtYmV0d2VlbiBhbGlnbi1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwicG9wdXAtdGlwXCI+dGlwczog5Y+z5Ye75Zu+54mH6YCJ5oup5aSN5Yi25Zu+5YOP77yM5Y+v5Lul5ou36LSd5Yiw5b6u5L+h5ZKMUVHova/ku7bkuK0gXi5ePC9wPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInBvcHVwLWRvd25sb2FkXCI+ZG93bmxvYWQ8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnBvcHVwVGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuS4i+i9vemcgOimgeeUqOWIsOeahOagh+etvlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNyZWF0ZURvd25sb2FkKCk6dm9pZHtcclxuICAgICAgICB0aGlzLmRvd25sb2FkVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNjcmVlbkNhcHR1cmUtZG93bmxvYWQtaHJlZicpO1xyXG4gICAgICAgIGlmKHRoaXMuZG93bmxvYWRUYXJnZXQpIHJldHVybjtcclxuICAgICAgICB0aGlzLmRvd25sb2FkVGFyZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgIHV0aWxzLkNsYXNzKHRoaXMuZG93bmxvYWRUYXJnZXQsJ2FkZCcsJ3NjcmVlbkNhcHR1cmUtZG93bmxvYWQtaHJlZicpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb3dubG9hZFRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rlrr3pq5jmlbDmja7mmL7npLrljLpcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVOdW1iZXJWaWV3KCk6dm9pZHtcclxuICAgICAgICB0aGlzLm51bWJlclRhcmdldCA9IHRoaXMubWFza1RhcmdldC5xdWVyeVNlbGVjdG9yKCcuc2NyZWVuQ2FwdHVyZS1udW1iZXItdmlldycpO1xyXG4gICAgICAgIGlmKHRoaXMubnVtYmVyVGFyZ2V0KSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMubnVtYmVyVGFyZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdXRpbHMuQ2xhc3ModGhpcy5udW1iZXJUYXJnZXQsJ2FkZCcsJ3NjcmVlbkNhcHR1cmUtbnVtYmVyLXZpZXcnKTtcclxuXHJcbiAgICAgICAgdGhpcy5mdW5jdGlvblZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB1dGlscy5DbGFzcyh0aGlzLmZ1bmN0aW9uVmlldywnYWRkJywnc2NyZWVuQ2FwdHVyZS1zZWxlY3Rib3gnKTtcclxuXHJcbiAgICAgICAgdGhpcy5mdW5jdGlvblZpZXcuaW5uZXJIVE1MID0gYFxyXG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJzY3JlZW5DYXB0dXJlLXctaCBpLWIgdi1tXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY3JlZW5DYXB0dXJlLXdcIj4wPC9zcGFuPiB4IFxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NyZWVuQ2FwdHVyZS1oXCI+MDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwic2NyZWVuQ2FwdHVyZS1mdW5jdGlvbiBpLWIgdi1tXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmdW5jdGlvbi1pdGVtIGZ1bmN0aW9uLWRvb2RsaW5nIHYtbVwiPua2gum4pjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8aW1nIGFsdD1cIuWPlua2iFwiIGNsYXNzPVwiZnVuY3Rpb24tY2xvc2Ugdi1tXCIgc3JjPVwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCa0FBQUFaQ0FZQUFBREU2WVZqQUFBQW5VbEVRVlJJaWUzVU1RNkZNQWdHNEM1MDlnSndkYm1SYnZSTmVwTzZ2VHliWU1IaThCTC90WkF2Sk5DVTN2eE50aWxOandPRllQa2d6Slo2UVdCcjdRa29sR3VoWEh2TmdzRFdXclh4cXJtdEV3UTJJeFpvR09oQllZQUdGY3BiS0hBQnhRSmZpUExlVGhRTEtKTzRWdFlEdEJNTlE5b1dXZS9vTnFDOXV5SHJIUXhCdjgyOU5UMUJDS3ZyOXhZRXR0NkJJTEFidUpQSGdUZWhPUUNTOWVPT09uTUUxUUFBQUFCSlJVNUVya0pnZ2c9PVwiID5cclxuICAgICAgICAgICAgICAgICAgICA8aW1nIGFsdD1cIuWujOaIkFwiIGNsYXNzPVwiZnVuY3Rpb24tc3VjY2VzcyB2LW1cIiBzcmM9XCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJrQUFBQVpDQVlBQUFERTZZVmpBQUFBdUVsRVFWUklpZTNRd1EzQ01Bd0YwSXlRQzFMc1V5NVU5bzFSdWdFZGdSRVloUTFnQTdwQlI2SFhXSlhNQlVGQkJBSWs0dEQrODdlZWJXUG1UQ1k0VkRVSUhaMVFVd1J3UWcwS0t3b3JDTFZGQVJUVzdKZE1BTERxclJOYVcvVzJDR0NNTVNEVVhncmRwMUR5aTFCb055b21ReUM4dWMxUmowTlZSOHRXdlIxZG95amNPU1gvQ3JoZmpQcUZMRmNwaXoxZWRJb05mZzJrUWo4RDc2QnNRQXlDd1B1c1FBVEtEenlIQ2dCWEtOQVdBaCtLQVhQK2tqT3hTdWZIZmF3eWZ3QUFBQUJKUlU1RXJrSmdnZz09XCIgPlxyXG4gICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgdGhpcy5udW1iZXJUYXJnZXQuYXBwZW5kQ2hpbGQodGhpcy5mdW5jdGlvblZpZXcpO1xyXG4gICAgICAgIHRoaXMubWFza1RhcmdldC5hcHBlbmRDaGlsZCh0aGlzLm51bWJlclRhcmdldCk7XHJcbiAgICAgICAgdGhpcy5zZXRVSVRhcmdldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6+572uVUlUYXJnZXRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldFVJVGFyZ2V0KCk6dm9pZHtcclxuICAgICAgICB0aGlzLlVJVGFyZ2V0PSB7XHJcbiAgICAgICAgICAgIG1hc2tUYXJnZXQ6IHRoaXMubWFza1RhcmdldCxcclxuICAgICAgICAgICAgc2VsZWN0VGFyZ2V0OiB0aGlzLnNlbGVjdFRhcmdldCxcclxuICAgICAgICAgICAgbnVtYmVyVGFyZ2V0OiB0aGlzLm51bWJlclRhcmdldCxcclxuICAgICAgICAgICAgZnVuY3Rpb25WaWV3OiB0aGlzLmZ1bmN0aW9uVmlldyxcclxuICAgICAgICAgICAgY2FwdHVyZVdpZHRoOiB0aGlzLm51bWJlclRhcmdldC5xdWVyeVNlbGVjdG9yKCcuc2NyZWVuQ2FwdHVyZS13JyksXHJcbiAgICAgICAgICAgIGNhcHR1cmVIZWlnaHQ6IHRoaXMubnVtYmVyVGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5zY3JlZW5DYXB0dXJlLWgnKSxcclxuICAgICAgICAgICAgY2FwdHVyZVN1cmU6IHRoaXMubnVtYmVyVGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5mdW5jdGlvbi1zdWNjZXNzJyksXHJcbiAgICAgICAgICAgIGNhcHR1cmVDbG9zZTogdGhpcy5udW1iZXJUYXJnZXQucXVlcnlTZWxlY3RvcignLmZ1bmN0aW9uLWNsb3NlJyksXHJcbiAgICAgICAgICAgIGNhcHR1cmVEb29kbGluZzogdGhpcy5udW1iZXJUYXJnZXQucXVlcnlTZWxlY3RvcignLmZ1bmN0aW9uLWRvb2RsaW5nJyksXHJcbiAgICAgICAgICAgIGltZ1RhcmdldDogdGhpcy5wb3B1cFRhcmdldC5xdWVyeVNlbGVjdG9yKCcucG9wdXAtY29udGVudC1pbWcnKSwgXHJcbiAgICAgICAgICAgIGRvd25sb2FkVGFyZ2V0OiB0aGlzLmRvd25sb2FkVGFyZ2V0LCBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmL7npLrokpnlsYJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNob3dNYXNrKCk6dm9pZCB7XHJcbiAgICAgICAgdXRpbHMuQ2xhc3ModGhpcy5tYXNrVGFyZ2V0LCdhZGQnLCdzY3JlZW5DYXB0dXJlLXdyYXBwZXItc2hvdycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6ZqQ6JeP6JKZ5bGCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBoaWRlTWFzaygpOnZvaWQge1xyXG4gICAgICAgIHV0aWxzLkNsYXNzKHRoaXMubWFza1RhcmdldCwnZGVsJywnc2NyZWVuQ2FwdHVyZS13cmFwcGVyLXNob3cnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaYvuekuuS/oeaBr+WKn+iDveWMulxyXG4gICAgICogQHBhcmFtIHdpZHRoIFxyXG4gICAgICogQHBhcmFtIGhlaWdodCBcclxuICAgICAqIEBwYXJhbSB4IFxyXG4gICAgICogQHBhcmFtIHkgXHJcbiAgICAgKiBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNob3dGdW5jdGlvblZpZXcod2lkdGg6bnVtYmVyLGhlaWdodDpudW1iZXIseDpudW1iZXIseTpudW1iZXIpOnZvaWQge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHRvZG86XHJcbiAgICAgICAgICogMS4g57uZIG51bWJlclRhcmdldOiuvue9ruWuvemrmOWSjOS9jee9rlxyXG4gICAgICAgICAqIDIuIOaYvuekuiBmdW5jdGlvblZpZXdcclxuICAgICAgICAgKiAzLiDliKTmlq1mdW5jdGlvblZpZXfnmoTkvY3nva7mnInmsqHmnInotoXlh7pcclxuICAgICAgICAgKiA0LiDmmL7npLrlrr3pq5jlj4LmlbBcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZih3aWR0aDw9MCB8fCBoZWlnaHQ8PTApIHJldHVybjsgLy/nm67liY3lj6rmlK/mjIHlt6YtPuWPs++8jOS4ii0+5LiL6K6+572u5L2N572u5ZKM5a696auYXHJcbiAgICAgICAgLy90b2RvMTpcclxuICAgICAgICB0aGlzLm51bWJlclRhcmdldC5zdHlsZS5jc3NUZXh0ID0gYFxyXG4gICAgICAgICAgICB3aWR0aDoke3dpZHRofXB4O1xyXG4gICAgICAgICAgICBoZWlnaHQ6ICR7aGVpZ2h0fXB4O1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgke3h9cHgsJHt5fXB4KTtcclxuICAgICAgICBgO1xyXG4gICAgICAgIC8vIHRvZG8yOlxyXG4gICAgICAgIHV0aWxzLkNsYXNzKHRoaXMuZnVuY3Rpb25WaWV3LCdhZGQnLCdzY3JlZW5DYXB0dXJlLXNlbGVjdGJveC1zaG93Jyk7XHJcbiAgICAgICAgLy8gdG9kbzM6XHJcbiAgICAgICAgbGV0IG9mZnNldFdpZHRoOiBudW1iZXIgPSB0aGlzLmZ1bmN0aW9uVmlldy5vZmZzZXRXaWR0aDtcclxuICAgICAgICBsZXQgb2Zmc2V0SGVpZ2h0OiBudW1iZXIgPSB0aGlzLmZ1bmN0aW9uVmlldy5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgaWYob2Zmc2V0V2lkdGg+eCl7XHJcbiAgICAgICAgICAgIHRoaXMuZnVuY3Rpb25WaWV3LnN0eWxlLmxlZnQ9JzBweCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG9mZnNldEhlaWdodCt5LHRoaXMubWFza1RhcmdldC5vZmZzZXRIZWlnaHQpXHJcbiAgICAgICAgaWYob2Zmc2V0SGVpZ2h0K3k+PXRoaXMubWFza1RhcmdldC5vZmZzZXRIZWlnaHQpe1xyXG4gICAgICAgICAgICB0aGlzLmZ1bmN0aW9uVmlldy5zdHlsZS50b3AgPSAnMHB4JztcclxuICAgICAgICB9IFxyXG4gICAgICAgIC8vIHRvZG80OlxyXG4gICAgICAgIHRoaXMuVUlUYXJnZXQuY2FwdHVyZVdpZHRoLmlubmVyVGV4dCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuVUlUYXJnZXQuY2FwdHVyZUhlaWdodC5pbm5lclRleHQgPSBoZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7lh6DkvZXkv6Hmga8o5L2N572u5ZKM5aSn5bCPKVxyXG4gICAgICogQHBhcmFtIHdpZHRoIFxyXG4gICAgICogQHBhcmFtIGhlaWdodCBcclxuICAgICAqIEBwYXJhbSB4IFxyXG4gICAgICogQHBhcmFtIHkgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRWaWV3TGF5b3V0KHdpZHRoOm51bWJlcixoZWlnaHQ6bnVtYmVyLHg6bnVtYmVyLHk6bnVtYmVyKTp2b2lkIHtcclxuICAgICAgICBpZih3aWR0aDw9MCB8fCBoZWlnaHQ8PTApIHJldHVybjsgLy/nm67liY3lj6rmlK/mjIHlt6YtPuWPs++8jOS4ii0+5LiL6K6+572u5L2N572u5ZKM5a696auYXHJcbiAgICAgICAgdGhpcy5udW1iZXJUYXJnZXQuc3R5bGUuY3NzVGV4dCA9IGBcclxuICAgICAgICAgICAgd2lkdGg6JHt3aWR0aH1weDtcclxuICAgICAgICAgICAgaGVpZ2h0OiAke2hlaWdodH1weDtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoJHt4fXB4LCR7eX1weCk7XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmakOiXj+mAieaLqeahhlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaGlkZVZpZXdMYXlvdXQoKXtcclxuICAgICAgICB0aGlzLm51bWJlclRhcmdldC5zdHlsZS5jc3NUZXh0ID0gYFxyXG4gICAgICAgICAgICB3aWR0aDowcHg7XHJcbiAgICAgICAgICAgIGhlaWdodDogMHB4O1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtOTk5cHgsLTk5OXB4KTtcclxuICAgICAgICBgO1xyXG4gICAgICAgIHV0aWxzLkNsYXNzKHRoaXMuZnVuY3Rpb25WaWV3LCdkZWwnLCdzY3JlZW5DYXB0dXJlLXNlbGVjdGJveC1zaG93Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgIFxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFVJOyAiLCJpbXBvcnQgU2NyZWVuQ2FwdHVyZSBmcm9tICcuL3NjcmVlbkNhcHR1cmUnO1xyXG5pbXBvcnQgVUkgZnJvbSAnLi9VSSc7XHJcbmltcG9ydCBQYWludGluZyBmcm9tICcuL1BhaW50aW5nJztcclxuaW1wb3J0IENhbnZhcyBmcm9tICcuL0NhbnZhcyc7XHJcblxyXG4od2luZG93IGFzIGFueSkuVUkgPSBVSTtcclxuKHdpbmRvdyBhcyBhbnkpLlBhaW50aW5nID0gUGFpbnRpbmc7XHJcbih3aW5kb3cgYXMgYW55KS5DYW52YXMgPSBDYW52YXM7XHJcbih3aW5kb3cgYXMgYW55KS5TY3JlZW5DYXB0dXJlID0gU2NyZWVuQ2FwdHVyZTtcclxuLy8gZXhwb3J0IGRlZmF1bHQgU2NyZWVuQ2FwdHVyZTtcclxuLy8gZXhwb3J0IGRlZmF1bHQgVUk7ICIsIi8qKlxyXG4gKiDmoLjlv4PnsbsgLS0g6L+e5o6lVUkuanPlkoxDYW52YXMuanNcclxuICovXHJcblxyXG5pbXBvcnQgVUkgZnJvbSAnLi9VSSc7XHJcbmltcG9ydCBDYW52YXMgZnJvbSAnLi9DYW52YXMnO1xyXG5pbXBvcnQgUGFpbnRpbmcgZnJvbSAnLi9QYWludGluZyc7XHJcbmltcG9ydCB1dGlscyBmcm9tICcuL3V0aWxzJztcclxuXHJcbi8vIOmFjee9ruWPguaVsFxyXG5pbnRlcmZhY2Ugb3B0aW9ucyB7XHJcbiAgICBjb3B5VHlwZT86IHN0cmluZyxcclxuICAgIGtleUNvZGU/OiBudW1iZXJ8c3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcmVlbkNhcHR1cmUge1xyXG4gICAgcHJpdmF0ZSBvcHRpb25zOm9wdGlvbnM7XHJcbiAgICBwcml2YXRlIFVJSW5zdGFuY2U6IFVJOyAvL3Vp5a6e5L6LXHJcbiAgICBwcml2YXRlIERyYWdJbnN0YW5jZTogUGFpbnRpbmc7IC8v5ouW5ou95a6e5L6LXHJcbiAgICBwcml2YXRlIERyYXdJbnN0YW5jZTogUGFpbnRpbmc7IC8v57uY55S75a6e5L6LXHJcbiAgICBwcml2YXRlIENhbnZhc0luc3RhbmNlOiBDYW52YXM7IC8vY2FudmFz5a6e5L6LXHJcblxyXG4gICAgcHJpdmF0ZSB3aWR0aDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgaGVpZ2h0OiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBvZmZzZXRYOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBvZmZzZXRZOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6b3B0aW9ucyl7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIGNvcHlUeXBlOiAnYWxsJyxcclxuICAgICAgICAgICAga2V5Q29kZTogNjZcclxuICAgICAgICB9LG9wdGlvbnMpIDsgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlhazlvIDnmoRpbml05pa55rOVXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbml0KCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbml0VUkoKTtcclxuICAgICAgICB0aGlzLmluaXREcmFnKCk7XHJcbiAgICAgICAgdGhpcy5pbml0RHJhdygpO1xyXG4gICAgICAgIHRoaXMuaW5pdENhbnZhcygpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMllVJ57G7XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdFVJKCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5VSUluc3RhbmNlID0gbmV3IFVJKCk7IFxyXG4gICAgICAgIHRoaXMuVUlJbnN0YW5jZS5pbml0VUkodXRpbHMudXVpZCgpKTsgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJbmi5bmi73lrp7kvotcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbml0RHJhZygpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuRHJhZ0luc3RhbmNlID0gbmV3IFBhaW50aW5nKHtcclxuICAgICAgICAgICAgdGFyZ2V0OiB0aGlzLlVJSW5zdGFuY2UuVUlUYXJnZXQubnVtYmVyVGFyZ2V0LFxyXG4gICAgICAgICAgICBkcmFnaW5nQ2I6IHRoaXMuZHJhZ2luZ0NiLFxyXG4gICAgICAgICAgICBkcmFnRW5kQ2I6IHRoaXMuZHJhZ0VuZENiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5EcmFnSW5zdGFuY2UuaW5pdERyYWcoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiDmi5bmi73kuK3nmoTlm57osINcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBkcmFnaW5nQ2IoeDpudW1iZXIseTpudW1iZXIpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuVUlJbnN0YW5jZS5zZXRWaWV3TGF5b3V0KHRoaXMud2lkdGgsdGhpcy5oZWlnaHQseCx5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaLluaLvee7k+adn+WQjueahOWbnuiwgyBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBkcmFnRW5kQ2IoKTp2b2lkIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJbnu5jnlLvnsbtcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpbml0RHJhdygpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuZHJhd2luZ0NiID0gdGhpcy5kcmF3aW5nQ2IuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmRyYXdFbmRDYiA9IHRoaXMuZHJhd0VuZENiLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5EcmF3SW5zdGFuY2UgPSBuZXcgUGFpbnRpbmcoe1xyXG4gICAgICAgICAgICB0YXJnZXQ6IHRoaXMuVUlJbnN0YW5jZS5VSVRhcmdldC5tYXNrVGFyZ2V0LFxyXG4gICAgICAgICAgICBkcmF3aW5nQ2I6IHRoaXMuZHJhd2luZ0NiLFxyXG4gICAgICAgICAgICBkcmF3RW5kQ2I6IHRoaXMuZHJhd0VuZENiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5EcmF3SW5zdGFuY2UuaW5pdERyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOe7mOeUu+S4reeahOWbnuiwg1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGRyYXdpbmdDYih3Om51bWJlcixoOm51bWJlcix4Om51bWJlcix5Om51bWJlcik6dm9pZCB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHc7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoO1xyXG4gICAgICAgIHRoaXMuVUlJbnN0YW5jZS5zZXRWaWV3TGF5b3V0KHcsaCx4LHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog57uY55S757uT5p2f5ZCO55qE5Zue6LCDXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZHJhd0VuZENiKHg6bnVtYmVyLHk6bnVtYmVyKTp2b2lkIHtcclxuICAgICAgICB0aGlzLm9mZnNldFggPSB4O1xyXG4gICAgICAgIHRoaXMub2Zmc2V0WSA9IHk7XHJcbiAgICAgICAgdGhpcy5VSUluc3RhbmNlLnNob3dGdW5jdGlvblZpZXcodGhpcy53aWR0aCx0aGlzLmhlaWdodCx4LHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yid5aeL5YyWY2FudmFzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdENhbnZhcygpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuQ2FudmFzSW5zdGFuY2UgPSBuZXcgQ2FudmFzKHtcclxuICAgICAgICAgICAgbWluSGVpZ2h0OiB0aGlzLlVJSW5zdGFuY2UuVUlUYXJnZXQubWFza1RhcmdldC5jbGllbnRIZWlnaHQsXHJcbiAgICAgICAgICAgIGNvcHlUeXBlOiB0aGlzLm9wdGlvbnMuY29weVR5cGUsXHJcbiAgICAgICAgICAgIFVJVGFyZ2V0OiB0aGlzLlVJSW5zdGFuY2UuVUlUYXJnZXRcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yid5aeL5YyW5LqL5Lu2XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdEV2ZW50cygpOnZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLmtleWRvd25IYW5kbGVyKCk7XHJcbiAgICAgICAgdGhpcy5jYXB0dXJlU3VyZUhhbmRsZXIoKTtcclxuICAgICAgICB0aGlzLmNhcHR1cmVDbG9zZUhhbmRsZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOebkeWQrOmUruebmOS6i+S7tiAgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUga2V5ZG93bkhhbmRsZXIoKTp2b2lke1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLChlKT0+e1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm9wdGlvbnMpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IGN0cmwgPSBlLmN0cmxLZXkgfHwgZS5tZXRhS2V5O1xyXG4gICAgICAgICAgICBsZXQga2V5Q29kZSA9IGUua2V5Q29kZSB8fGUud2hpY2ggfHwgZS5jaGFyQ29kZTtcclxuICAgICAgICAgICAgaWYoY3RybCYma2V5Q29kZSA9PSB0aGlzLm9wdGlvbnMua2V5Q29kZSl7XHJcbiAgICAgICAgICAgICAgICAvLyDmmL7npLrokpnlsYJcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuVUlJbnN0YW5jZS5zaG93TWFzaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxmYWxzZSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOeCueWHu+ehruiupOaIquWbvlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNhcHR1cmVTdXJlSGFuZGxlcigpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuVUlJbnN0YW5jZS5VSVRhcmdldC5jYXB0dXJlU3VyZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGUpPT57XHJcbiAgICAgICAgICAgIHRoaXMuVUlJbnN0YW5jZS5oaWRlTWFzaygpO1xyXG4gICAgICAgICAgICB0aGlzLlVJSW5zdGFuY2UuaGlkZVZpZXdMYXlvdXQoKTtcclxuICAgICAgICAgICAgdGhpcy5DYW52YXNJbnN0YW5jZS5jYXB0dXJlKHtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIG9mZnNldFg6dGhpcy5vZmZzZXRYLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0WTogdGhpcy5vZmZzZXRZXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSxmYWxzZSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWPlua2iOaIquWbvlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGNhcHR1cmVDbG9zZUhhbmRsZXIoKTp2b2lkIHtcclxuICAgICAgICB0aGlzLlVJSW5zdGFuY2UuVUlUYXJnZXQuY2FwdHVyZUNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZSk9PntcclxuICAgICAgICAgICAgdGhpcy5VSUluc3RhbmNlLmhpZGVNYXNrKCk7XHJcbiAgICAgICAgICAgIHRoaXMuVUlJbnN0YW5jZS5oaWRlVmlld0xheW91dCgpO1xyXG4gICAgICAgIH0sZmFsc2UpXHJcbiAgICB9XHJcblxyXG5cclxufSIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgIC8qKlxyXG4gICAgICogY3NzIGNsYXNzIOaTjeS9nFxyXG4gICAgICogQHBhcmFtIHRhcmdldCDlr7nosaFcclxuICAgICAqIEBwYXJhbSBvcCDmt7vliqAoYWRkKe+8jCDliKDpmaQoZGVsKe+8jCDljIXlkKsoaGFzKe+8jCDnrYnkuo4oZXEpLCDliIfmjaIodG9nKe+8jCDmm7/mjaIocmVwKVxyXG4gICAgICogQHBhcmFtIGNsYXNzTmFtZSBcclxuICAgICAqIEBwYXJhbSBvbGRDbGFzcyBcclxuICAgICAqL1xyXG4gICAgQ2xhc3ModGFyZ2V0OiBhbnksb3A6U3RyaW5nPSdhZGQnLGNsYXNzTmFtZT86U3RyaW5nLG9sZENsYXNzPzpTdHJpbmcpOmFueXtcclxuICAgICAgICBsZXQgcmVzdWx0OiBhbnk7XHJcbiAgICAgICAgc3dpdGNoKG9wKXtcclxuICAgICAgICAgICAgY2FzZSAnYWRkJzpcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdkZWwnOlxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2hhcyc6XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdlcSc6XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAndG9nJzogLy9pZTEw5Lul5LiL5LiN5pSv5oyBXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncmVwJzogLy9zYWZhcmnkuI3mlK/mjIFcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVwbGFjZShvbGRDbGFzcyxjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6IqC5rWBXHJcbiAgICAgKiBAcGFyYW0gZm4gXHJcbiAgICAgKiBAcGFyYW0gdGltZSBcclxuICAgICAqL1xyXG4gICAgdGhyb3R0bGUoZm46IEZ1bmN0aW9uLCB0aW1lOiBudW1iZXIpOkZ1bmN0aW9uIHtcclxuICAgICAgICBsZXQgYm9vbCA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGlmKCFib29sKSByZXR1cm47XHJcbiAgICAgICAgICAgIGJvb2wgPSAhYm9vbDtcclxuICAgICAgICAgICAgZm4uYXBwbHkodGhpcyxhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgICAgICAgICAgICBib29sID0gIWJvb2w7XHJcbiAgICAgICAgICAgIH0sdGltZSlcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHV1aWQ6dXVpZCgpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHV1aWQoKXtcclxuICAgIGxldCBpZCA9IDE7XHJcbiAgICByZXR1cm4gKCk9PntcclxuICAgICAgICByZXR1cm4gaWQrKztcclxuICAgIH1cclxufSJdfQ==

//# sourceMappingURL=screenCapture.js.map
