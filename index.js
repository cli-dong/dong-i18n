/*
 * dong-i18n
 * https://github.com/crossjs/dong-i18n
 *
 * Copyright (c) 2015 crossjs
 * Licensed under the MIT license.
 */

'use strict';

var extend = require('extend')
var getPkg = require('package')

module.exports = function(options) {

  var pkg = getPkg('.')

  options = extend({
    force: false
  }, pkg && pkg.dong || {}, options)

  options.pkg = pkg;

  require('./lib/i18n')(options)

}
