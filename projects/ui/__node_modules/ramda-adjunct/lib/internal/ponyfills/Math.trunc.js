"use strict";

exports.__esModule = true;
exports["default"] = void 0;
var _isFinite = _interopRequireDefault(require("../../isFinite"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var truncPonyfill = function truncPonyfill(v) {
  var numV = Number(v);
  if (!(0, _isFinite["default"])(numV)) {
    return numV;
  }

  // eslint-disable-next-line no-nested-ternary
  return numV - numV % 1 || (numV < 0 ? -0 : numV === 0 ? numV : 0);
};
var _default = truncPonyfill;
exports["default"] = _default;