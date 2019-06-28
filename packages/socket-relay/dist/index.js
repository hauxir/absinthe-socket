import notifierFind from '@absinthe/socket/dist/notifier/find';
import { observe, send, unobserveOrCancel } from '@absinthe/socket';
import { getOperationType } from '@jumpn/utils-graphql';
import 'core-js/modules/web.dom.iterable';
import 'core-js/modules/es6.array.iterator';
import 'core-js/modules/es6.string.iterator';
import 'core-js/modules/es6.weak-map';
import 'core-js/modules/es6.promise';
import 'core-js/modules/es6.function.bind';
import _newArrowCheck from '@babel/runtime/helpers/newArrowCheck';
import { createDeferred, booleanize } from '@jumpn/utils-promise';

var _this = undefined;

/**
 * Creates a Fetcher (Relay FetchFunction) using the given AbsintheSocket
 * instance
 */
var createFetcher = function createFetcher(absintheSocket, onError) {
  var _this2 = this;

  _newArrowCheck(this, _this);

  return function (_ref, variables) {
    var _this3 = this;

    var operation = _ref.text;

    _newArrowCheck(this, _this2);

    return new Promise(function (resolve, reject) {
      _newArrowCheck(this, _this3);

      return (// $FlowFixMe: operation is always defined
        observe(absintheSocket, send(absintheSocket, {
          operation: operation,
          variables: variables
        }), {
          onError: onError,
          onAbort: reject,
          onResult: resolve
        })
      );
    }.bind(this));
  }.bind(this);
}.bind(undefined);

var subscriptions = new WeakMap();

var _this$1 = undefined;

var unobserveOrCancelIfNeeded = function unobserveOrCancelIfNeeded(absintheSocket, notifier, observer) {
  _newArrowCheck(this, _this$1);

  if (notifier) {
    unobserveOrCancel(absintheSocket, notifier, observer);
  }
}.bind(undefined);

var createDisposable = function createDisposable(absintheSocket, _ref, observer) {
  var _this2 = this;

  var request = _ref.request;

  _newArrowCheck(this, _this$1);

  return {
    dispose: function dispose() {
      _newArrowCheck(this, _this2);

      return unobserveOrCancelIfNeeded(absintheSocket, notifierFind(absintheSocket.notifiers, "request", request), observer);
    }.bind(this)
  };
}.bind(undefined);

var onStart = function onStart(deferred) {
  var _this3 = this;

  _newArrowCheck(this, _this$1);

  return function (notifier) {
    _newArrowCheck(this, _this3);

    return deferred.resolve(notifier);
  }.bind(this);
}.bind(undefined);

var onAbort = function onAbort(deferred, callback) {
  var _this4 = this;

  _newArrowCheck(this, _this$1);

  return function (error) {
    _newArrowCheck(this, _this4);

    // callback is always defined but this is not correctly reflected in
    // SubscribeFunction
    callback && callback(error);
    deferred.reject(error);
  }.bind(this);
}.bind(undefined);
/**
 * Creates a Subscriber (Relay SubscribeFunction) using the given AbsintheSocket
 * instance
 */


var createSubscriber = function createSubscriber(absintheSocket, onRecoverableError) {
  var _this5 = this;

  _newArrowCheck(this, _this$1);

  return function (_ref2, variables, cacheConfig, _ref3) {
    var operation = _ref2.text;
    var OnUnrecoverableError = _ref3.onError,
        onNext = _ref3.onNext;

    _newArrowCheck(this, _this5);

    // we need to place this logic here and not in ensureIsSubscription as if we
    // do so, then flow is not able to infer we are validating operation
    if (!operation || getOperationType(operation) !== "subscription") {
      throw new Error("Expected subscription, but instead got:\n".concat(operation));
    }

    var notifier = send(absintheSocket, {
      operation: operation,
      variables: variables
    });
    var deferred = createDeferred();
    var observer = {
      onAbort: onAbort(deferred, OnUnrecoverableError),
      onError: onRecoverableError,
      onResult: onNext,
      onStart: onStart(deferred)
    };
    observe(absintheSocket, notifier, observer);
    var disposable = createDisposable(absintheSocket, notifier, observer);
    subscriptions.set(disposable, deferred.promise);
    return disposable;
  }.bind(this);
}.bind(undefined);

var _this$2 = undefined;
/**
 * Returns a promise that resolves to `true` in case subscription of given
 * disposable has started or to `false` otherwise
 */

var isSubscribed = function isSubscribed(disposable) {
  _newArrowCheck(this, _this$2);

  var maybeSubscription = subscriptions.get(disposable);
  return maybeSubscription ? booleanize(maybeSubscription) : Promise.resolve(false);
}.bind(undefined);

export { createFetcher, createSubscriber, isSubscribed };
//# sourceMappingURL=index.js.map
