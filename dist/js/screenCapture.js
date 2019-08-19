(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var screenCapture_1 = require("./screenCapture");
exports.default = screenCapture_1.default;

},{"./screenCapture":2}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var ScreenCapture = function () {
    function ScreenCapture() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, ScreenCapture);

        options: options = options;
    }

    _createClass(ScreenCapture, [{
        key: "initClass",
        value: function initClass() {}
    }]);

    return ScreenCapture;
}();

exports.default = ScreenCapture;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdHMvaW5kZXgudHMiLCJzcmMvdHMvc2NyZWVuQ2FwdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0FBLElBQUEsa0JBQUEsUUFBQSxpQkFBQSxDQUFBO0FBRUEsUUFBQSxPQUFBLEdBQWUsZ0JBQUEsT0FBZjs7Ozs7Ozs7Ozs7SUNJcUIsYTtBQUVqQiw2QkFFQztBQUFBLFlBRlcsT0FFWCx1RUFGMkIsRUFFM0I7O0FBQUE7O0FBQ0csaUJBQVMsVUFBVSxPQUFWO0FBQ1o7Ozs7b0NBRWdCLENBRWhCOzs7Ozs7QUFWTCxRQUFBLE9BQUEsR0FBQSxhQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IFNjcmVlbkNhcHR1cmUgZnJvbSAnLi9zY3JlZW5DYXB0dXJlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNjcmVlbkNhcHR1cmU7IiwiXHJcbi8vIOmFjee9ruWPguaVsFxyXG5pbnRlcmZhY2Ugb3B0aW9ucyB7XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JlZW5DYXB0dXJlIHtcclxuICAgIHByaXZhdGUgb3B0aW9uczpvcHRpb25zO1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczpvcHRpb25zPXtcclxuXHJcbiAgICB9KXtcclxuICAgICAgICBvcHRpb25zIDpvcHRpb25zID0gb3B0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRDbGFzcygpOnZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG59Il19

//# sourceMappingURL=screenCapture.js.map
