define([], function(config) {
  'use strict';

  class App {
    constructor() {
      this.socket = io.connect(window.location.host);
      this.messageArea = document.querySelector('#messages');
      this.socket.on('message', data => this._showMessage(data));
    }

    _showMessage(data) {
      const device = data.ESN;
      const time = new Date().toLocaleTimeString();
      this.messageArea.value += `Message received from ${device} at ${time}\n`;
    }
  }

  return App;
});
