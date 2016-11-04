'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _streamCombiner = require('stream-combiner');

var _streamCombiner2 = _interopRequireDefault(_streamCombiner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function initPipes(pipes) {
  if (pipes instanceof PolyPipe) {
    return initPipes(pipes.initPipes);
  }

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var _initPipes = Array.isArray(pipes) ? pipes : [[pipes].concat(args)];
  var array = [];
  _initPipes.forEach(function (pipe) {
    if (pipe instanceof PolyPipe) {
      array = array.concat(pipe.initPipes);
    } else {
      array.push(Array.isArray(pipe) ? pipe : [pipe]);
    }
  });
  return array;
}

var PolyPipe = function () {
  function PolyPipe(pipes) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    _classCallCheck(this, PolyPipe);

    var _initPipes = initPipes.apply(undefined, [pipes].concat(args));

    var _pipes = _initPipes.map(function (pipe) {
      var _pipe = _toArray(pipe),
          fn = _pipe[0],
          args = _pipe.slice(1);

      return fn.bind.apply(fn, [undefined].concat(_toConsumableArray(args)));
    });

    Object.defineProperties(this, {
      initPipes: {
        get: function get() {
          return _initPipes;
        }
      },
      pipes: {
        get: function get() {
          return _pipes;
        }
      }
    });
  }

  _createClass(PolyPipe, [{
    key: 'pipe',
    value: function pipe(pipes) {
      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      return new PolyPipe(this.initPipes.concat(initPipes.apply(undefined, [pipes].concat(args))));
    }
  }, {
    key: 'prepipe',
    value: function prepipe(pipes) {
      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      return new PolyPipe(initPipes.apply(undefined, [pipes].concat(args)).concat(this.initPipes));
    }
  }, {
    key: 'plugin',
    value: function plugin() {
      return (0, _streamCombiner2.default)(this.pipes.map(function (pipe) {
        return pipe();
      }));
    }
  }, {
    key: 'through',
    value: function through(stream) {
      return [stream].concat(_toConsumableArray(this.pipes)).reduce(function (stream, pipe) {
        return stream.pipe(pipe());
      });
    }
  }]);

  return PolyPipe;
}();

exports.default = PolyPipe;
;
module.exports = exports['default'];