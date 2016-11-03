import gulp from 'gulp';
import {noop} from 'gulp-util';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import {expect} from 'chai';
import PolyPipe from '../src/polypipe';
import {isStream} from './helpers';
import equalStreamContents from 'equal-stream-contents';

describe('Testing PolyPipe modularity', function() {

  before(function() {
    this.src = function src() {return gulp.src('gulp/*.js');};
    this.pipe1 = new PolyPipe(babel);
    this.pipe2 = new PolyPipe([noop, [rename, {suffix: '-renamed'}]]);
    this.pipe3 = new PolyPipe([babel, noop, [rename, {suffix: '-renamed'}]]);

    return equalStreamContents(
      this.src().pipe(this.pipe1.plugin()).pipe(this.pipe2.plugin()),
      this.src().pipe(this.pipe3.plugin())
    );
  });

  it(`Combining pipes with method 'pipe'`, function() {
    return Promise.all([
      equalStreamContents(
        this.src().pipe(this.pipe3.plugin()),
        this.src().pipe(this.pipe1.pipe(this.pipe2.initPipes).plugin())
      ),
      equalStreamContents(
        this.src().pipe(this.pipe3.plugin()),
        this.src().pipe(this.pipe1.pipe(this.pipe2).plugin())
      )
    ]);
  });

  it(`Combining pipes with method 'prepipe'`, function() {
    return Promise.all([
      equalStreamContents(
        this.src().pipe(this.pipe3.plugin()),
        this.src().pipe(this.pipe2.prepipe(this.pipe1.initPipes).plugin())
      ),
      equalStreamContents(
        this.src().pipe(this.pipe3.plugin()),
        this.src().pipe(this.pipe2.prepipe(this.pipe1).plugin())
      )
    ]);
  });

});
