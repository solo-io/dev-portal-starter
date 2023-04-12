"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var _ramda = require("ramda");
var _isObj = _interopRequireDefault(require("../isObj"));
var _isSymbol = _interopRequireDefault(require("../isSymbol"));
var _neither = _interopRequireDefault(require("../neither"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var isCoercible = (0, _neither["default"])(_isSymbol["default"], (0, _ramda.both)(_isObj["default"], (0, _neither["default"])((0, _ramda.hasIn)('toString'), (0, _ramda.hasIn)('valueOf'))));
var _default = isCoercible;
exports["default"] = _default;