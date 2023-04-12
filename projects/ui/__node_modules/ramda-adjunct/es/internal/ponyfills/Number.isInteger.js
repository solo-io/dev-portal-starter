import { both, converge, equals, identity } from 'ramda';
import isFinite from '../../isFinite';
var isIntegerPonyfill = both(isFinite, converge(equals, [Math.floor, identity]));
export default isIntegerPonyfill;