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
                var imgData = _this2.canvas.toDataURL();
                console.log(imgData);
                if (!_this2.params.copy) {
                    var windowImage = new Image();
                    windowImage.src = imgData;
                    var newWindow = window.open('', '_blank'); //直接新窗口打开
                    newWindow.document.write(windowImage.outerHTML);
                } else {
                    _this2.copying(imgData);
                }
            };
        }
    }, {
        key: "copying",
        value: function copying(imgData) {
            this.params.imgTarget.src = imgData;
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNode(this.params.imgTarget);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
            console.log(selection);
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

},{"./utils":5}],3:[function(require,module,exports){
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
            this.createSelectBox();
            this.createHideImg();
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
         * 创建选择框对象
         */

    }, {
        key: "createSelectBox",
        value: function createSelectBox() {
            this.selectTarget = this.maskTarget.querySelector('.screenCapture-selectbox');
            if (this.selectTarget) return;
            this.selectTarget = document.createElement('div');
            utils_1.default.Class(this.selectTarget, 'add', 'screenCapture-selectbox');
            this.maskTarget.appendChild(this.selectTarget);
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
         * 创建隐藏的img标签
         */

    }, {
        key: "createHideImg",
        value: function createHideImg() {
            this.imgTarget = document.querySelector('.sccreenCapture-hide-img');
            if (this.imgTarget) return;
            this.imgTarget = document.createElement('img');
            utils_1.default.Class(this.imgTarget, 'add', 'sccreenCapture-hide-img');
            document.body.appendChild(this.imgTarget);
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
                imgTarget: this.imgTarget
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
        }
    }]);

    return UI;
}();

exports.default = UI;

},{"./utils":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var UI_1 = require("./UI");
var Painting_1 = require("./Painting");
var Canvas_1 = require("./Canvas");
window.UI = UI_1.default;
window.Painting = Painting_1.default;
window.Canvas = Canvas_1.default;
// export default ScreenCapture;
// export default UI;

},{"./Canvas":1,"./Painting":2,"./UI":3}],5:[function(require,module,exports){
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
    }
};

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvQ2FudmFzLnRzIiwic3JjL3RzL1BhaW50aW5nLnRzIiwic3JjL3RzL1VJLnRzIiwic3JjL3RzL2luZGV4LnRzIiwic3JjL3RzL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQ2dCQTtBQUNBO0FBQ0EsSUFBTSxjQUFlLE9BQWUsV0FBcEM7QUFDQyxRQUFRLEdBQVIsQ0FBWSxXQUFaOztJQUVNLE07QUFJSCxvQkFBWSxNQUFaLEVBQTBCO0FBQUE7O0FBQ3RCLGFBQUssTUFBTCxHQUFjLE1BQWQ7QUFJSDs7OztnQ0FFYyxJLEVBQWE7QUFBQTs7QUFDeEI7Ozs7Ozs7QUFPQSxpQkFBSyxJQUFMLEdBQVksSUFBWjtBQUNBO0FBQ0EsZ0JBQUksU0FBUyxTQUFTLElBQVQsQ0FBYyxZQUEzQjtBQUNBLGdCQUFHLFNBQU8sS0FBSyxNQUFMLENBQVksU0FBdEIsRUFBZ0M7QUFDNUIseUJBQVMsSUFBVCxDQUFjLEtBQWQsQ0FBb0IsTUFBcEIsR0FBNkIsT0FBN0I7QUFDSDtBQUNEO0FBQ0Esd0JBQVksU0FBUyxJQUFyQixFQUEwQjtBQUN0Qix1QkFBTyxTQUFTLElBQVQsQ0FBYyxXQURDO0FBRXRCLHdCQUFRLFNBQVMsSUFBVCxDQUFjO0FBRkEsYUFBMUIsRUFHRyxJQUhILENBR1Esa0JBQVE7QUFDWixzQkFBSyxNQUFMLEdBQWMsTUFBZDtBQUNBO0FBQ0Esb0JBQUksVUFBVSxNQUFLLE1BQUwsQ0FBWSxTQUFaLEVBQWQ7QUFFQTtBQUNBLHNCQUFLLFNBQUwsQ0FBZSxPQUFmO0FBQ0gsYUFWRDtBQVdIO0FBRUQ7Ozs7Ozs7a0NBSWtCLEcsRUFBVztBQUFBOztBQUN6QixnQkFBSSxNQUFNLEtBQUssTUFBTCxDQUFZLFVBQVosQ0FBdUIsSUFBdkIsQ0FBVjtBQUNBLGdCQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLGdCQUFJLFFBQVEsSUFBSSxLQUFK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InNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXHJcbiAqIOe7mOWItmNhbnZhc1xyXG4gKiDpnIDopoHlgJ/liqlodG1sMmNhbnZhc1xyXG4gKi9cclxuaW50ZXJmYWNlIHNpemVJbmZvIHtcclxuICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICBoZWlnaHQ6IG51bWJlcjtcclxuICAgIG9mZnNldFg6IG51bWJlcixcclxuICAgIG9mZnNldFk6IG51bWJlcixcclxufVxyXG5cclxuaW50ZXJmYWNlIHBhcmFtcyB7XHJcbiAgICBtaW5IZWlnaHQ6IG51bWJlcixcclxuICAgIGNvcHk6IEJvb2xlYW4sIC8v6KOB5Ymq5ZCO5piv5ZCm5aSN5Yi25Yiw5Ymq6LS05p2/XHJcbiAgICBpbWdUYXJnZXQ6IEhUTUxJbWFnZUVsZW1lbnRcclxufVxyXG4vLyAgaW1wb3J0IGh0bWwyY2FudmFzIGZyb20gJy4uLy4uL25vZGVfbW9kdWxlcy9odG1sMmNhbnZhcy9kaXN0L3R5cGVzL2luZGV4JztcclxuLy8gIGltcG9ydCBodG1sMmNhbnZhcyBmcm9tICdodG1sMmNhbnZhcyc7XHJcbmNvbnN0IGh0bWwyY2FudmFzID0gKHdpbmRvdyBhcyBhbnkpLmh0bWwyY2FudmFzXHJcbiBjb25zb2xlLmxvZyhodG1sMmNhbnZhcyk7ICAgXHJcblxyXG4gY2xhc3MgQ2FudmFzIHtcclxuICAgIHByaXZhdGUgcGFyYW1zOiBwYXJhbXM7IFxyXG4gICAgcHJpdmF0ZSBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBzaXplOiBzaXplSW5mbztcclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogcGFyYW1zKXtcclxuICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcclxuICAgICAgICBcclxuICAgICAgICBcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNhcHR1cmUoc2l6ZTpzaXplSW5mbyk6dm9pZHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiB0b2RvOlxyXG4gICAgICAgICAqIDEuIOiuvue9ruWuvemrmO+8jOeJueWIq+aYr+mrmOW6puacgOWwj+aYrzEwMHZoXHJcbiAgICAgICAgICogMi4g55SoaHRtbDJjYW52YXPojrflj5bpobXpnaLmiKrlm75cclxuICAgICAgICAgKiAzLiDpgJrov4flrr3pq5jlj4rlgY/np7vliIfovrlcclxuICAgICAgICAgKiA0LiDlho3ovazmiJDlm77niYdcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgICAgIC8vIHRvZG8xOlxyXG4gICAgICAgIGxldCBoZWlnaHQgPSBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodDtcclxuICAgICAgICBpZihoZWlnaHQ8dGhpcy5wYXJhbXMubWluSGVpZ2h0KXtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5oZWlnaHQgPSAnMTAwdmgnO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0b2RvMjpcclxuICAgICAgICBodG1sMmNhbnZhcyhkb2N1bWVudC5ib2R5LHtcclxuICAgICAgICAgICAgd2lkdGg6IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQsXHJcbiAgICAgICAgfSkudGhlbihjYW52YXM9PntcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICAgICAgICAgIC8vIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcclxuICAgICAgICAgICAgbGV0IGltZ0RhdGEgPSB0aGlzLmNhbnZhcy50b0RhdGFVUkwoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHRvZG8zOlxyXG4gICAgICAgICAgICB0aGlzLmRyYXdJbWFnZShpbWdEYXRhKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YiH54mHXHJcbiAgICAgKiBAcGFyYW0gaW1nIFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGRyYXdJbWFnZShpbWc6IHN0cmluZyk6dm9pZCB7XHJcbiAgICAgICAgbGV0IGN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgbGV0IHNpemUgPSB0aGlzLnNpemU7XHJcbiAgICAgICAgbGV0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgaW1hZ2Uuc3JjID0gaW1nO1xyXG4gICAgICAgIGltYWdlLm9ubG9hZCA9ICgpPT57XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gc2l6ZS53aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gc2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1hZ2Usc2l6ZS5vZmZzZXRYLHNpemUub2Zmc2V0WSxzaXplLndpZHRoLHNpemUuaGVpZ2h0LDAsMCxzaXplLndpZHRoLHNpemUuaGVpZ2h0KTtcclxuICAgICAgICAgICAgbGV0IGltZ0RhdGEgPSB0aGlzLmNhbnZhcy50b0RhdGFVUkwoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coaW1nRGF0YSk7XHJcbiAgICAgICAgICAgIGlmKCF0aGlzLnBhcmFtcy5jb3B5KXtcclxuICAgICAgICAgICAgICAgIGxldCB3aW5kb3dJbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93SW1hZ2Uuc3JjID0gaW1nRGF0YTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1dpbmRvdyA9IHdpbmRvdy5vcGVuKCcnLCdfYmxhbmsnKTsgLy/nm7TmjqXmlrDnqpflj6PmiZPlvIBcclxuICAgICAgICAgICAgICAgIG5ld1dpbmRvdy5kb2N1bWVudC53cml0ZSh3aW5kb3dJbWFnZS5vdXRlckhUTUwpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29weWluZyhpbWdEYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNvcHlpbmcoaW1nRGF0YTogc3RyaW5nKTp2b2lkIHtcclxuICAgICAgICB0aGlzLnBhcmFtcy5pbWdUYXJnZXQuc3JjPWltZ0RhdGE7XHJcbiAgICAgICAgbGV0IHNlbGVjdGlvbiA9ICh3aW5kb3cgYXMgYW55KS5nZXRTZWxlY3Rpb24oKTsgXHJcbiAgICAgICAgbGV0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcclxuICAgICAgICByYW5nZS5zZWxlY3ROb2RlKHRoaXMucGFyYW1zLmltZ1RhcmdldCk7XHJcbiAgICAgICAgc2VsZWN0aW9uLnJlbW92ZUFsbFJhbmdlcygpO1xyXG4gICAgICAgIHNlbGVjdGlvbi5hZGRSYW5nZShyYW5nZSk7XHJcbiAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhzZWxlY3Rpb24pO1xyXG4gICAgfVxyXG4gfVxyXG5cclxuIGV4cG9ydCBkZWZhdWx0IENhbnZhczsiLCJpbXBvcnQgdXRpbHMgZnJvbSBcIi4vdXRpbHNcIjtcclxuXHJcbi8qKlxyXG4gKiDnu5jnlLsgLS0g57G7ICjmqKHmi5/mi5bmi73lj4rnoa7lrprlpKflsI/kvY3nva4pXHJcbiAqL1xyXG5pbnRlcmZhY2UgcGFyYW1zIHtcclxuICAgIHRhcmdldDogSFRNTEVsZW1lbnQsXHJcbiAgICBkcmFnaW5nQ2I6IEZ1bmN0aW9uLFxyXG4gICAgZHJhZ0VuZENiOiBGdW5jdGlvbixcclxuICAgIGRyYXdpbmdDYjogRnVuY3Rpb24sXHJcbiAgICBkcmF3RW5kQ2I6IEZ1bmN0aW9uLFxyXG59XHJcbmNsYXNzIFBhaW50aW5nIHtcclxuICAgIHByaXZhdGUgdGFyZ2V0OiBIVE1MRWxlbWVudDsgLy/nu5jnlLvnmoTlr7nosaFcclxuICAgIHByaXZhdGUgZHJhZ2luZ0NiOiBGdW5jdGlvbjsgLy/mi5bmi73kuK3nmoTlm57osINcclxuICAgIHByaXZhdGUgZHJhZ0VuZENiOiBGdW5jdGlvbjsgLy/mi5bmi73nu5PmnZ/nmoTlm57osINcclxuXHJcbiAgICBwcml2YXRlIGRyYXdpbmdDYjogRnVuY3Rpb247IC8v57uY55S75Lit55qE5Zue6LCDXHJcbiAgICBwcml2YXRlIGRyYXdFbmRDYjogRnVuY3Rpb247IC8v57uY55S757uT5p2f55qE5Zue6LCDXHJcblxyXG4gICAgcHJpdmF0ZSBzdGFydFg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHN0YXJ0WTogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgbGFzdFg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIGxhc3RZOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSByYW5nZVg6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHJhbmdlWTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwcml2YXRlIF9kcmFnU3RhcnRIYW5kbGVyOiBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0O1xyXG4gICAgcHJpdmF0ZSBfZHJhZ2luZ0hhbmRsZXI6IEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3Q7XHJcbiAgICBwcml2YXRlIF9kcmFnRW5kSGFuZGxlcjogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdDtcclxuXHJcbiAgICBwcml2YXRlIF9kcmF3U3RhcnRIYW5kbGVyOiBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0O1xyXG4gICAgcHJpdmF0ZSBfZHJhd2luZ0hhbmRsZXI6IEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3Q7XHJcbiAgICBwcml2YXRlIF9kcmF3RW5kSGFuZGxlcjogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXM6IHBhcmFtcyl7IFxyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gcGFyYW1zLnRhcmdldDtcclxuICAgICAgICB0aGlzLmRyYWdpbmdDYiA9IHBhcmFtcy5kcmFnaW5nQ2I7XHJcbiAgICAgICAgdGhpcy5kcmFnRW5kQ2IgPSBwYXJhbXMuZHJhZ0VuZENiO1xyXG4gICAgICAgIHRoaXMuZHJhd2luZ0NiID0gcGFyYW1zLmRyYXdpbmdDYjtcclxuICAgICAgICB0aGlzLmRyYXdFbmRDYiA9IHBhcmFtcy5kcmF3RW5kQ2I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJbmi5bmi73kuovku7ZcclxuICAgICAqL1xyXG4gICAgcHVibGljIGluaXREcmFnKCk6dm9pZCB7XHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLm9uRHJhZ1N0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRDdXJzb3IoYXR0cjogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLnRhcmdldC5zdHlsZS5jdXJzb3IgPSBhdHRyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5ouW5ou9IHN0YXJ0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvbkRyYWdTdGFydCgpOnZvaWQge1xyXG4gICAgICAgIGxldCBfdGhpcz0gIHRoaXM7XHJcbiAgICAgICAgdGhpcy5fZHJhZ1N0YXJ0SGFuZGxlciA9IHRoaXMuZHJhZ1N0YXJ0SGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsdGhpcy5fZHJhZ1N0YXJ0SGFuZGxlcixmYWxzZSk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmFnU3RhcnRIYW5kbGVyKCk6dm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYXJndW1lbnRzKTtcclxuICAgICAgICBsZXQgZTogYW55ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5zZXRDdXJzb3IoJ21vdmUnKTtcclxuICAgICAgICB0aGlzLnN0YXJ0WCA9IGUuY2xpZW50WDtcclxuICAgICAgICB0aGlzLnN0YXJ0WSA9IGUuY2xpZW50WTtcclxuICAgICAgICB0aGlzLm9uRHJhZ2luZygpO1xyXG4gICAgICAgIHRoaXMub25EcmFnRW5kKCk7XHJcbiAgICB9IFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5ouW5ou95LitXHJcbiAgICAgKiBAcGFyYW0gZHJhZ2luZ0NiIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb25EcmFnaW5nKCk6dm9pZCB7XHJcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLnNldEN1cnNvcignbW92ZScpO1xyXG4gICAgICAgIHRoaXMuX2RyYWdpbmdIYW5kbGVyID0gdGhpcy5kcmFnaW5nSGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsdGhpcy5fZHJhZ2luZ0hhbmRsZXIsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYWdpbmdIYW5kbGVyKCk6dm9pZCB7XHJcbiAgICAgICAgbGV0IGU6IGFueSA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGxldCB0aHJvdHRsZUNiIDpGdW5jdGlvbiA9IHV0aWxzLnRocm90dGxlKHRoaXMuZHJhZ2luZ0NiLDEwKTtcclxuICAgICAgICB0aGlzLnJhbmdlWCA9IGUuY2xpZW50WCAtIHRoaXMuc3RhcnRYICsgdGhpcy5sYXN0WDtcclxuICAgICAgICB0aGlzLnJhbmdlWSA9IGUuY2xpZW50WSAtIHRoaXMuc3RhcnRZICsgdGhpcy5sYXN0WTtcclxuICAgICAgICB0aHJvdHRsZUNiKHRoaXMucmFuZ2VYLHRoaXMucmFuZ2VZKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaLluaLvee7k+adn1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb25EcmFnRW5kKCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZHJhZ0VuZEhhbmRsZXIgPSB0aGlzLmRyYWdFbmRIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsdGhpcy5fZHJhZ0VuZEhhbmRsZXIsIGZhbHNlKTtcclxuICAgICAgICB0aGlzLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJyx0aGlzLl9kcmFnRW5kSGFuZGxlciwgZmFsc2UpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhZ0VuZEhhbmRsZXIoKTp2b2lke1xyXG4gICAgICAgIGxldCBlOiBhbnkgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgdGhpcy5sYXN0WCA9IHRoaXMucmFuZ2VYO1xyXG4gICAgICAgIHRoaXMubGFzdFkgPSB0aGlzLnJhbmdlWTtcclxuICAgICAgICB0aGlzLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLHRoaXMuX2RyYWdpbmdIYW5kbGVyLGZhbHNlKTtcclxuICAgICAgICB0aGlzLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJyx0aGlzLl9kcmFnRW5kSGFuZGxlcixmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5kcmFnRW5kQ2IoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMlue7mOeUu+S6i+S7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaW5pdERyYXcoKTp2b2lkIHtcclxuICAgICAgICB0aGlzLm9uRHJhd1N0YXJ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvIDlp4vnu5jnlLtcclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uRHJhd1N0YXJ0KCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5zZXRDdXJzb3IoJ2Nyb3NzaGFpcicpO1xyXG4gICAgICAgIHRoaXMuX2RyYXdTdGFydEhhbmRsZXIgPSB0aGlzLmRyYXdTdGFydEhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLHRoaXMuX2RyYXdTdGFydEhhbmRsZXIsZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd1N0YXJ0SGFuZGxlcigpOnZvaWQge1xyXG4gICAgICAgIGxldCBlOiBhbnkgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnN0YXJ0WCA9IGUuY2xpZW50WDtcclxuICAgICAgICB0aGlzLnN0YXJ0WSA9IGUuY2xpZW50WTtcclxuICAgICAgICB0aGlzLm9uRHJhd2luZygpO1xyXG4gICAgICAgIHRoaXMub25EcmF3RW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnu5jnlLvkuK1cclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uRHJhd2luZygpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuX2RyYXdpbmdIYW5kbGVyID0gdGhpcy5kcmF3aW5nSGFuZGxlci5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsdGhpcy5fZHJhd2luZ0hhbmRsZXIsZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd2luZ0hhbmRsZXIoKTp2b2lkIHtcclxuICAgICAgICBsZXQgZTogYW55ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5yYW5nZVggPSBlLmNsaWVudFggLSB0aGlzLnN0YXJ0WDtcclxuICAgICAgICB0aGlzLnJhbmdlWSA9IGUuY2xpZW50WSAtIHRoaXMuc3RhcnRZO1xyXG4gICAgICAgIC8vIGRlYnVnZ2VyO1xyXG4gICAgICAgIGxldCB0aHJvdHRsZUNiOiBGdW5jdGlvbiA9IHV0aWxzLnRocm90dGxlKHRoaXMuZHJhd2luZ0NiLDEwKTtcclxuICAgICAgICB0aHJvdHRsZUNiKHRoaXMucmFuZ2VYLHRoaXMucmFuZ2VZLHRoaXMuc3RhcnRYLHRoaXMuc3RhcnRZKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOe7mOeUu+e7k+adn1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb25EcmF3RW5kKCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5fZHJhd0VuZEhhbmRsZXIgPSB0aGlzLmRyYXdFbmRIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsdGhpcy5fZHJhd0VuZEhhbmRsZXIsZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhd0VuZEhhbmRsZXIoKTp2b2lkIHtcclxuICAgICAgICB0aGlzLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLHRoaXMuX2RyYXdpbmdIYW5kbGVyLGZhbHNlKTtcclxuICAgICAgICB0aGlzLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJyx0aGlzLl9kcmF3RW5kSGFuZGxlcixmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5kcmF3RW5kQ2IodGhpcy5zdGFydFgsdGhpcy5zdGFydFkpO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBhaW50aW5nOyIsIi8vIFVJ6ZuG5ZCIXHJcblxyXG5pbXBvcnQgdXRpbHMgZnJvbSAnLi91dGlscyc7XHJcblxyXG5jbGFzcyBVSSB7XHJcbiAgICBwdWJsaWMgVUlUYXJnZXQ6IGFueTtcclxuICAgIHByaXZhdGUgbWFza1RhcmdldDogSFRNTEVsZW1lbnQ7IC8v6JKZ5bGC55qEZWxlbWVudOWvueixoVxyXG4gICAgcHJpdmF0ZSBzZWxlY3RUYXJnZXQ6IEhUTUxFbGVtZW50OyAvL+WPr+aLluaLvemAieaLqeahhuWvueixoVxyXG4gICAgcHJpdmF0ZSBudW1iZXJUYXJnZXQ6IEhUTUxFbGVtZW50OyAvL+WuvemrmOaVsOaNruaYvuekuuWMulxyXG4gICAgcHJpdmF0ZSBmdW5jdGlvblZpZXc6IEhUTUxFbGVtZW50OyAvL+WKn+iDveaYvuekuuWMulxyXG4gICAgcHJpdmF0ZSBpbWdUYXJnZXQ6IEhUTUxJbWFnZUVsZW1lbnQ7IC8v6ZqQ6JeP55qEaW1n5qCH562+XHJcbiAgICBwcml2YXRlIHV1aWQ6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKCl7fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yid5aeL5YyWVUnnlYzpnaJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGluaXRVSSh1dWlkOm51bWJlcik6dm9pZHtcclxuICAgICAgICB0aGlzLnV1aWQgPSB1dWlkO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlV3JhcHBlcigpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlU2VsZWN0Qm94KCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVIaWRlSW1nKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVOdW1iZXJWaWV3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rokpnlsYJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVXcmFwcGVyKCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5tYXNrVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnNjcmVlbkNhcHR1cmUtJHt0aGlzLnV1aWR9YCk7XHJcbiAgICAgICAgaWYodGhpcy5tYXNrVGFyZ2V0KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5tYXNrVGFyZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5tYXNrVGFyZ2V0LmNsYXNzTmFtZSA9IGBzY3JlZW5DYXB0dXJlLXdyYXBwZXIgc2NyZWVuQ2FwdHVyZS0ke3RoaXMudXVpZH1gO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5tYXNrVGFyZ2V0KTtcclxuIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu66YCJ5oup5qGG5a+56LGhXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY3JlYXRlU2VsZWN0Qm94KCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RUYXJnZXQgPSB0aGlzLm1hc2tUYXJnZXQucXVlcnlTZWxlY3RvcignLnNjcmVlbkNhcHR1cmUtc2VsZWN0Ym94Jyk7XHJcbiAgICAgICAgaWYodGhpcy5zZWxlY3RUYXJnZXQpIHJldHVybjtcclxuICAgICAgICB0aGlzLnNlbGVjdFRhcmdldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHV0aWxzLkNsYXNzKHRoaXMuc2VsZWN0VGFyZ2V0LCdhZGQnLCdzY3JlZW5DYXB0dXJlLXNlbGVjdGJveCcpO1xyXG4gICAgICAgIHRoaXMubWFza1RhcmdldC5hcHBlbmRDaGlsZCh0aGlzLnNlbGVjdFRhcmdldCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rlrr3pq5jmlbDmja7mmL7npLrljLpcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVOdW1iZXJWaWV3KCk6dm9pZHtcclxuICAgICAgICB0aGlzLm51bWJlclRhcmdldCA9IHRoaXMubWFza1RhcmdldC5xdWVyeVNlbGVjdG9yKCcuc2NyZWVuQ2FwdHVyZS1udW1iZXItdmlldycpO1xyXG4gICAgICAgIGlmKHRoaXMubnVtYmVyVGFyZ2V0KSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMubnVtYmVyVGFyZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdXRpbHMuQ2xhc3ModGhpcy5udW1iZXJUYXJnZXQsJ2FkZCcsJ3NjcmVlbkNhcHR1cmUtbnVtYmVyLXZpZXcnKTtcclxuXHJcbiAgICAgICAgdGhpcy5mdW5jdGlvblZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB1dGlscy5DbGFzcyh0aGlzLmZ1bmN0aW9uVmlldywnYWRkJywnc2NyZWVuQ2FwdHVyZS1zZWxlY3Rib3gnKTtcclxuXHJcbiAgICAgICAgdGhpcy5mdW5jdGlvblZpZXcuaW5uZXJIVE1MID0gYFxyXG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJzY3JlZW5DYXB0dXJlLXctaCBpLWIgdi1tXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY3JlZW5DYXB0dXJlLXdcIj4wPC9zcGFuPiB4IFxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NyZWVuQ2FwdHVyZS1oXCI+MDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwic2NyZWVuQ2FwdHVyZS1mdW5jdGlvbiBpLWIgdi1tXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmdW5jdGlvbi1pdGVtIGZ1bmN0aW9uLWRvb2RsaW5nIHYtbVwiPua2gum4pjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8aW1nIGFsdD1cIuWPlua2iFwiIGNsYXNzPVwiZnVuY3Rpb24tY2xvc2Ugdi1tXCIgc3JjPVwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCa0FBQUFaQ0FZQUFBREU2WVZqQUFBQW5VbEVRVlJJaWUzVU1RNkZNQWdHNEM1MDlnSndkYm1SYnZSTmVwTzZ2VHliWU1IaThCTC90WkF2Sk5DVTN2eE50aWxOandPRllQa2d6Slo2UVdCcjdRa29sR3VoWEh2TmdzRFdXclh4cXJtdEV3UTJJeFpvR09oQllZQUdGY3BiS0hBQnhRSmZpUExlVGhRTEtKTzRWdFlEdEJNTlE5b1dXZS9vTnFDOXV5SHJIUXhCdjgyOU5UMUJDS3ZyOXhZRXR0NkJJTEFidUpQSGdUZWhPUUNTOWVPT09uTUUxUUFBQUFCSlJVNUVya0pnZ2c9PVwiID5cclxuICAgICAgICAgICAgICAgICAgICA8aW1nIGFsdD1cIuWujOaIkFwiIGNsYXNzPVwiZnVuY3Rpb24tc3VjY2VzcyB2LW1cIiBzcmM9XCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJrQUFBQVpDQVlBQUFERTZZVmpBQUFBdUVsRVFWUklpZTNRd1EzQ01Bd0YwSXlRQzFMc1V5NVU5bzFSdWdFZGdSRVloUTFnQTdwQlI2SFhXSlhNQlVGQkJBSWs0dEQrODdlZWJXUG1UQ1k0VkRVSUhaMVFVd1J3UWcwS0t3b3JDTFZGQVJUVzdKZE1BTERxclJOYVcvVzJDR0NNTVNEVVhncmRwMUR5aTFCb055b21ReUM4dWMxUmowTlZSOHRXdlIxZG95amNPU1gvQ3JoZmpQcUZMRmNwaXoxZWRJb05mZzJrUWo4RDc2QnNRQXlDd1B1c1FBVEtEenlIQ2dCWEtOQVdBaCtLQVhQK2tqT3hTdWZIZmF3eWZ3QUFBQUJKUlU1RXJrSmdnZz09XCIgPlxyXG4gICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgdGhpcy5udW1iZXJUYXJnZXQuYXBwZW5kQ2hpbGQodGhpcy5mdW5jdGlvblZpZXcpO1xyXG4gICAgICAgIHRoaXMubWFza1RhcmdldC5hcHBlbmRDaGlsZCh0aGlzLm51bWJlclRhcmdldCk7XHJcbiAgICAgICAgdGhpcy5zZXRVSVRhcmdldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu66ZqQ6JeP55qEaW1n5qCH562+XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY3JlYXRlSGlkZUltZygpOnZvaWQge1xyXG4gICAgICAgIHRoaXMuaW1nVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNjY3JlZW5DYXB0dXJlLWhpZGUtaW1nJyk7XHJcbiAgICAgICAgaWYodGhpcy5pbWdUYXJnZXQpIHJldHVybjtcclxuICAgICAgICB0aGlzLmltZ1RhcmdldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xyXG4gICAgICAgIHV0aWxzLkNsYXNzKHRoaXMuaW1nVGFyZ2V0LCdhZGQnLCdzY2NyZWVuQ2FwdHVyZS1oaWRlLWltZycpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuaW1nVGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiuvue9rlVJVGFyZ2V0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRVSVRhcmdldCgpOnZvaWR7XHJcbiAgICAgICAgdGhpcy5VSVRhcmdldD0ge1xyXG4gICAgICAgICAgICBtYXNrVGFyZ2V0OiB0aGlzLm1hc2tUYXJnZXQsXHJcbiAgICAgICAgICAgIHNlbGVjdFRhcmdldDogdGhpcy5zZWxlY3RUYXJnZXQsXHJcbiAgICAgICAgICAgIG51bWJlclRhcmdldDogdGhpcy5udW1iZXJUYXJnZXQsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uVmlldzogdGhpcy5mdW5jdGlvblZpZXcsXHJcbiAgICAgICAgICAgIGNhcHR1cmVXaWR0aDogdGhpcy5udW1iZXJUYXJnZXQucXVlcnlTZWxlY3RvcignLnNjcmVlbkNhcHR1cmUtdycpLFxyXG4gICAgICAgICAgICBjYXB0dXJlSGVpZ2h0OiB0aGlzLm51bWJlclRhcmdldC5xdWVyeVNlbGVjdG9yKCcuc2NyZWVuQ2FwdHVyZS1oJyksXHJcbiAgICAgICAgICAgIGNhcHR1cmVTdXJlOiB0aGlzLm51bWJlclRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZnVuY3Rpb24tc3VjY2VzcycpLFxyXG4gICAgICAgICAgICBjYXB0dXJlQ2xvc2U6IHRoaXMubnVtYmVyVGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5mdW5jdGlvbi1jbG9zZScpLFxyXG4gICAgICAgICAgICBjYXB0dXJlRG9vZGxpbmc6IHRoaXMubnVtYmVyVGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5mdW5jdGlvbi1kb29kbGluZycpLFxyXG4gICAgICAgICAgICBpbWdUYXJnZXQ6IHRoaXMuaW1nVGFyZ2V0XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pi+56S66JKZ5bGCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzaG93TWFzaygpOnZvaWQge1xyXG4gICAgICAgIHV0aWxzLkNsYXNzKHRoaXMubWFza1RhcmdldCwnYWRkJywnc2NyZWVuQ2FwdHVyZS13cmFwcGVyLXNob3cnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmakOiXj+iSmeWxglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaGlkZU1hc2soKTp2b2lkIHtcclxuICAgICAgICB1dGlscy5DbGFzcyh0aGlzLm1hc2tUYXJnZXQsJ2RlbCcsJ3NjcmVlbkNhcHR1cmUtd3JhcHBlci1zaG93Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmL7npLrkv6Hmga/lip/og73ljLpcclxuICAgICAqIEBwYXJhbSB3aWR0aCBcclxuICAgICAqIEBwYXJhbSBoZWlnaHQgXHJcbiAgICAgKiBAcGFyYW0geCBcclxuICAgICAqIEBwYXJhbSB5IFxyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzaG93RnVuY3Rpb25WaWV3KHdpZHRoOm51bWJlcixoZWlnaHQ6bnVtYmVyLHg6bnVtYmVyLHk6bnVtYmVyKTp2b2lkIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiB0b2RvOlxyXG4gICAgICAgICAqIDEuIOe7mSBudW1iZXJUYXJnZXTorr7nva7lrr3pq5jlkozkvY3nva5cclxuICAgICAgICAgKiAyLiDmmL7npLogZnVuY3Rpb25WaWV3XHJcbiAgICAgICAgICogMy4g5Yik5patZnVuY3Rpb25WaWV355qE5L2N572u5pyJ5rKh5pyJ6LaF5Ye6XHJcbiAgICAgICAgICogNC4g5pi+56S65a696auY5Y+C5pWwXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYod2lkdGg8PTAgfHwgaGVpZ2h0PD0wKSByZXR1cm47IC8v55uu5YmN5Y+q5pSv5oyB5bemLT7lj7PvvIzkuIotPuS4i+iuvue9ruS9jee9ruWSjOWuvemrmFxyXG4gICAgICAgIC8vdG9kbzE6XHJcbiAgICAgICAgdGhpcy5udW1iZXJUYXJnZXQuc3R5bGUuY3NzVGV4dCA9IGBcclxuICAgICAgICAgICAgd2lkdGg6JHt3aWR0aH1weDtcclxuICAgICAgICAgICAgaGVpZ2h0OiAke2hlaWdodH1weDtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoJHt4fXB4LCR7eX1weCk7XHJcbiAgICAgICAgYDtcclxuICAgICAgICAvLyB0b2RvMjpcclxuICAgICAgICB1dGlscy5DbGFzcyh0aGlzLmZ1bmN0aW9uVmlldywnYWRkJywnc2NyZWVuQ2FwdHVyZS1zZWxlY3Rib3gtc2hvdycpO1xyXG4gICAgICAgIC8vIHRvZG8zOlxyXG4gICAgICAgIGxldCBvZmZzZXRXaWR0aDogbnVtYmVyID0gdGhpcy5mdW5jdGlvblZpZXcub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgbGV0IG9mZnNldEhlaWdodDogbnVtYmVyID0gdGhpcy5mdW5jdGlvblZpZXcub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgIGlmKG9mZnNldFdpZHRoPngpe1xyXG4gICAgICAgICAgICB0aGlzLmZ1bmN0aW9uVmlldy5zdHlsZS5sZWZ0PScwcHgnO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhvZmZzZXRIZWlnaHQreSx0aGlzLm1hc2tUYXJnZXQub2Zmc2V0SGVpZ2h0KVxyXG4gICAgICAgIGlmKG9mZnNldEhlaWdodCt5Pj10aGlzLm1hc2tUYXJnZXQub2Zmc2V0SGVpZ2h0KXtcclxuICAgICAgICAgICAgdGhpcy5mdW5jdGlvblZpZXcuc3R5bGUudG9wID0gJzBweCc7XHJcbiAgICAgICAgfSBcclxuICAgICAgICAvLyB0b2RvNDpcclxuICAgICAgICB0aGlzLlVJVGFyZ2V0LmNhcHR1cmVXaWR0aC5pbm5lclRleHQgPSB3aWR0aDtcclxuICAgICAgICB0aGlzLlVJVGFyZ2V0LmNhcHR1cmVIZWlnaHQuaW5uZXJUZXh0ID0gaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6+572u5Yeg5L2V5L+h5oGvKOS9jee9ruWSjOWkp+WwjylcclxuICAgICAqIEBwYXJhbSB3aWR0aCBcclxuICAgICAqIEBwYXJhbSBoZWlnaHQgXHJcbiAgICAgKiBAcGFyYW0geCBcclxuICAgICAqIEBwYXJhbSB5IFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0Vmlld0xheW91dCh3aWR0aDpudW1iZXIsaGVpZ2h0Om51bWJlcix4Om51bWJlcix5Om51bWJlcik6dm9pZCB7XHJcbiAgICAgICAgaWYod2lkdGg8PTAgfHwgaGVpZ2h0PD0wKSByZXR1cm47IC8v55uu5YmN5Y+q5pSv5oyB5bemLT7lj7PvvIzkuIotPuS4i+iuvue9ruS9jee9ruWSjOWuvemrmFxyXG4gICAgICAgIHRoaXMubnVtYmVyVGFyZ2V0LnN0eWxlLmNzc1RleHQgPSBgXHJcbiAgICAgICAgICAgIHdpZHRoOiR7d2lkdGh9cHg7XHJcbiAgICAgICAgICAgIGhlaWdodDogJHtoZWlnaHR9cHg7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKCR7eH1weCwke3l9cHgpO1xyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpmpDol4/pgInmi6nmoYZcclxuICAgICAqL1xyXG4gICAgcHVibGljIGhpZGVWaWV3TGF5b3V0KCl7XHJcbiAgICAgICAgdGhpcy5udW1iZXJUYXJnZXQuc3R5bGUuY3NzVGV4dCA9IGBcclxuICAgICAgICAgICAgd2lkdGg6MHB4O1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDBweDtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTk5OXB4LC05OTlweCk7XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBVSTsgIiwiaW1wb3J0IFNjcmVlbkNhcHR1cmUgZnJvbSAnLi9zY3JlZW5DYXB0dXJlJztcclxuaW1wb3J0IFVJIGZyb20gJy4vVUknO1xyXG5pbXBvcnQgUGFpbnRpbmcgZnJvbSAnLi9QYWludGluZyc7XHJcbmltcG9ydCBDYW52YXMgZnJvbSAnLi9DYW52YXMnO1xyXG5cclxuKHdpbmRvdyBhcyBhbnkpLlVJID0gVUk7XHJcbih3aW5kb3cgYXMgYW55KS5QYWludGluZyA9IFBhaW50aW5nO1xyXG4od2luZG93IGFzIGFueSkuQ2FudmFzID0gQ2FudmFzO1xyXG4vLyBleHBvcnQgZGVmYXVsdCBTY3JlZW5DYXB0dXJlO1xyXG4vLyBleHBvcnQgZGVmYXVsdCBVSTsgIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBjc3MgY2xhc3Mg5pON5L2cXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0IOWvueixoVxyXG4gICAgICogQHBhcmFtIG9wIOa3u+WKoChhZGQp77yMIOWIoOmZpChkZWwp77yMIOWMheWQqyhoYXMp77yMIOetieS6jihlcSksIOWIh+aNoih0b2cp77yMIOabv+aNoihyZXApXHJcbiAgICAgKiBAcGFyYW0gY2xhc3NOYW1lIFxyXG4gICAgICogQHBhcmFtIG9sZENsYXNzIFxyXG4gICAgICovXHJcbiAgICBDbGFzcyh0YXJnZXQ6IGFueSxvcDpTdHJpbmc9J2FkZCcsY2xhc3NOYW1lPzpTdHJpbmcsb2xkQ2xhc3M/OlN0cmluZyk6YW55e1xyXG4gICAgICAgIGxldCByZXN1bHQ6IGFueTtcclxuICAgICAgICBzd2l0Y2gob3Ape1xyXG4gICAgICAgICAgICBjYXNlICdhZGQnOlxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2RlbCc6XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaGFzJzpcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2VxJzpcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICd0b2cnOiAvL2llMTDku6XkuIvkuI3mlK/mjIFcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdyZXAnOiAvL3NhZmFyaeS4jeaUr+aMgVxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZXBsYWNlKG9sZENsYXNzLGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoioLmtYFcclxuICAgICAqIEBwYXJhbSBmbiBcclxuICAgICAqIEBwYXJhbSB0aW1lIFxyXG4gICAgICovXHJcbiAgICB0aHJvdHRsZShmbjogRnVuY3Rpb24sIHRpbWU6IG51bWJlcik6RnVuY3Rpb24ge1xyXG4gICAgICAgIGxldCBib29sID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgaWYoIWJvb2wpIHJldHVybjtcclxuICAgICAgICAgICAgYm9vbCA9ICFib29sO1xyXG4gICAgICAgICAgICBmbi5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICAgICAgICAgIGJvb2wgPSAhYm9vbDtcclxuICAgICAgICAgICAgfSx0aW1lKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==

//# sourceMappingURL=screenCapture.js.map
