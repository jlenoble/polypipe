# polypipe
A helper class to encapsulate stream pipes

## Basic usage

In order to make piping streams more modular/recyclable, you can group them using Node modules such as [stream-combiner](https://www.npmjs.com/package/stream-combiner) or [bun](https://www.npmjs.com/package/bun). PolyPipe is a wrapper class around [stream-combiner](https://www.npmjs.com/package/stream-combiner) to make the handling easier.

```js
import PolyPipe from 'polypipe';

const pipe = new PolyPipe([
  [cached, 'jsFiles'],
  [newer, 'build/babel'],
  sourcemaps.init,
  babel,
  [sourcemaps.write, './'],
  [gulp.dest, 'build/babel']  
])

pipe.through(gulp.src('src/**/*.js')); // Use it like a function
gulp.src('src/**/*.js').pipe(pipe.plugin()); // Use it like a Gulp plugin
```

## License

polypipe is [MIT licensed](./LICENSE).

© 2016 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
