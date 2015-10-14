'use strict';

var fs = require('fs')
var path = require('path')

var log = require('spm-log')

module.exports = function() {

  return function(options, next) {

    var folderPath = 'i18n'
    var filePath = [folderPath, 'zh-CN.json'].join(path.sep)

    var cnKeys = options._cnKeys
    var data

    if (cnKeys.length) {
      data = {}

      cnKeys.forEach(function(key) {
        data[key] = ''
      })

      data = JSON.stringify(data, null, 2)

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
      }

      fs.writeFileSync(filePath, data)

      log.info('write', '已生成 ' + filePath + ' 文件')
    }
    // 未找到待翻译字段，清理多语言目录
    else if (options.clean) {
      if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach(function(file) {
          fs.unlinkSync(path.join(folderPath, file))
        })

        fs.rmdirSync(folderPath)

        log.info('clean', '已清理 ' + folderPath + ' 目录')
      }
    }

    next()

  }

}
