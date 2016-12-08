# polypipe
A helper class to encapsulate stream pipes

## Basic usage

In order to make piping streams more modular/recyclable, you can group them using Node modules such as [stream-combiner](https://www.npmjs.com/package/stream-combiner) or [bun](https://www.npmjs.com/package/bun). PolyPipe is a wrapper class around [stream-combiner](https://www.npmjs.com/package/stream-combiner) to make the handling easier.

```js
import gulp from 'gulp';
import cached from 'gulp-cached';
import newer from 'gulp-newer';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import PolyPipe from 'polypipe';

const pipe = new PolyPipe(
  [cached, 'jsFiles'],
  [newer, 'build/babel'],
  sourcemaps.init,
  babel,
  [sourcemaps.write, './'],
  [gulp.dest, 'build/babel']  
);

pipe.through(gulp.src('src/**/*.js')); // Use it like a function to return the same stream as gulp.src('src/**/*.js')
//   .pipe(cached('jsFiles'))
//   .pipe(newer('build/babel'))
//   .pipe(sourcemaps.init())
//   .pipe(babel())
//   .pipe(sourcemaps.write('./'))
//   .pipe(gulp.dest('build/babel'));

gulp.src('src/**/*.js').pipe(pipe.plugin()); // Use it like a Gulp plugin and return the same stream
```

## Chaining

PolyPipes allow for chaining with methods ```pipe``` and ```prepipe```.

```js
import gulp from 'gulp';
import cached from 'gulp-cached';
import newer from 'gulp-newer';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import PolyPipe from 'polypipe';

const pipe = (new PolyPipe(babel))
  .prepipe(sourcemaps.init)
  .pipe([sourcemaps.write, './'])
  .prepipe(
    [cached, 'jsFiles'],
    [newer, 'build/babel']
  )
  .pipe([gulp.dest, 'build/babel']);

gulp.src('src/**/*.js').pipe(pipe.plugin());
// Does same thing as:
// gulp.src('src/**/*.js')
//   .pipe(cached('jsFiles'))
//   .pipe(newer('build/babel'))
//   .pipe(sourcemaps.init())
//   .pipe(babel())
//   .pipe(sourcemaps.write('./'))
//   .pipe(gulp.dest('build/babel'));
```

## License

polypipe is [MIT licensed](./LICENSE).

© 2016 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
