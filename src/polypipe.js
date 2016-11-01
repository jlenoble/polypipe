export default class PolyPipe {
  constructor(pipes, ...args) {
    var _pipes = Array.isArray(pipes) ? pipes : [[pipes, ...args]];

    Object.defineProperties(this, {
      pipes: {
        get() {return _pipes;}
      }
    });

    _pipes = _pipes.map(pipe => {
      if (!Array.isArray(pipe)) {pipe = [pipe];}
      const [fn, ...args] = pipe;
      return fn.bind(undefined, ...args);
    });
  }

  through(stream) {
    return [stream, ...this.pipes].reduce((stream, pipe) => {
      return stream.pipe(pipe());
    });
  }

};
