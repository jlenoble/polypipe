import gulp from 'gulp';
import {testGlobs} from './common-helpers';
import {allArgs} from './polypipe-helpers';
import equalStreamContents from 'equal-stream-contents';

describe('Testing class PolyPipe', function () {
  allArgs.forEach(args => {
    describe(`Initializing PolyPipe with (${args.description})`,
      function () {
        this.timeout(4000);

        const pipe = args.instantiate();
        testGlobs.forEach(glb => {
          it(`Using with glob '${glb}' (method through)`, function () {
            const stream = pipe.through(gulp.src(glb));
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
