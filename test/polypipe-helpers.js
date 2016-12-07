import gulp from 'gulp';
import {noop} from 'gulp-util';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import PolyPipe from '../src/polypipe';

function refStream(glb) {
  var stream = gulp.src(glb);
  this.values.forEach(values => {
    if (!Array.isArray(values)) {
      values = [values];
    }
    const [fn, ...args] = values;
    stream = stream.pipe(fn(...args));
  });
  return stream;
}

function instantiate() {
  return new PolyPipe(this.values);
}


export const argsAsListsOfPlugins =   [
  {
    description: 'noop',
    values: [noop],
  },
  {
    description: '[noop]',
    values: [[noop]]
  },
  {
    description: 'babel',
    values: [babel]
  },
  {
    description: `[rename, {suffix: '-renamed'}]`,
    values: [[rename, {suffix: '-renamed'}]]
  },
  {
    description: `noop, [rename, {suffix: '-renamed'}], [babel]`,
    values: [noop, [rename, {suffix: '-renamed'}], [babel]]
  }
];

argsAsListsOfPlugins.forEach(args => {
  Object.assign(args, {
    refStream: refStream,
    instantiate: instantiate
  });
});
