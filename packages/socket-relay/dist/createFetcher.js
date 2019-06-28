import 'core-js/modules/es6.promise';
import 'core-js/modules/es6.function.bind';
import _newArrowCheck from '@babel/runtime/helpers/newArrowCheck';
import { observe, send } from '@absinthe/socket';

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

export default createFetcher;
//# sourceMappingURL=createFetcher.js.map
