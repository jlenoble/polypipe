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

function refStream3(glb) {
  return gulp.src(glb).pipe(this.values[0].plugin());
}

function refStream4(glb) {
  var stream2 = gulp.src(glb);
  const pipes = [[], ...this.values].reduce((array, polypipe) => {
    return array.concat(polypipe.initPipes);
  });
  pipes.forEach(values => {
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
    description: 'new PolyPipe([noop, babel])',
    values: [new PolyPipe([noop, babel])]
  },
];

argsAsPolyPipes.forEach(args => {
  Object.assign(args, {
    refStream: refStream3,
    instantiate: instantiate1
  });
});

export const argsAsArrayOfPolyPipes = [
  {
    description: '[new PolyPipe(noop), new PolyPipe(babel)]',
    values: [new PolyPipe(noop), new PolyPipe(babel)]
  },
  {
    description: `[
      new PolyPipe([noop, [rename, {suffix: '-renamed'}]]),
      new PolyPipe([babel, [rename, {suffix: '-renamed-twice'}]])
    ]`,
    values: [
      new PolyPipe([noop, [rename, {suffix: '-renamed'}]]),
      new PolyPipe([babel, [rename, {suffix: '-renamed-twice'}]])
    ]
  },
  {
    description: `[
      new PolyPipe([noop, [rename, {suffix: '-renamed'}]]),
      new PolyPipe([babel, [rename, {suffix: '-renamed-twice'}]])
    ] with handwritten refStream as control`,
    values: [
      new PolyPipe([noop, [rename, {suffix: '-renamed'}]]),
      new PolyPipe([babel, [rename, {suffix: '-renamed-twice'}]])
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

argsAsArrayOfPolyPipes.forEach(args => {
  Object.assign(args, {
    refStream: args.refStream || refStream4,
    instantiate: instantiate2
  });
});

export const argsAsMixedBags = [
  {
    description: `[
      noop,
      new PolyPipe([noop, [rename, {suffix: '-renamed'}]]),
      [rename, {suffix: '-renamed2'}]
      new PolyPipe([babel, [rename, {suffix: '-renamed3'}]])
    ] with handwritten refStream`,
    values: [
      noop,
      new PolyPipe([noop, [rename, {suffix: '-renamed'}]]),
      [rename, {suffix: '-renamed2'}],
      new PolyPipe([babel, [rename, {suffix: '-renamed3'}]])
    ],
    refStream: function(glb) {
      return gulp.src(glb)
        .pipe(noop())
        .pipe(noop())
        .pipe(rename({suffix: '-renamed'}))
        .pipe(rename({suffix: '-renamed2'}))
        .pipe(babel())
        .pipe(rename({suffix: '-renamed3'}));
    }
  }
];

argsAsMixedBags.forEach(args => {
  Object.assign(args, {
    instantiate: instantiate2
  });
});

export const allArgs = [argsAsPlugins, argsAsArrayOfPlugins,
  argsAsPolyPipes, argsAsArrayOfPolyPipes, argsAsMixedBags].reduce(
    (array, next) => array.concat(next));
