import gulp from 'gulp';
import {noop} from 'gulp-util';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import {expect} from 'chai';
import PolyPipe from '../src/polypipe';
import {isStream} from './helpers';
import equalStreamContents from 'equal-stream-contents';

describe('Testing PolyPipe', function() {

  [
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
  ].forEach(initArgs => {

    describe(`Initializing PolyPipe with (${initArgs.description})`,
      function() {

        const pipe = new PolyPipe(...initArgs.values);
        var [fn, ...args] = initArgs.values;

        ['gulpfile.babel.js', 'test/**/*.js', [
          'gulpfile.babel.js',
          'test/**/*.js',
          'gulp/*.js',
          '!gulp/globs.js'
        ]].forEach(glb => {

          it(`Using with glob '${glb}' (method through)`, function() {
            var stream = pipe.through(gulp.src(glb));
            expect(isStream(stream)).to.be.true;

            return equalStreamContents(stream,
              gulp.src(glb).pipe(fn(...args)));
          });

          it(`Using with glob '${glb} (method plugin)'`, function() {
            var stream = gulp.src(glb).pipe(pipe.plugin());

            return equalStreamContents(stream,
              gulp.src(glb).pipe(fn(...args)));
          });

        });

      });

  });

  [
    {
      description: '[noop]',
      values: [noop]
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
  ].forEach(initArgs => {

    describe(`Initializing PolyPipe with (${initArgs.description})`,
      function() {

        const pipe = new PolyPipe(initArgs.values);

        ['gulpfile.babel.js', 'test/**/*.js', [
          'gulpfile.babel.js',
          'test/**/*.js',
          'gulp/*.js',
          '!gulp/globs.js'
        ]].forEach(glb => {

          it(`Using with glob '${glb}' (method through)`, function() {
            var stream = pipe.through(gulp.src(glb));
            expect(isStream(stream)).to.be.true;

            var stream2 = gulp.src(glb);
            initArgs.values.forEach(values => {
              if (!Array.isArray(values)) {
                values = [values];
              }
              const [fn, ...args] = values;
              stream2 = stream2.pipe(fn(...args));
            });

            return equalStreamContents(stream, stream2);
          });

          it(`Using with glob '${glb} (method plugin)'`, function() {
            var stream = gulp.src(glb).pipe(pipe.plugin());

            var stream2 = gulp.src(glb);
            initArgs.values.forEach(values => {
              if (!Array.isArray(values)) {
                values = [values];
              }
              const [fn, ...args] = values;
              stream2 = stream2.pipe(fn(...args));
            });

            return equalStreamContents(stream, stream2);
          });

        });

      });

  });

});
