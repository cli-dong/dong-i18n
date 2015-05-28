/*
 * dong-i18n
 * https://github.com/crossjs/dong-i18n
 *
 * Copyright (c) 2015 crossjs
 * Licensed under the MIT license.
 */

'use strict';

var getPkg = require('package')

module.exports = function() {

  var pkg = getPkg('.')

  require('./lib/i18n')(!!pkg.dong)

}
