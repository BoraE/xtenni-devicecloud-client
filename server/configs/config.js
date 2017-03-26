// Copyright 2017 Bora Eryilmaz
'use strict';

let config = {};

switch (process.env.NODE_ENV) {
case "local":
  config = require('./server_config.json').local;
  break;
case "stage":
  config = require('./server_config.json').stage;
  break;
case "production":
default:
  config = require('./server_config.json').production;
  break;
}

module.exports = config;
