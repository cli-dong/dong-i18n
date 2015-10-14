'use strict';

var fs = require('fs')
var path = require('path')

var log = require('spm-log')

module.exports = function() {

  return function(options, next) {

    var folderPath = 'i18n'
    var dictFolder

    var cnKeys = options._cnKeys

    if (options.dict) {
      dictFolder = path.resolve(process.cwd(), options.dict)
    } else {
      dictFolder = path.resolve(__dirname, '../dicts')
    }

    function merge(dest) {
      var dict = path.join(dictFolder, path.basename(dest))

      if (fs.existsSync(dict)) {
        dict = require(dict)
      } else {
        dict = {}
      }

      var data = require(path.join(process.cwd(), dest))

      Object.keys(data)
      .forEach(function(key) {
        if (data[key]) {
          dict[key] = data[key]
        }
      })

      var result = {}
      var hasValue = []
      var nonValue = []

      cnKeys.forEach(function(key) {
        dict[key] ? hasValue.push(key) : nonValue.push(key);
      })

      hasValue.concat(nonValue).forEach(function(key) {
        result[key] = (dict.hasOwnProperty(key)) ? dict[key] : ''
      })

      result = JSON.stringify(result, null, 2)

      fs.writeFileSync(dest, result)

      log.info('merge', '已合并 ' + dest + ' 文件')
    }

    if (cnKeys.length) {
      var langs = []


      if (options.lang) {
        langs = [options.lang]
      } else if (options.pkg.dong) {
        // project
        langs = options.pkg.dong.i18n
      }

      // generating {lang-AREA}.json
      langs.forEach(function(name) {
        var dest = path.join(folderPath, name + '.json')

        if (!fs.existsSync(dest)) {
          fs.writeFileSync(dest, '{}')
        }
      })

      if (options.lang) {
        merge([folderPath, options.lang + '.json'].join(path.sep))
      } else {
        fs.readdirSync(folderPath).forEach(function(file) {
          if (/\.json$/.test(file) && file !== 'zh-CN.json') {
            merge([folderPath, file].join(path.sep))
          }
        })
      }

    }

    next()

  }

}
