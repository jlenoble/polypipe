import gulp from 'gulp';
import {Transform} from 'stream';

const DestroyableTransform = gulp.src('*.notfound').constructor;

export function isStream(stream) {
  return stream instanceof DestroyableTransform ||
    stream instanceof Transform;
};
