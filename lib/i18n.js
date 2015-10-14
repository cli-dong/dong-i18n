'use strict';

var log = require('spm-log')
var Queue = require('dong-queue')

module.exports = function(options) {
  var queue = new Queue()

  // 取待翻译词条
  queue.use(require('./tasks/i18n-fetch')())

  // 生成 JSON（中文词条）
  queue.use(require('./tasks/i18n-write')())

  // 合并其它
  queue.use(require('./tasks/i18n-merge')())

  log.info('i18n', '开始多语言处理')

  queue.run(options, function() {
    log.info('i18n', '完成多语言处理')
  })
}
