// Copyright 2017 Bora Eryilmaz
'use strict';

let config = {};

if (process.env.NODE_ENV === "stage") {
  config = require('./server_config.json').stage;
} else {
  config = require('./server_config.json').production;
}

module.exports = config;
