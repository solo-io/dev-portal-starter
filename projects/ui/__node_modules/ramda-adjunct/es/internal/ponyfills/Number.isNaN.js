import { both } from 'ramda';
import isNumber from '../../isNumber';

// eslint-disable-next-line no-restricted-globals
var isNaNPonyfill = both(isNumber, isNaN);
export default isNaNPonyfill;