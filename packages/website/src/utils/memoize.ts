import lodashMemoize from 'lodash/memoize'
import envs from './envs'

/**
 * This memoize function will use `lodash.memoize` only when **`process.env.NEXT_PUBLIC_DATA_FETCHING`** is equal to `ssg`.
 * 
 * In all other cases (e.g. `NEXT_PUBLIC_DATA_FETCHING === 'ssr'`) this function **will not** create a memoized function.
 * 
 * `lodash.memoize` creates a function that memoizes the result of func. If resolver is provided it determines the cache key for
 * storing the result based on the arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is coerced to a string and used as the cache key. The func is invoked with
 * the this binding of the memoized function.
 *
 * @param func The function to have its output memoized.
 * @param resolver The function to resolve the cache key.
 * @return Returns the new memoizing function only when **`process.env.NEXT_PUBLIC_DATA_FETCHING`** is equal to `ssg`.
 */
export const memoize: <T extends (...args: any) => any>(func: T, resolver?: (...args: Parameters<T>) => any) => T =
  envs.NEXT_PUBLIC_DATA_FETCHING === 'ssg' ? lodashMemoize : (func) => func
