import combine from 'stream-combiner';

function initPipes(pipes, ...args) {
  if (pipes instanceof PolyPipe) {
    return initPipes(pipes.initPipes);
  }

  var _initPipes = Array.isArray(pipes) ? pipes : [[pipes, ...args]];
  return _initPipes.map(pipe => Array.isArray(pipe) ? pipe : [pipe]);
}

export default class PolyPipe {
  constructor(pipes, ...args) {
    var _initPipes = initPipes(pipes, ...args);

    var _pipes = _initPipes.map(pipe => {
      const [fn, ...args] = pipe;
      return fn.bind(undefined, ...args);
    });

    Object.defineProperties(this, {
      initPipes: {
        get() {return _initPipes;}
      },
      pipes: {
        get() {return _pipes;}
      }
    });
  }

  pipe(pipes, ...args) {
    return new PolyPipe(this.initPipes.concat(initPipes(pipes, ...args)));
  }

  prepipe(pipes, ...args) {
    return new PolyPipe(initPipes(pipes, ...args).concat(this.initPipes));
  }

  plugin() {
    return combine(this.pipes.map(pipe => pipe()));
  }

  through(stream) {
    return [stream, ...this.pipes].reduce((stream, pipe) => {
      return stream.pipe(pipe());
    });
  }

};
