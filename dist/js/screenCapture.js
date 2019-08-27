(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
    }]);

    return Painting;
}();

exports.default = Painting;

},{"./utils":4}],2:[function(require,module,exports){
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
                captureDoodling: this.numberTarget.querySelector('.function-doodling')
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
             */
            this.numberTarget.style.cssText = "\n            width:" + width + "px;\n            height: " + height + "px;\n            transform: translate(" + x + "px," + y + "px);\n        ";
            utils_1.default.Class(this.functionView, 'add', 'screenCapture-selectbox-show');
            var offsetWidth = this.functionView.offsetWidth;
            var offsetHeight = this.functionView.offsetHeight;
            if (offsetWidth > x) {
                this.functionView.style.left = '0px';
            }
            console.log(offsetHeight + y, this.maskTarget.offsetHeight);
            if (offsetHeight + y >= this.maskTarget.offsetHeight) {
                this.functionView.style.top = '0px';
            }
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
            this.numberTarget.style.cssText = "\n            width:" + width + "px;\n            height: " + height + "px;\n            transform: translate(" + x + "px," + y + "px);\n        ";
        }
    }]);

    return UI;
}();

exports.default = UI;

},{"./utils":4}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var UI_1 = require("./UI");
var Painting_1 = require("./Painting");
window.UI = UI_1.default;
window.Painting = Painting_1.default;
// export default ScreenCapture;
// export default UI;

},{"./Painting":1,"./UI":2}],4:[function(require,module,exports){
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

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvUGFpbnRpbmcudHMiLCJzcmMvdHMvVUkudHMiLCJzcmMvdHMvaW5kZXgudHMiLCJzcmMvdHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FDQUEsSUFBQSxVQUFBLFFBQUEsU0FBQSxDQUFBOztJQVVNLFE7QUFjRixzQkFBWSxNQUFaLEVBQTBCO0FBQUE7O0FBVmxCLGFBQUEsTUFBQSxHQUFpQixDQUFqQjtBQUNBLGFBQUEsTUFBQSxHQUFpQixDQUFqQjtBQUNBLGFBQUEsS0FBQSxHQUFnQixDQUFoQjtBQUNBLGFBQUEsS0FBQSxHQUFnQixDQUFoQjtBQUNBLGFBQUEsTUFBQSxHQUFpQixDQUFqQjtBQUNBLGFBQUEsTUFBQSxHQUFpQixDQUFqQjtBQU1KLGFBQUssTUFBTCxHQUFjLE9BQU8sTUFBckI7QUFDQSxhQUFLLFNBQUwsR0FBaUIsT0FBTyxTQUF4QjtBQUNBLGFBQUssU0FBTCxHQUFpQixPQUFPLFNBQXhCO0FBQ0g7QUFFRDs7Ozs7OzttQ0FHZTtBQUVYLGlCQUFLLFdBQUw7QUFDSDs7O2tDQUVpQixJLEVBQVk7QUFDMUIsaUJBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsTUFBbEIsR0FBMkIsSUFBM0I7QUFDSDtBQUVEOzs7Ozs7c0NBR2tCO0FBQ2QsZ0JBQUksUUFBUSxJQUFaO0FBQ0EsaUJBQUssaUJBQUwsR0FBeUIsS0FBSyxnQkFBTCxDQUFzQixJQUF0QixDQUEyQixJQUEzQixDQUF6QjtBQUNBLGlCQUFLLE1BQUwsQ0FBWSxnQkFBWixDQUE2QixXQUE3QixFQUF5QyxLQUFLLGlCQUE5QyxFQUFnRSxLQUFoRTtBQUVIOzs7MkNBRXVCO0FBQ3BCLG9CQUFRLEdBQVIsQ0FBWSxTQUFaO0FBQ0EsZ0JBQUksSUFBUyxVQUFVLENBQVYsQ0FBYjtBQUNBLGNBQUUsZUFBRjtBQUNBLGlCQUFLLFNBQUwsQ0FBZSxNQUFmO0FBQ0Es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QUZELEVBRUUsSUFGRjtBQUdILFNBUEQ7QUFRSDtBQS9DVSxDQUFmIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHV0aWxzIGZyb20gXCIuL3V0aWxzXCI7XHJcblxyXG4vKipcclxuICog57uY55S7IC0tIOexuyAo5qih5ouf5ouW5ou95Y+K56Gu5a6a5aSn5bCP5L2N572uKVxyXG4gKi9cclxuaW50ZXJmYWNlIHBhcmFtcyB7XHJcbiAgICB0YXJnZXQ6IEhUTUxFbGVtZW50LFxyXG4gICAgZHJhZ2luZ0NiOiBGdW5jdGlvbixcclxuICAgIGRyYWdFbmRDYjogRnVuY3Rpb25cclxufVxyXG5jbGFzcyBQYWludGluZyB7XHJcbiAgICBwcml2YXRlIHRhcmdldDogSFRNTEVsZW1lbnQ7IC8v57uY55S755qE5a+56LGhXHJcbiAgICBwcml2YXRlIGRyYWdpbmdDYjogRnVuY3Rpb247IC8v5ouW5ou95Lit55qE5Zue6LCDXHJcbiAgICBwcml2YXRlIGRyYWdFbmRDYjogRnVuY3Rpb247IC8v5ouW5ou957uT5p2f55qE5Zue6LCDXHJcbiAgICBwcml2YXRlIHN0YXJ0WDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgc3RhcnRZOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBsYXN0WDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgbGFzdFk6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHJhbmdlWDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgcmFuZ2VZOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfZHJhZ1N0YXJ0SGFuZGxlcjogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdDtcclxuICAgIHByaXZhdGUgX2RyYWdpbmdIYW5kbGVyOiBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0O1xyXG4gICAgcHJpdmF0ZSBfZHJhZ0VuZEhhbmRsZXI6IEV2ZW50TGlzdGVuZXJPckV2ZW50TGlzdGVuZXJPYmplY3Q7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyYW1zOiBwYXJhbXMpeyBcclxuICAgICAgICB0aGlzLnRhcmdldCA9IHBhcmFtcy50YXJnZXQ7XHJcbiAgICAgICAgdGhpcy5kcmFnaW5nQ2IgPSBwYXJhbXMuZHJhZ2luZ0NiO1xyXG4gICAgICAgIHRoaXMuZHJhZ0VuZENiID0gcGFyYW1zLmRyYWdFbmRDYjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMluaLluaLveS6i+S7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaW5pdERyYWcoKTp2b2lkIHtcclxuICAgICAgIFxyXG4gICAgICAgIHRoaXMub25EcmFnU3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEN1cnNvcihhdHRyOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LnN0eWxlLmN1cnNvciA9IGF0dHI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmi5bmi70gc3RhcnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uRHJhZ1N0YXJ0KCk6dm9pZCB7XHJcbiAgICAgICAgbGV0IF90aGlzPSAgdGhpcztcclxuICAgICAgICB0aGlzLl9kcmFnU3RhcnRIYW5kbGVyID0gdGhpcy5kcmFnU3RhcnRIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJyx0aGlzLl9kcmFnU3RhcnRIYW5kbGVyLGZhbHNlKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRyYWdTdGFydEhhbmRsZXIoKTp2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpO1xyXG4gICAgICAgIGxldCBlOiBhbnkgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB0aGlzLnNldEN1cnNvcignbW92ZScpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRYID0gZS5jbGllbnRYO1xyXG4gICAgICAgIHRoaXMuc3RhcnRZID0gZS5jbGllbnRZO1xyXG4gICAgICAgIHRoaXMub25EcmFnaW5nKCk7XHJcbiAgICAgICAgdGhpcy5vbkRyYWdFbmQoKTtcclxuICAgIH0gXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmi5bmi73kuK1cclxuICAgICAqIEBwYXJhbSBkcmFnaW5nQ2IgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvbkRyYWdpbmcoKTp2b2lkIHtcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc2V0Q3Vyc29yKCdtb3ZlJyk7XHJcbiAgICAgICAgdGhpcy5fZHJhZ2luZ0hhbmRsZXIgPSB0aGlzLmRyYWdpbmdIYW5kbGVyLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJyx0aGlzLl9kcmFnaW5nSGFuZGxlciwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZHJhZ2luZ0hhbmRsZXIoKTp2b2lkIHtcclxuICAgICAgICBsZXQgZTogYW55ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgbGV0IHRocm90dGxlQ2IgOkZ1bmN0aW9uID0gdXRpbHMudGhyb3R0bGUodGhpcy5kcmFnaW5nQ2IsMTApO1xyXG4gICAgICAgIHRoaXMucmFuZ2VYID0gZS5jbGllbnRYIC0gdGhpcy5zdGFydFggKyB0aGlzLmxhc3RYO1xyXG4gICAgICAgIHRoaXMucmFuZ2VZID0gZS5jbGllbnRZIC0gdGhpcy5zdGFydFkgKyB0aGlzLmxhc3RZO1xyXG4gICAgICAgIHRocm90dGxlQ2IodGhpcy5yYW5nZVgsdGhpcy5yYW5nZVkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5ouW5ou957uT5p2fXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvbkRyYWdFbmQoKTp2b2lkIHtcclxuICAgICAgICB0aGlzLl9kcmFnRW5kSGFuZGxlciA9IHRoaXMuZHJhZ0VuZEhhbmRsZXIuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLnRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJyx0aGlzLl9kcmFnRW5kSGFuZGxlciwgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLHRoaXMuX2RyYWdFbmRIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmFnRW5kSGFuZGxlcigpOnZvaWR7XHJcbiAgICAgICAgbGV0IGU6IGFueSA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICB0aGlzLmxhc3RYID0gdGhpcy5yYW5nZVg7XHJcbiAgICAgICAgdGhpcy5sYXN0WSA9IHRoaXMucmFuZ2VZO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsdGhpcy5fZHJhZ2luZ0hhbmRsZXIsZmFsc2UpO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLHRoaXMuX2RyYWdFbmRIYW5kbGVyLGZhbHNlKTtcclxuICAgICAgICB0aGlzLmRyYWdFbmRDYigpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUGFpbnRpbmc7IiwiLy8gVUnpm4blkIhcclxuXHJcbmltcG9ydCB1dGlscyBmcm9tICcuL3V0aWxzJztcclxuXHJcbmNsYXNzIFVJIHtcclxuICAgIHB1YmxpYyBVSVRhcmdldDogYW55O1xyXG4gICAgcHJpdmF0ZSBtYXNrVGFyZ2V0OiBIVE1MRWxlbWVudDsgLy/okpnlsYLnmoRlbGVtZW505a+56LGhXHJcbiAgICBwcml2YXRlIHNlbGVjdFRhcmdldDogSFRNTEVsZW1lbnQ7IC8v5Y+v5ouW5ou96YCJ5oup5qGG5a+56LGhXHJcbiAgICBwcml2YXRlIG51bWJlclRhcmdldDogSFRNTEVsZW1lbnQ7IC8v5a696auY5pWw5o2u5pi+56S65Yy6XHJcbiAgICBwcml2YXRlIGZ1bmN0aW9uVmlldzogSFRNTEVsZW1lbnQ7IC8v5Yqf6IO95pi+56S65Yy6XHJcbiAgICBwcml2YXRlIHV1aWQ6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKCl7fVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yid5aeL5YyWVUnnlYzpnaJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGluaXRVSSh1dWlkOm51bWJlcik6dm9pZHtcclxuICAgICAgICB0aGlzLnV1aWQgPSB1dWlkO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlV3JhcHBlcigpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlU2VsZWN0Qm94KCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVOdW1iZXJWaWV3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rokpnlsYJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVXcmFwcGVyKCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5tYXNrVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnNjcmVlbkNhcHR1cmUtJHt0aGlzLnV1aWR9YCk7XHJcbiAgICAgICAgaWYodGhpcy5tYXNrVGFyZ2V0KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5tYXNrVGFyZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5tYXNrVGFyZ2V0LmNsYXNzTmFtZSA9IGBzY3JlZW5DYXB0dXJlLXdyYXBwZXIgc2NyZWVuQ2FwdHVyZS0ke3RoaXMudXVpZH1gO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5tYXNrVGFyZ2V0KTtcclxuIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu66YCJ5oup5qGG5a+56LGhXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgY3JlYXRlU2VsZWN0Qm94KCk6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RUYXJnZXQgPSB0aGlzLm1hc2tUYXJnZXQucXVlcnlTZWxlY3RvcignLnNjcmVlbkNhcHR1cmUtc2VsZWN0Ym94Jyk7XHJcbiAgICAgICAgaWYodGhpcy5zZWxlY3RUYXJnZXQpIHJldHVybjtcclxuICAgICAgICB0aGlzLnNlbGVjdFRhcmdldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHV0aWxzLkNsYXNzKHRoaXMuc2VsZWN0VGFyZ2V0LCdhZGQnLCdzY3JlZW5DYXB0dXJlLXNlbGVjdGJveCcpO1xyXG4gICAgICAgIHRoaXMubWFza1RhcmdldC5hcHBlbmRDaGlsZCh0aGlzLnNlbGVjdFRhcmdldCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rlrr3pq5jmlbDmja7mmL7npLrljLpcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVOdW1iZXJWaWV3KCk6dm9pZHtcclxuICAgICAgICB0aGlzLm51bWJlclRhcmdldCA9IHRoaXMubWFza1RhcmdldC5xdWVyeVNlbGVjdG9yKCcuc2NyZWVuQ2FwdHVyZS1udW1iZXItdmlldycpO1xyXG4gICAgICAgIGlmKHRoaXMubnVtYmVyVGFyZ2V0KSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMubnVtYmVyVGFyZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdXRpbHMuQ2xhc3ModGhpcy5udW1iZXJUYXJnZXQsJ2FkZCcsJ3NjcmVlbkNhcHR1cmUtbnVtYmVyLXZpZXcnKTtcclxuXHJcbiAgICAgICAgdGhpcy5mdW5jdGlvblZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB1dGlscy5DbGFzcyh0aGlzLmZ1bmN0aW9uVmlldywnYWRkJywnc2NyZWVuQ2FwdHVyZS1zZWxlY3Rib3gnKTtcclxuXHJcbiAgICAgICAgdGhpcy5mdW5jdGlvblZpZXcuaW5uZXJIVE1MID0gYFxyXG4gICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJzY3JlZW5DYXB0dXJlLXctaCBpLWIgdi1tXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzY3JlZW5DYXB0dXJlLXdcIj4wPC9zcGFuPiB4IFxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2NyZWVuQ2FwdHVyZS1oXCI+MDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwic2NyZWVuQ2FwdHVyZS1mdW5jdGlvbiBpLWIgdi1tXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmdW5jdGlvbi1pdGVtIGZ1bmN0aW9uLWRvb2RsaW5nIHYtbVwiPua2gum4pjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8aW1nIGFsdD1cIuWPlua2iFwiIGNsYXNzPVwiZnVuY3Rpb24tY2xvc2Ugdi1tXCIgc3JjPVwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCa0FBQUFaQ0FZQUFBREU2WVZqQUFBQW5VbEVRVlJJaWUzVU1RNkZNQWdHNEM1MDlnSndkYm1SYnZSTmVwTzZ2VHliWU1IaThCTC90WkF2Sk5DVTN2eE50aWxOandPRllQa2d6Slo2UVdCcjdRa29sR3VoWEh2TmdzRFdXclh4cXJtdEV3UTJJeFpvR09oQllZQUdGY3BiS0hBQnhRSmZpUExlVGhRTEtKTzRWdFlEdEJNTlE5b1dXZS9vTnFDOXV5SHJIUXhCdjgyOU5UMUJDS3ZyOXhZRXR0NkJJTEFidUpQSGdUZWhPUUNTOWVPT09uTUUxUUFBQUFCSlJVNUVya0pnZ2c9PVwiID5cclxuICAgICAgICAgICAgICAgICAgICA8aW1nIGFsdD1cIuWujOaIkFwiIGNsYXNzPVwiZnVuY3Rpb24tc3VjY2VzcyB2LW1cIiBzcmM9XCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJrQUFBQVpDQVlBQUFERTZZVmpBQUFBdUVsRVFWUklpZTNRd1EzQ01Bd0YwSXlRQzFMc1V5NVU5bzFSdWdFZGdSRVloUTFnQTdwQlI2SFhXSlhNQlVGQkJBSWs0dEQrODdlZWJXUG1UQ1k0VkRVSUhaMVFVd1J3UWcwS0t3b3JDTFZGQVJUVzdKZE1BTERxclJOYVcvVzJDR0NNTVNEVVhncmRwMUR5aTFCb055b21ReUM4dWMxUmowTlZSOHRXdlIxZG95amNPU1gvQ3JoZmpQcUZMRmNwaXoxZWRJb05mZzJrUWo4RDc2QnNRQXlDd1B1c1FBVEtEenlIQ2dCWEtOQVdBaCtLQVhQK2tqT3hTdWZIZmF3eWZ3QUFBQUJKUlU1RXJrSmdnZz09XCIgPlxyXG4gICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgdGhpcy5udW1iZXJUYXJnZXQuYXBwZW5kQ2hpbGQodGhpcy5mdW5jdGlvblZpZXcpO1xyXG4gICAgICAgIHRoaXMubWFza1RhcmdldC5hcHBlbmRDaGlsZCh0aGlzLm51bWJlclRhcmdldCk7XHJcbiAgICAgICAgdGhpcy5zZXRVSVRhcmdldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6+572uVUlUYXJnZXRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldFVJVGFyZ2V0KCk6dm9pZHtcclxuICAgICAgICB0aGlzLlVJVGFyZ2V0PSB7XHJcbiAgICAgICAgICAgIG1hc2tUYXJnZXQ6IHRoaXMubWFza1RhcmdldCxcclxuICAgICAgICAgICAgc2VsZWN0VGFyZ2V0OiB0aGlzLnNlbGVjdFRhcmdldCxcclxuICAgICAgICAgICAgbnVtYmVyVGFyZ2V0OiB0aGlzLm51bWJlclRhcmdldCxcclxuICAgICAgICAgICAgZnVuY3Rpb25WaWV3OiB0aGlzLmZ1bmN0aW9uVmlldyxcclxuICAgICAgICAgICAgY2FwdHVyZVdpZHRoOiB0aGlzLm51bWJlclRhcmdldC5xdWVyeVNlbGVjdG9yKCcuc2NyZWVuQ2FwdHVyZS13JyksXHJcbiAgICAgICAgICAgIGNhcHR1cmVIZWlnaHQ6IHRoaXMubnVtYmVyVGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5zY3JlZW5DYXB0dXJlLWgnKSxcclxuICAgICAgICAgICAgY2FwdHVyZVN1cmU6IHRoaXMubnVtYmVyVGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5mdW5jdGlvbi1zdWNjZXNzJyksXHJcbiAgICAgICAgICAgIGNhcHR1cmVDbG9zZTogdGhpcy5udW1iZXJUYXJnZXQucXVlcnlTZWxlY3RvcignLmZ1bmN0aW9uLWNsb3NlJyksXHJcbiAgICAgICAgICAgIGNhcHR1cmVEb29kbGluZzogdGhpcy5udW1iZXJUYXJnZXQucXVlcnlTZWxlY3RvcignLmZ1bmN0aW9uLWRvb2RsaW5nJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmL7npLrokpnlsYJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNob3dNYXNrKCk6dm9pZCB7XHJcbiAgICAgICAgdXRpbHMuQ2xhc3ModGhpcy5tYXNrVGFyZ2V0LCdhZGQnLCdzY3JlZW5DYXB0dXJlLXdyYXBwZXItc2hvdycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6ZqQ6JeP6JKZ5bGCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBoaWRlTWFzaygpOnZvaWQge1xyXG4gICAgICAgIHV0aWxzLkNsYXNzKHRoaXMubWFza1RhcmdldCwnZGVsJywnc2NyZWVuQ2FwdHVyZS13cmFwcGVyLXNob3cnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaYvuekuuS/oeaBr+WKn+iDveWMulxyXG4gICAgICogQHBhcmFtIHdpZHRoIFxyXG4gICAgICogQHBhcmFtIGhlaWdodCBcclxuICAgICAqIEBwYXJhbSB4IFxyXG4gICAgICogQHBhcmFtIHkgXHJcbiAgICAgKiBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNob3dGdW5jdGlvblZpZXcod2lkdGg6bnVtYmVyLGhlaWdodDpudW1iZXIseDpudW1iZXIseTpudW1iZXIpOnZvaWQge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHRvZG86XHJcbiAgICAgICAgICogMS4g57uZIG51bWJlclRhcmdldOiuvue9ruWuvemrmOWSjOS9jee9rlxyXG4gICAgICAgICAqIDIuIOaYvuekuiBmdW5jdGlvblZpZXdcclxuICAgICAgICAgKiAzLiDliKTmlq1mdW5jdGlvblZpZXfnmoTkvY3nva7mnInmsqHmnInotoXlh7pcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLm51bWJlclRhcmdldC5zdHlsZS5jc3NUZXh0ID0gYFxyXG4gICAgICAgICAgICB3aWR0aDoke3dpZHRofXB4O1xyXG4gICAgICAgICAgICBoZWlnaHQ6ICR7aGVpZ2h0fXB4O1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgke3h9cHgsJHt5fXB4KTtcclxuICAgICAgICBgO1xyXG4gICAgICAgIHV0aWxzLkNsYXNzKHRoaXMuZnVuY3Rpb25WaWV3LCdhZGQnLCdzY3JlZW5DYXB0dXJlLXNlbGVjdGJveC1zaG93Jyk7XHJcbiAgICAgICAgbGV0IG9mZnNldFdpZHRoOiBudW1iZXIgPSB0aGlzLmZ1bmN0aW9uVmlldy5vZmZzZXRXaWR0aDtcclxuICAgICAgICBsZXQgb2Zmc2V0SGVpZ2h0OiBudW1iZXIgPSB0aGlzLmZ1bmN0aW9uVmlldy5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgaWYob2Zmc2V0V2lkdGg+eCl7XHJcbiAgICAgICAgICAgIHRoaXMuZnVuY3Rpb25WaWV3LnN0eWxlLmxlZnQ9JzBweCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKG9mZnNldEhlaWdodCt5LHRoaXMubWFza1RhcmdldC5vZmZzZXRIZWlnaHQpXHJcbiAgICAgICAgaWYob2Zmc2V0SGVpZ2h0K3k+PXRoaXMubWFza1RhcmdldC5vZmZzZXRIZWlnaHQpe1xyXG4gICAgICAgICAgICB0aGlzLmZ1bmN0aW9uVmlldy5zdHlsZS50b3AgPSAnMHB4JztcclxuICAgICAgICB9IFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6+572u5Yeg5L2V5L+h5oGvKOS9jee9ruWSjOWkp+WwjylcclxuICAgICAqIEBwYXJhbSB3aWR0aCBcclxuICAgICAqIEBwYXJhbSBoZWlnaHQgXHJcbiAgICAgKiBAcGFyYW0geCBcclxuICAgICAqIEBwYXJhbSB5IFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0Vmlld0xheW91dCh3aWR0aDpudW1iZXIsaGVpZ2h0Om51bWJlcix4Om51bWJlcix5Om51bWJlcik6dm9pZCB7XHJcbiAgICAgICAgdGhpcy5udW1iZXJUYXJnZXQuc3R5bGUuY3NzVGV4dCA9IGBcclxuICAgICAgICAgICAgd2lkdGg6JHt3aWR0aH1weDtcclxuICAgICAgICAgICAgaGVpZ2h0OiAke2hlaWdodH1weDtcclxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoJHt4fXB4LCR7eX1weCk7XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBVSTsgIiwiaW1wb3J0IFNjcmVlbkNhcHR1cmUgZnJvbSAnLi9zY3JlZW5DYXB0dXJlJztcclxuaW1wb3J0IFVJIGZyb20gJy4vVUknO1xyXG5pbXBvcnQgUGFpbnRpbmcgZnJvbSAnLi9QYWludGluZyc7XHJcbih3aW5kb3cgYXMgYW55KS5VSSA9IFVJO1xyXG4od2luZG93IGFzIGFueSkuUGFpbnRpbmcgPSBQYWludGluZztcclxuLy8gZXhwb3J0IGRlZmF1bHQgU2NyZWVuQ2FwdHVyZTtcclxuLy8gZXhwb3J0IGRlZmF1bHQgVUk7ICIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgIC8qKlxyXG4gICAgICogY3NzIGNsYXNzIOaTjeS9nFxyXG4gICAgICogQHBhcmFtIHRhcmdldCDlr7nosaFcclxuICAgICAqIEBwYXJhbSBvcCDmt7vliqAoYWRkKe+8jCDliKDpmaQoZGVsKe+8jCDljIXlkKsoaGFzKe+8jCDnrYnkuo4oZXEpLCDliIfmjaIodG9nKe+8jCDmm7/mjaIocmVwKVxyXG4gICAgICogQHBhcmFtIGNsYXNzTmFtZSBcclxuICAgICAqIEBwYXJhbSBvbGRDbGFzcyBcclxuICAgICAqL1xyXG4gICAgQ2xhc3ModGFyZ2V0OiBhbnksb3A6U3RyaW5nPSdhZGQnLGNsYXNzTmFtZT86U3RyaW5nLG9sZENsYXNzPzpTdHJpbmcpOmFueXtcclxuICAgICAgICBsZXQgcmVzdWx0OiBhbnk7XHJcbiAgICAgICAgc3dpdGNoKG9wKXtcclxuICAgICAgICAgICAgY2FzZSAnYWRkJzpcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdkZWwnOlxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2hhcyc6XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdlcSc6XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAndG9nJzogLy9pZTEw5Lul5LiL5LiN5pSv5oyBXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncmVwJzogLy9zYWZhcmnkuI3mlK/mjIFcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVwbGFjZShvbGRDbGFzcyxjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6IqC5rWBXHJcbiAgICAgKiBAcGFyYW0gZm4gXHJcbiAgICAgKiBAcGFyYW0gdGltZSBcclxuICAgICAqL1xyXG4gICAgdGhyb3R0bGUoZm46IEZ1bmN0aW9uLCB0aW1lOiBudW1iZXIpOkZ1bmN0aW9uIHtcclxuICAgICAgICBsZXQgYm9vbCA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGlmKCFib29sKSByZXR1cm47XHJcbiAgICAgICAgICAgIGJvb2wgPSAhYm9vbDtcclxuICAgICAgICAgICAgZm4uYXBwbHkodGhpcyxhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgICAgICAgICAgICBib29sID0gIWJvb2w7XHJcbiAgICAgICAgICAgIH0sdGltZSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0=

//# sourceMappingURL=screenCapture.js.map
