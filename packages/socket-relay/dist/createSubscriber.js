import 'core-js/modules/es6.function.bind';
import _newArrowCheck from '@babel/runtime/helpers/newArrowCheck';
import notifierFind from '@absinthe/socket/dist/notifier/find';
import { observe, send, unobserveOrCancel } from '@absinthe/socket';
import { createDeferred } from '@jumpn/utils-promise';
import { getOperationType } from '@jumpn/utils-graphql';
import 'core-js/modules/web.dom.iterable';
import 'core-js/modules/es6.array.iterator';
import 'core-js/modules/es6.string.iterator';
import 'core-js/modules/es6.weak-map';

var subscriptions = new WeakMap();

var _this = undefined;

var unobserveOrCancelIfNeeded = function unobserveOrCancelIfNeeded(absintheSocket, notifier, observer) {
  _newArrowCheck(this, _this);

  if (notifier) {
    unobserveOrCancel(absintheSocket, notifier, observer);
  }
}.bind(undefined);

var createDisposable = function createDisposable(absintheSocket, _ref, observer) {
  var _this2 = this;

  var request = _ref.request;

  _newArrowCheck(this, _this);

  return {
    dispose: function dispose() {
      _newArrowCheck(this, _this2);

      return unobserveOrCancelIfNeeded(absintheSocket, notifierFind(absintheSocket.notifiers, "request", request), observer);
    }.bind(this)
  };
}.bind(undefined);

var onStart = function onStart(deferred) {
  var _this3 = this;

  _newArrowCheck(this, _this);

  return function (notifier) {
    _newArrowCheck(this, _this3);

    return deferred.resolve(notifier);
  }.bind(this);
}.bind(undefined);

var onAbort = function onAbort(deferred, callback) {
  var _this4 = this;

  _newArrowCheck(this, _this);

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

  _newArrowCheck(this, _this);

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

export default createSubscriber;
//# sourceMappingURL=createSubscriber.js.map
