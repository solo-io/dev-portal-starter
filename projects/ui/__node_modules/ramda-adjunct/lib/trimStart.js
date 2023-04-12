"use strict";

exports.__esModule = true;
exports.trimStartPonyfill = exports.trimStartInvoker = exports["default"] = void 0;
var _ramda = require("ramda");
var _String = _interopRequireDefault(require("./internal/ponyfills/String.trimStart"));
var _isFunction = _interopRequireDefault(require("./isFunction"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var trimStartPonyfill = _String["default"];
exports.trimStartPonyfill = trimStartPonyfill;
var trimStartInvoker = (0, _ramda.invoker)(0, 'trimStart');

/**
 * Removes whitespace from the beginning of a string.
 *
 * @func trimStart
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/2.22.0|v2.22.0}
 * @category String
 * @sig String -> String
 * @param {string} value String value to have the whitespace removed from the beginning
 * @return {string} A new string representing the calling string stripped of whitespace from its beginning (left end).
 * @example
 *
 * RA.trimStart('  abc'); //=> 'abc'
 */
exports.trimStartInvoker = trimStartInvoker;
var trimStart = (0, _isFunction["default"])(String.prototype.trimStart) ? trimStartInvoker : trimStartPonyfill;
var _default = trimStart;
exports["default"] = _default;