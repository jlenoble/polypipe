import gulp from 'gulp';
import cached from 'gulp-cached';
import newer from 'gulp-newer';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import diff from 'gulp-diff';

import PolyPipe from '../src/polypipe';
import {tmpDir} from 'cleanup-wrapper';
import {expectEventuallyFound} from 'stat-again';

describe('Testing README.md examples', function () {
  const dest = 'tmp';

  beforeEach(function () {
    this.cacheName = 'jsFiles';
    this.srcGlob = 'src/**/*.js';
    if (cached.caches[this.cacheName]) {
      delete cached.caches[this.cacheName];
    }
  });

  afterEach(function () {
    if (cached.caches[this.cacheName]) {
      delete cached.caches[this.cacheName];
    }
  });

  it('Basic usage example', tmpDir(dest, function () {
    const pipe = new PolyPipe(
      [cached, this.cacheName],
      [newer, dest],
      sourcemaps.init,
      babel,
      [sourcemaps.write, './'],
      [gulp.dest, dest]
    );

    return new Promise((resolve, reject) => {
      pipe.through(gulp.src(this.srcGlob))
        .on('end', resolve)
        .on('error', reject);
    }).then(() => expectEventuallyFound(dest))
      .then(() => {
        delete cached.caches[this.cacheName];
        return new Promise((resolve, reject) => {
          gulp.src(this.srcGlob)
            .pipe(cached(this.cacheName))
            // .pipe(newer(dest)) Can't use this in test as empties stream
            .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(sourcemaps.write('./'))
            .pipe(diff(dest))
            .pipe(diff.reporter({fail: true}))
            .on('finish', resolve)
            .on('error', reject);
        });
      });
  }));

  it('Chaining example', tmpDir(dest, function () {
    const pipe = (new PolyPipe(babel))
      .prepipe(sourcemaps.init)
      .pipe([sourcemaps.write, './'])
      .prepipe(
        [cached, this.cacheName],
        [newer, dest]
      )
      .pipe([gulp.dest, dest]);


    return new Promise((resolve, reject) => {
      gulp.src(this.srcGlob).pipe(pipe.plugin())
        .on('end', resolve)
        .on('error', reject);
    }).then(() => expectEventuallyFound(dest))
      .then(() => {
        delete cached.caches[this.cacheName];
        return new Promise((resolve, reject) => {
          gulp.src(this.srcGlob)
            .pipe(cached(this.cacheName))
            // .pipe(newer(dest)) Can't use this in test as empties stream
            .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(sourcemaps.write('./'))
            .pipe(diff(dest))
            .pipe(diff.reporter({fail: true}))
            .on('finish', resolve)
            .on('error', reject);
        });
      });
  }));
});
