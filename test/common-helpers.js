import gulp from 'gulp';
import {Transform} from 'stream';

const DestroyableTransform = gulp.src('*.notfound').constructor;

export function isStream (stream) {
  return stream instanceof DestroyableTransform ||
    stream instanceof Transform;
};

export const testGlobs = [
  'gulpfile.babel.js',
  'test/**/*.js',
  [
    'gulpfile.babel.js',
    'test/**/*.js',
    'gulp/*.js',
    '!gulp/globs.js',
  ],
];
