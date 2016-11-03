import gulp from 'gulp';
import {noop} from 'gulp-util';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import {Transform} from 'stream';
import PolyPipe from '../src/polypipe';

const DestroyableTransform = gulp.src('*.notfound').constructor;

export function isStream(stream) {
  return stream instanceof DestroyableTransform ||
    stream instanceof Transform;
};

export const testGlobs = [
  'gulpfile.babel.js',
  'test/**/*.js',
  [
    'gulpfile.babel.js',
    'test/**/*.js',
    'gulp/*.js',
    '!gulp/globs.js'
  ]
];

function refStream1(glb) {
  const [fn, ...args] = this.values;
  return gulp.src(glb).pipe(fn(...args));
}

function refStream2(glb) {
  var stream2 = gulp.src(glb);
  this.values.forEach(values => {
    if (!Array.isArray(values)) {
      values = [values];
    }
    const [fn, ...args] = values;
    stream2 = stream2.pipe(fn(...args));
  });
  return stream2;
}

function instantiate1() {
  return new PolyPipe(...this.values);
}

function instantiate2() {
  return new PolyPipe(this.values);
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

export const argsAsArrayOfPlugins =   [
  {
    description: '[noop]',
    values: [noop],
  },
  {
    description: '[[noop]]',
    values: [[noop]]
  },
  {
    description: '[babel]',
    values: [babel]
  },
  {
    description: `[[rename, {suffix: '-renamed'}]]`,
    values: [[rename, {suffix: '-renamed'}]]
  },
  {
    description: `[noop, [rename, {suffix: '-renamed'}], [babel]]`,
    values: [noop, [rename, {suffix: '-renamed'}], [babel]]
  }
];

argsAsArrayOfPlugins.forEach(args => {
  Object.assign(args, {
    refStream: refStream2,
    instantiate: instantiate2
  });
});

export const allArgs = [argsAsPlugins, argsAsArrayOfPlugins].reduce(
  (array, next) => array.concat(next));
