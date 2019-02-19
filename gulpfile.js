var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create()

// this file created by following directions from:
// https://goede.site/setting-up-gulp-4-for-automatic-sass-compilation-and-css-injection

var src = {
    scssSource: 'scss/*.scss',
    cssDest:  './dist/',
    htmlSource: './dist/*.html'
};

    // Define tasks after requiring dependencies
    function style(){
        // Where should gulp look for the sass files?
        // My .sass files are stored in the styles folder
        // (If you want to use scss files, simply look for *.scss files instead)
        return gulp.src(src.scssSource)
    
            // Use sass with the files found, and log any errors
            .pipe(sass()).on('error', sass.logError)
    
            // What is the destination for the compiled file?
            .pipe(gulp.dest(src.cssDest))

            // Add browsersync stream pipe after compilation
            .pipe(browserSync.stream())
    }
    
    // Expose the task by exporting it
    // This allows you to run it from the commandline using 
    // $ gulp style
    exports.style = style


    // A simple task to reload the page
    function reload(){
        browserSync.reload()
    }


    function watch(){

        browserSync.init({
            // You can tell browserSync to use this directory and serve it as a mini-server
            server: {
                baseDir: "./dist/"
            }
            // If you are already serving your website locally using something like apache
            // You can use the proxy setting to proxy that instead
            // proxy: "yourlocal.dev"
        })

        // gulp.watch takes in the location of the files to watch for changes
        // and the name of the function we want to run on change
        gulp.watch(src.scssSource, style)
        // We should tell gulp which files to watch to trigger the reload
        // This can be html or whatever you're using to develop your website
        // Note -- you can obviously add the path to the Paths object
        gulp.watch(src.htmlSource, reload)
    }
    // Don't forget to expose the task!
    exports.watch = watch
