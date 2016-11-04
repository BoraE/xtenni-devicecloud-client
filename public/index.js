require.config({
  baseURL: "./",
  paths: {},
  urlArgs: "bust=" + (new Date()).getTime()
});

require(['app'], function(App) {
  var app = new App();
});
