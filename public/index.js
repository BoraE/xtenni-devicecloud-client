//  Copyright 2017 Bora Eryilmaz
require.config({
  baseURL: "./",
  paths: {},
  urlArgs: "bust=" + (new Date()).getTime()
});

require(['app'], function(App) {
  var app = new App();
});
