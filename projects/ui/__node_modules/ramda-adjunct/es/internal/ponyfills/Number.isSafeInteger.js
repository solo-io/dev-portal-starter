import { both } from 'ramda';
import isInteger from '../../isInteger';
import MAX_SAFE_INTEGER from './Number.MAX_SAFE_INTEGER';
var isSafeIntegerPonyfill = both(isInteger, function (value) {
  return Math.abs(value) <= MAX_SAFE_INTEGER;
});
export default isSafeIntegerPonyfill;