"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PolyPipe = function () {
  function PolyPipe(pipes) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    _classCallCheck(this, PolyPipe);

    var _pipes = Array.isArray(pipes) ? pipes : [[pipes].concat(args)];

    Object.defineProperties(this, {
      pipes: {
        get: function get() {
          return _pipes;
        }
      }
    });

    _pipes = _pipes.map(function (pipe) {
      if (!Array.isArray(pipe)) {
        pipe = [pipe];
      }

      var _pipe = pipe,
          _pipe2 = _toArray(_pipe),
          fn = _pipe2[0],
          args = _pipe2.slice(1);

      return fn.bind.apply(fn, [undefined].concat(_toConsumableArray(args)));
    });
  }

  _createClass(PolyPipe, [{
    key: "through",
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
module.exports = exports["default"];