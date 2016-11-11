import {SingletonFactory} from 'singletons';
import combine from 'stream-combiner';

function initPipes(pipes, ...args) {
  if (pipes instanceof PolyPipe) {
    return initPipes(pipes.initPipes);
  }
  const _initPipes = Array.isArray(pipes) ? pipes : [[pipes, ...args]];
  let array = [];
  _initPipes.forEach(pipe => {
    if (pipe instanceof PolyPipe) {
      array = array.concat(pipe.initPipes);
    } else {
      array.push(Array.isArray(pipe) ? pipe : [pipe]);
    }
  });
  return array;
}

class PolyPipe {
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
    return new SingletonPolyPipe(
      this.initPipes.concat(initPipes(pipes, ...args)));
  }

  prepipe(pipes, ...args) {
    return new SingletonPolyPipe(
      initPipes(pipes, ...args).concat(this.initPipes));
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

const SingletonPolyPipe = SingletonFactory(PolyPipe, ['object', 'literal']);

export default SingletonPolyPipe;
