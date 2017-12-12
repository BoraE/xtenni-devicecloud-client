// Copyright 2017 Bora Eryilmaz
'use strict';

const sc = require('./server_config.json');

let env = process.env.NODE_ENV || 'development';
let common = sc.common;
let config = sc[env];

// Merge
Object.assign(common.device_cloud, config.device_cloud);
Object.assign(config, common);
console.log(config);

module.exports = config;
