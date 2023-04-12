import { curryN, bind } from 'ramda';
import resolveP from './resolveP';
import rejectP from './rejectP';

/**
 * Takes a generator function and returns an async function.
 * The async function returned is a curried function whose arity matches that of the generator function.
 *
 * Note: This function is handy for environments that does support generators but doesn't support async/await.
 *
 * @func async
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/2.16.0|v2.16.0}
 * @category Function
 * @sig Promise c => (a, b, ...) -> a -> b -> ... -> c
 * @param {Function} generatorFn The generator function
 * @return {Function} Curried async function
 * @see {@link https://www.promisejs.org/generators/}
 * @example
 *
 * const asyncFn = RA.async(function* generator(val1, val2) {
 *   const a = yield Promise.resolve(val1);
 *   const b = yield Promise.resolve(val2);
 *
 *   return a + b;
 * });
 *
 * asyncFn(1, 2); //=> Promise(3)
 *
 */
var async = curryN(1, function (generatorFn) {
  function asyncWrapper() {
    var iterator = bind(generatorFn, this).apply(void 0, arguments);
    var handle = function handle(result) {
      var resolved = resolveP(result.value);
      return result.done ? resolved : resolved.then(function (value) {
        return handle(iterator.next(value));
      }, function (error) {
        return handle(iterator["throw"](error));
      });
    };
    try {
      return handle(iterator.next());
    } catch (error) {
      return rejectP(error);
    }
  }
  if (generatorFn.length > 0) {
    return curryN(generatorFn.length, asyncWrapper);
  }
  return asyncWrapper;
});
export default async;