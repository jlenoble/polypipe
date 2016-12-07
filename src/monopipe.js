export class MonoPipe {

  constructor(plugin, ...args) {
    const _plugin = plugin.bind(undefined, ...args);

    this.plugin = function() {
      return _plugin();
    };
  }

  through(stream) {
    return stream.pipe(this.plugin());
  }

};
