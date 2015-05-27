'use strict';

var fs = require('fs')

var replace = require('dong-replace')
var map = require('map-stream')
var log = require('spm-log')
var vfs = require('vinyl-fs')

module.exports = function build(options) {
  var keys = []

  var src = options.pkg.dong ?
    // project
    ['./index.{html,js,handlebars,json}', './{app,mod}/**/*.{html,js,handlebars,json}'] :
    // modules
    ['./**/*.{html,js,handlebars,json}']

  vfs.src(src, {
      dot: false
    })
    // get keys
    .pipe(replace())
    // save
    .pipe(map(function(file, cb) {
      if (file.keys) {
        keys = keys.concat(file.keys.map(function(key) {
          return key.slice(1, -1)
        }))
      }

      cb(null, file)
    }))
    .on('end', function() {
      var filePath = 'i18n/zh-CN.json'

      fs.writeFileSync(filePath, (function() {
        var data = {};

        keys.forEach(function(key) {
          data[key] = ''
        })

        return JSON.stringify(data, null, 2)
      })())

      log.info('i18n', '已生成 ' + filePath + '文件')
    })
}
