import gulp from 'gulp';
import {expect} from 'chai';
import {isStream, testGlobs} from './common-helpers';
import {argsAsPlugins} from './monopipe-helpers';
import equalStreamContents from 'equal-stream-contents';

describe('Testing class MonoPipe', function () {
  argsAsPlugins.forEach(args => {
    describe(`Initializing MonoPipe with (${args.description})`,
      function () {
        this.timeout(4000);

        const pipe = args.instantiate();
        testGlobs.forEach(glb => {
          it(`Using with glob '${glb}' (method through)`, function () {
            const stream = pipe.through(gulp.src(glb));
            expect(isStream(stream)).to.be.true;
            return equalStreamContents(stream, args.refStream(glb));
          });

          it(`Using with glob '${glb} (method plugin)'`, function () {
            const stream = gulp.src(glb).pipe(pipe.plugin());
            return equalStreamContents(stream, args.refStream(glb));
          });
        });
      });
  });
});
