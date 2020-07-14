const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
// const concat = require("gulp-concat");
// const htmlmin = require("gulp-htmlmin");
// const terser = require("gulp-terser"); // terser == uglify

//============================================ Styles scss ======================================//
gulp.task("scss", function () {
    return gulp
        .src("./src/scss/*scss")
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                errorLogToConsole: true,
            })
        )
        .on("error", console.error.bind(console))
        .pipe(autoprefixer(["last 5 versions", "> 1%", "ie 7"], { cascade: true }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./public/css/"));
});

// ============================================ Watching files ======================================//
gulp.task("watchFiles", function () {
    gulp.watch("./src/scss/**/*scss", gulp.parallel("scss"));
});

//============================================ Task "styles" & "scripts" ======================================//
gulp.task("default", gulp.parallel("scss", "watchFiles"));
