import gulp from 'gulp';
import {noop} from 'gulp-util';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import MonoPipe from '../src/monopipe';

function refStream1(glb) {
  const [fn, ...args] = this.values;
  return gulp.src(glb).pipe(fn(...args));
}

function instantiate1() {
  return new MonoPipe(...this.values);
}

export const argsAsPlugins = [
  {
    description: 'noop',
    values: [noop]
  },
  {
    description: 'babel',
    values: [babel]
  },
  {
    description: `rename, {suffix: '-renamed'}`,
    values: [rename, {suffix: '-renamed'}]
  }
];

argsAsPlugins.forEach(args => {
  Object.assign(args, {
    refStream: refStream1,
    instantiate: instantiate1
  });
});
