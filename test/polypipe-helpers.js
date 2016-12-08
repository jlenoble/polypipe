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

function refStream2(glb) {
  return gulp.src(glb).pipe(this.values[0].plugin());
}

function refStream3(glb) {
  var stream2 = gulp.src(glb);
  const pipes = [[], ...this.values].reduce((array, polypipe) => {
    return array.concat(polypipe.initArgs);
  });
  pipes.forEach(values => {
    const [fn, ...args] = values;
    stream2 = stream2.pipe(fn(...args));
  });
  return stream2;
}

function instantiate() {
  return new PolyPipe(...this.values);
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
  Object.assign(args, {refStream, instantiate});
});

export const argsAsPolyPipes = [
  {
    description: 'new PolyPipe(noop)',
    values: [new PolyPipe(noop)]
  },
  {
    description: 'new PolyPipe(babel)',
    values: [new PolyPipe(babel)]
  },
  {
    description: 'new PolyPipe(noop, babel)',
    values: [new PolyPipe(noop, babel)]
  },
];

argsAsPolyPipes.forEach(args => {
  Object.assign(args, {
    refStream: refStream2,
    instantiate: instantiate
  });
});

export const argsAsListsOfPolyPipes = [
  {
    description: 'new PolyPipe(noop), new PolyPipe(babel)',
    values: [new PolyPipe(noop), new PolyPipe(babel)]
  },
  {
    description: `
      new PolyPipe([noop, [rename, {suffix: '-renamed'}]]),
      new PolyPipe([babel, [rename, {suffix: '-renamed-twice'}]])`,
    values: [
      new PolyPipe(noop, [rename, {suffix: '-renamed'}]),
      new PolyPipe(babel, [rename, {suffix: '-renamed-twice'}])
    ]
  },
  {
    description: `
      new PolyPipe([noop, [rename, {suffix: '-renamed'}]]),
      new PolyPipe([babel, [rename, {suffix: '-renamed-twice'}]])
    with handwritten refStream as control`,
    values: [
      new PolyPipe(noop, [rename, {suffix: '-renamed'}]),
      new PolyPipe(babel, [rename, {suffix: '-renamed-twice'}])
    ],
    refStream: function(glb) {
      return gulp.src(glb)
        .pipe(noop())
        .pipe(rename({suffix: '-renamed'}))
        .pipe(babel())
        .pipe(rename({suffix: '-renamed-twice'}));
    }
  }
];

argsAsListsOfPolyPipes.forEach(args => {
  Object.assign(args, {
    refStream: args.refStream || refStream3,
    instantiate: instantiate
  });
});

export const allArgs = [argsAsListsOfPlugins, argsAsPolyPipes,
  argsAsListsOfPolyPipes].reduce(
    (array, next) => array.concat(next));
