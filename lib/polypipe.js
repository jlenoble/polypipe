'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MonoPipe = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _monopipe = require('./monopipe');

var _monopipe2 = _interopRequireDefault(_monopipe);

var _polyton = require('polyton');

var _streamCombiner = require('stream-combiner');

var _streamCombiner2 = _interopRequireDefault(_streamCombiner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var PolyPipe = (0, _polyton.PolytonFactory)( // eslint-disable-line new-cap
_monopipe2.default, ['object', { type: 'literal', optional: true }], undefined, {
  preprocess: function preprocess(args) {
    var array = [];
    args.forEach(function (arg) {
      var _arg = _slicedToArray(arg, 1),
          arg0 = _arg[0];

      if (arg0.initArgs) {
        array = array.concat(arg0.initArgs);
      } else {
        array.push(arg);
      }
    });
    return array;
  },
  extend: {
    plugin: function plugin() {
      return (0, _streamCombiner2.default)(this.map(function (pipe) {
        return pipe.plugin();
      }));
    },
    through: function through(stream) {
      return [stream].concat(_toConsumableArray(this.elements)).reduce(function (stream, pipe) {
        return stream.pipe(pipe.plugin());
      });
    },
    pipe: function pipe() {
      return this.concat.apply(this, arguments);
    },
    prepipe: function prepipe() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return new (Function.prototype.bind.apply(PolyPipe, [null].concat(args)))().concat(this);
    }
  }
});

exports.default = PolyPipe;
exports.MonoPipe = _monopipe2.default;