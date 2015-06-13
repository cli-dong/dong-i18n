'use strict';

var log = require('spm-log')
var Queue = require('dong-queue')

module.exports = function(options) {
  var queue = new Queue()

  // 取词条
  queue.use(require('./tasks/i18n-fetch')())

  // 生成中文
  queue.use(require('./tasks/i18n-write')())

  // 合并其它
  queue.use(require('./tasks/i18n-merge')())

  queue.run(options, function() {
    log.info('i18n', '已完成多语言处理任务')
  })
}
