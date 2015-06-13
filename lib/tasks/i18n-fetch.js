'use strict';

var replace = require('dong-replace')
var map = require('map-stream')
var log = require('spm-log')
var vfs = require('vinyl-fs')

module.exports = function() {
  return function(options, next) {
    var keys = []

    var src = options.pkg && options.pkg.dong ?

      // project
      [
        './index.{html,js,handlebars,json}',
        './{app,mod,lib}/**/*.{html,js,handlebars,json}'
      ] :

      // modules
      [
        './**/*.{html,js,handlebars,json}',
        '!./package.json',
        '!./Gruntfile.js',
        '!./{i18n,tests,examples,node_modules,spm_modules,_site,doc}/**/*'
      ]

    vfs.src(src, {
        dot: false
      })
      // fetch keys
      .pipe(replace())
      // concat keys
      .pipe(map(function(file, cb) {
        if (file.keys) {
          keys = keys.concat(file.keys.map(function(key) {
            return key.slice(1, -1)
          }))
        }

        cb(null, file)
      }))
      .on('end', function() {
        log.info('fetch', '获得 ' + keys.length + ' 个待翻译词条')

        if (keys.length) {
          options._keys = keys.sort();
        }

        next()
      })
  }
}
