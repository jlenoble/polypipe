"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MonoPipe = function () {
  function MonoPipe(plugin) {
    _classCallCheck(this, MonoPipe);

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var _plugin = plugin.bind.apply(plugin, [undefined].concat(args));

    this.plugin = function () {
      return _plugin();
    };
  }

  _createClass(MonoPipe, [{
    key: "through",
    value: function through(stream) {
      return stream.pipe(this.plugin());
    }
  }]);

  return MonoPipe;
}();

exports.default = MonoPipe;
;
module.exports = exports["default"];