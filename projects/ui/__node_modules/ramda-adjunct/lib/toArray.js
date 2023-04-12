"use strict";

exports.__esModule = true;
exports.fromPonyfill = exports["default"] = void 0;
var _ramda = require("ramda");
var _isIterable = _interopRequireDefault(require("./isIterable"));
var _isFunction = _interopRequireDefault(require("./isFunction"));
var _Array = _interopRequireDefault(require("./internal/ponyfills/Array.from"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var fromPonyfill = (0, _ramda.curryN)(1, _Array["default"]);
exports.fromPonyfill = fromPonyfill;
var fromArray = (0, _isFunction["default"])(Array.from) ? (0, _ramda.curryN)(1, Array.from) : fromPonyfill;

/**
 * Converts value to an array.
 *
 * @func toArray
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/2.22.0|v2.22.0}
 * @category List
 * @sig * -> [a]
 * @param {*} val The value to convert
 * @return {Array}
 * @example
 *
 * RA.toArray([1, 2]); //=> [1, 2]
 * RA.toArray({'foo': 1, 'bar': 2}); //=> [1, 2]
 * RA.toArray('abc'); //=> ['a', 'b', 'c']
 * RA.toArray(1); //=> []
 * RA.toArray(null); //=> []
 */

var toArray = (0, _ramda.ifElse)(_isIterable["default"], fromArray, _ramda.values);
var _default = toArray;
exports["default"] = _default;