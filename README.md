# gulp-spcolor2scss
Convert SharePoint spcolor-files to Sass partials

## Installation

Install package with NPM and add it to your development dependencies:
```
npm install --save-dev artokai/gulp-spcolor2scss
```
Currently the package needs to installed directly from this gitub repository,
but it will be added to npm eventually.

## Basic usage

### 1. Use gulp to convert your spcolor file to a scss partial

```javascript
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var spcolor2scss = require('gulp-spcolor2scss');

gulp.task('spcolor', function() {
    return gulp.src('./themes/custom.spcolor', { buffer: true })
        .pipe(spcolor2scss())
        .pipe(header("//\n// This file is autogenerated. Do not edit!\n//\n"))        
        .pipe(gulp.dest('./sass'))        
});

gulp.task('css', ['spcolor'], function() {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('css'));    
});
```

### 2. Import the generated partial to you sass file

```sass
// Original spcolor file was named 'custom.spcolor'
// It has been renamed to "_custom_spcolor.scss" by the plugin
@import "custom_spcolor";
```

### 3. Use the generated sass variables in your styles

The plugin prefixes all spcolor variable names with 'spcolor_' in order 
to avoid collisions with other variables you might be using.

```sass
body {
    background-color: $spcolor_PageBackground;
    color: $spcolor_BodyText;
    font-family: arial, sans-serif;
}

h1 {
    color: $spcolor_HeaderText;
}
```

## Todo:

1. Add unit tests
2. Publish as a npm package

## License
This plugin is licensed using the [The MIT License (MIT)](LICENSE). 
You can use it as you wish, but if you choose to do so, you'll do it at your own risk.



