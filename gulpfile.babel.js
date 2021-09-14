import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import gulp from 'gulp';
import sass from 'gulp-sass';
import clean from 'gulp-purgecss';
import { init as server, stream, reload } from 'browser-sync';
import plumber from 'gulp-plumber';

const production = true;

//Variables/constantes
const cssPlugins = [cssnano(), autoprefixer()];
//const cssPlugins = [autoprefixer()];

gulp.task('sass', () => {
  return gulp
    .src('./src/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sourcemaps.write("."))
    .pipe(
      sass({
        outputStyle: production ? 'compressed' : 'expanded'
        // outputStyle: 'expanded'
      })
    )
    .pipe(postcss(cssPlugins))
    .pipe(gulp.dest('.'))
    .pipe(stream());
});

gulp.task('clean', () => {
  return gulp
    .src('*.css')
    .pipe(plumber())
    .pipe(
      clean({
        content: ['*.html'],
        safelist: [/^wrapper/],
        whitelist: [
          'red',
          'text-center',
          /^wrapper$/,
        ],
        whitelistPatternsChildren: [/^sf-menu$/, /^EditorPanel$/, /^wrapper$/]
      })
    )
    .pipe(gulp.dest('.'));
});


gulp.task('default', () => {
  server({
    server: '.'
  });
  gulp.watch(['*.html', './src/**/*.scss'], gulp.series('sass', 'clean')).on('change', reload)
});
