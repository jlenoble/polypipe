import MonoPipe from './monopipe';
import {PolytonFactory} from 'polyton';
import combine from 'stream-combiner';

const PolyPipe = PolytonFactory(MonoPipe, ['object', 'literal'], undefined,
  {
    extend: {
      plugin() {
        return combine(this.map(pipe => pipe.plugin()));
      },

      through(stream) {
        return [stream, ...this.elements].reduce((stream, pipe) => {
          return stream.pipe(pipe.plugin());
        });
      }
    }
  });

export default PolyPipe;
