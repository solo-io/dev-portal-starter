"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var _ramda = require("ramda");
var _isNumber = _interopRequireDefault(require("../../isNumber"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// eslint-disable-next-line no-restricted-globals
var isNaNPonyfill = (0, _ramda.both)(_isNumber["default"], isNaN);
var _default = isNaNPonyfill;
exports["default"] = _default;