'use strict';

var fs = require('fs')
var path = require('path')

var replace = require('dong-replace')
var map = require('map-stream')
var log = require('spm-log')
var vfs = require('vinyl-fs')

module.exports = function(options) {
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
      var dirPath = 'i18n'
      var filePath = [dirPath, 'zh-CN.json'].join(path.sep)

      var data

      if (keys.length) {
        data = {}

        keys.forEach(function(key) {
          data[key] = ''
        })

        data = JSON.stringify(data, null, 2)
      }

      if (data) {
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath)
        }

        fs.writeFileSync(filePath, data)

        log.info('i18n', '已生成 ' + filePath + ' 文件')
      } else {
        if (fs.existsSync(dirPath)) {
          fs.readdirSync(dirPath).forEach(function(file) {
            fs.unlinkSync(path.join(dirPath, file))
          })

          fs.rmdirSync(dirPath)

          log.info('i18n', '已清理 ' + dirPath + ' 目录')
        }
      }
    })
}
