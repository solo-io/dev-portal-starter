function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import { equals, pathSatisfies } from 'ramda';
import isString from '../isString';
import isNumber from '../isNumber';
import isFunction from '../isFunction';
import { isSameType } from './util';
import * as fl from './mapping';
export var functorTrait = _defineProperty({}, fl.map, function (fn) {
  return this.constructor[fl.of](fn(this.value));
});
export var applyTrait = _defineProperty({}, fl.ap, function (applyWithFn) {
  var _this = this;
  return applyWithFn.map(function (fn) {
    return fn(_this.value);
  });
});
export var setoidTrait = _defineProperty({}, fl.equals, function (setoid) {
  return isSameType(this, setoid) && equals(this.value, setoid.value);
});
export var semigroupTrait = _defineProperty({}, fl.concat, function (semigroup) {
  var concatenatedValue = this.value;
  if (isString(this.value) || isNumber(this.value)) {
    concatenatedValue = this.value + semigroup.value;
  } else if (pathSatisfies(isFunction, ['value', fl.concat], this)) {
    concatenatedValue = this.value[fl.concat](semigroup.value);
  } else if (pathSatisfies(isFunction, ['value', 'concat'], this)) {
    concatenatedValue = this.value.concat(semigroup.value);
  }
  return this.constructor[fl.of](concatenatedValue);
});
export var chainTrait = _defineProperty({}, fl.chain, function (fn) {
  var newChain = fn(this.value);
  return isSameType(this, newChain) ? newChain : this;
});
export var ordTrait = _defineProperty({}, fl.lte, function (ord) {
  return isSameType(this, ord) && (this.value < ord.value || this[fl.equals](ord));
});