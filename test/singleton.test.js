import gulp from 'gulp';
import {noop} from 'gulp-util';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import {expect} from 'chai';
import PolyPipe from '../src/polypipe';

describe('PolyPipe is singleton class', function() {

  it(`Instance returned by ctor is a singleton`, function() {

    const g1 = new PolyPipe(rename, {suffix: '-renamed'});
    const g2 = new PolyPipe(babel);
    const g3 = new PolyPipe(rename, {suffix: '-renamed'});

    return Promise.all([
      expect(g1).not.to.equal(g2),
      expect(g1).to.equal(g3)
    ]);

  });

});
