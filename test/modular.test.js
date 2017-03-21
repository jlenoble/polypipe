import gulp from 'gulp';
import {noop} from 'gulp-util';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import PolyPipe from '../src/polypipe';
import equalStreamContents from 'equal-stream-contents';

describe('Testing PolyPipe modularity', function () {
  this.timeout(4000);
  before(function () {
    this.src = function () {
      return gulp.src('gulp/*.js');
    };
    this.pipe1 = new PolyPipe(babel);
    this.pipe2 = new PolyPipe(noop, [rename, {suffix: '-renamed'}]);
    this.pipe3 = new PolyPipe(babel, noop, [rename, {suffix: '-renamed'}]);

    return equalStreamContents(
      this.src().pipe(this.pipe1.plugin()).pipe(this.pipe2.plugin()),
      this.src().pipe(this.pipe3.plugin())
    );
  });

  it(`Combining pipes with method 'pipe'`, function () {
    return Promise.all([
      equalStreamContents(
        this.src().pipe(this.pipe3.plugin()),
        this.src().pipe(this.pipe1.pipe(...this.pipe2.initArgs).plugin())
      ),
      equalStreamContents(
        this.src().pipe(this.pipe3.plugin()),
        this.src().pipe(this.pipe1.pipe(this.pipe2).plugin())
      ),
    ]);
  });

  it(`Combining pipes with method 'prepipe'`, function () {
    return Promise.all([
      equalStreamContents(
        this.src().pipe(this.pipe3.plugin()),
        this.src().pipe(this.pipe2.prepipe(...this.pipe1.initArgs).plugin())
      ),
      equalStreamContents(
        this.src().pipe(this.pipe3.plugin()),
        this.src().pipe(this.pipe2.prepipe(this.pipe1).plugin())
      ),
    ]);
  });

  it(`Chaining pipes`, function () {
    return Promise.all([
      equalStreamContents(
        this.src().pipe(this.pipe3.plugin()),
        (new PolyPipe(noop))
          .prepipe(babel)
          .pipe([rename, {suffix: '-renamed'}])
          .through(this.src())
      ),
      equalStreamContents(
        this.src().pipe(this.pipe3.plugin()),
        (new PolyPipe(noop))
          .pipe([rename, {suffix: '-renamed'}])
          .prepipe(babel)
          .through(this.src())
      ),
    ]);
  });
});
