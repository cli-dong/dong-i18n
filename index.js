/*
 * dong-i18n
 * https://github.com/crossjs/dong-i18n
 *
 * Copyright (c) 2015 crossjs
 * Licensed under the MIT license.
 */

'use strict';

module.exports = {
  command: 'i18n',
  description: '提取待翻译字段/合并已翻译文件',
  // options: [],
  bootstrap: require('./lib/i18n'),
  strict: true
}
