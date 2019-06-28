import 'core-js/modules/es6.promise';
import 'core-js/modules/es6.function.bind';
import _newArrowCheck from '@babel/runtime/helpers/newArrowCheck';
import { booleanize } from '@jumpn/utils-promise';
import 'core-js/modules/web.dom.iterable';
import 'core-js/modules/es6.array.iterator';
import 'core-js/modules/es6.string.iterator';
import 'core-js/modules/es6.weak-map';

var subscriptions = new WeakMap();

var _this = undefined;
/**
 * Returns a promise that resolves to `true` in case subscription of given
 * disposable has started or to `false` otherwise
 */

var isSubscribed = function isSubscribed(disposable) {
  _newArrowCheck(this, _this);

  var maybeSubscription = subscriptions.get(disposable);
  return maybeSubscription ? booleanize(maybeSubscription) : Promise.resolve(false);
}.bind(undefined);

export default isSubscribed;
//# sourceMappingURL=isSubscribed.js.map
