import MonoPipe from './monopipe';
import {PolytonFactory} from 'polyton';
import combine from 'stream-combiner';

const PolyPipe = PolytonFactory( // eslint-disable-line new-cap
  MonoPipe, ['object', {type: 'literal', optional: true}], undefined, {
    preprocess: args => {
      let array = [];
      args.forEach(arg => {
        const [arg0] = arg;
        if (arg0.initArgs) {
          array = array.concat(arg0.initArgs);
        } else {
          array.push(arg);
        }
      });
      return array;
    },
    extend: {
      plugin () {
        return combine(this.map(pipe => pipe.plugin()));
      },

      through (stream) {
        return [stream, ...this.elements].reduce((stream, pipe) => {
          return stream.pipe(pipe.plugin());
        });
      },

      pipe (...args) {
        return this.concat(...args);
      },

      prepipe (...args) {
        return (new PolyPipe(...args)).concat(this);
      },
    },
  });

export default PolyPipe;
export {MonoPipe};
