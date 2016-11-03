import gulp from 'gulp';
import {expect} from 'chai';
import {isStream, allArgs, testGlobs} from './helpers';
import equalStreamContents from 'equal-stream-contents';

describe('Testing PolyPipe', function() {

  allArgs.forEach(args => {

    describe(`Initializing PolyPipe with (${args.description})`,
      function() {

        this.timeout(4000);

        const pipe = args.instantiate();
        testGlobs.forEach(glb => {

          it(`Using with glob '${glb}' (method through)`, function() {
            var stream = pipe.through(gulp.src(glb));
            expect(isStream(stream)).to.be.true;
            return equalStreamContents(stream, args.refStream(glb));
          });

          it(`Using with glob '${glb} (method plugin)'`, function() {
            var stream = gulp.src(glb).pipe(pipe.plugin());
            return equalStreamContents(stream, args.refStream(glb));
          });

        });

      });

  });

});
