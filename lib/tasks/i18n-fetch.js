'use strict';

var path = require('path')

var map = require('map-stream')
var log = require('spm-log')
var vfs = require('vinyl-fs')

module.exports = function() {

  return function(options, next) {

    var src = options.pkg ? options.pkg.dong ?

      // project
      [
        './package.json',
        './index.{html,js,handlebars,json}',
        './{app,mod,lib}/**/*.{html,js,handlebars,json}'
      ] :

      // modules
      [
        './**/*.{html,js,handlebars,json}',
        '!./package.json',
        '!./Gruntfile.js',
        '!./{i18n,tests,tools,examples,node_modules,spm_modules,_site,doc}/**/*'
      ] :

      // never go here
      [
        // nothing todo
      ]

    var extMap = {
      '.handlebars': /(["'>])([^\n"'><]*[^\x00-\x7f]+?[^\n"'><]*)(["'<])/g,
      '.html': /(["'>])([^\n"'><]*[^\x00-\x7f]+?[^\n"'><]*)(["'<])/g,
      '.js': /(')([^\n']*[^\x00-\x7f]+?[^\n']*)(\1)/g,
      '.json': /(")([^\n"]*[^\x00-\x7f]+?[^\n"]*)(\1)/g
    }

    var cnKeys = []

    vfs.src(src, {
        dot: false
      })
      // fetch cnKeys
      .pipe(map(function(file, cb) {
        var regexp = extMap[path.extname(file.history[0])]

        if (regexp) {
          var _keys = file.contents.toString().match(regexp)

          if (_keys) {
            _keys.map(function(_key) {
              return _key.slice(1, -1)
            }).forEach(function(_key) {
              if (cnKeys.indexOf(_key) === -1) {
                cnKeys.push(_key)
              }
            })
          }
        }

        cb(null, file)
      }))
      .on('end', function() {
        log.info('fetch', '获得 ' + cnKeys.length + ' 个待翻译词条')

        options._cnKeys = cnKeys.sort();

        next()
      })

  }

}
