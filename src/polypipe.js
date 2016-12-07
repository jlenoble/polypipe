import MonoPipe from './monopipe';
import {PolytonFactory} from 'polyton';
import combine from 'stream-combiner';

const PolyPipe = PolytonFactory(MonoPipe, ['object', 'literal']);

Object.assign(PolyPipe.prototype, {

  plugin() {
    return combine(this.elements.map(pipe => pipe.plugin()));
  },

  through(stream) {
    return [stream, ...this.elements].reduce((stream, pipe) => {
      return stream.pipe(pipe.plugin());
    });
  }

});

export default PolyPipe;
