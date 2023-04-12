"use strict";

exports.__esModule = true;
exports.trimEndPonyfill = exports.trimEndInvoker = exports["default"] = void 0;
var _ramda = require("ramda");
var _String = _interopRequireDefault(require("./internal/ponyfills/String.trimEnd"));
var _isFunction = _interopRequireDefault(require("./isFunction"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var trimEndPonyfill = _String["default"];
exports.trimEndPonyfill = trimEndPonyfill;
var trimEndInvoker = (0, _ramda.invoker)(0, 'trimEnd');

/**
 * Removes whitespace from the end of a string.
 *
 * @func trimEnd
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/2.22.0|v2.22.0}
 * @category String
 * @sig String -> String
 * @param {string} value String value to have the whitespace removed from the end
 * @return {string} A new string representing the calling string stripped of whitespace from its end (right end).
 * @see {@link RA.trimEnd|trimEnd}
 * @example
 *
 * RA.trimEnd('abc   '); //=> 'abc'
 */
exports.trimEndInvoker = trimEndInvoker;
var trimEnd = (0, _isFunction["default"])(String.prototype.trimEnd) ? trimEndInvoker : trimEndPonyfill;
var _default = trimEnd;
exports["default"] = _default;