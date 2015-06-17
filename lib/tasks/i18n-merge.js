'use strict';

var fs = require('fs')
var path = require('path')

var log = require('spm-log')

module.exports = function() {
  return function(options, next) {
    var folderPath = 'i18n'

    var keys = options._keys

    function merge(dest) {
      var data = require(path.join(process.cwd(), dest))

      var _data = {}

      keys.forEach(function(key) {
        _data[key] = (key in data) ? data[key] : ''
      })

      _data = JSON.stringify(_data, null, 2)

      fs.writeFileSync(dest, _data)

      log.info('merge', '已合并 ' + dest + ' 文件')
    }

    if (keys.length) {

      fs.readdirSync(folderPath).forEach(function(file) {
        if (/\.json$/.test(file) && file !== 'zh-CN.json') {
          merge([folderPath, file].join(path.sep))
        }
      })

    }

    next()
  }
}
