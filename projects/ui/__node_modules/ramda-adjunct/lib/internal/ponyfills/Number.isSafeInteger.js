"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var _ramda = require("ramda");
var _isInteger = _interopRequireDefault(require("../../isInteger"));
var _Number = _interopRequireDefault(require("./Number.MAX_SAFE_INTEGER"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var isSafeIntegerPonyfill = (0, _ramda.both)(_isInteger["default"], function (value) {
  return Math.abs(value) <= _Number["default"];
});
var _default = isSafeIntegerPonyfill;
exports["default"] = _default;