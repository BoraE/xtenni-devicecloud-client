//  Copyright 2017 Bora Eryilmaz
define([], function(config) {
  'use strict';

  class App {
    constructor() {
      this.locations = {};
      this.initMap();
      this.socket = io.connect(window.location.host);
      this.messageArea = document.querySelector('#messages');
      this.socket.on('message', data => this._showMessage(data));
      this.send_request();
    }

    initMap() {
      var mapOptions = {
        center: {lat: 42, lng: -71},
        zoom: 16,
        streetViewControl: false,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP]
        }
      };
      this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    }

    send_request() {
      const IMEI = ['358683062687414', '358683062267480', '270113183009699599'];
      // Action Code (1:reboot, 9:ID, 10:locate, 15:state)
      const req = {IMEI:IMEI[0], type:'report_request', code: 10};
      //const req = {IMEI:IMEI[0], type:'last_location_message'};
      // const req = {ID:'586ecf6e6234d91201c9b33b', IMEI:IMEI[1], type:'all_messages_after'};
      this.socket.emit('request', req);
    }

    _showMessage(data) {
      const device = data.ESN;
      const message = data.Message;
      const time = new Date().toLocaleTimeString();
      this.messageArea.value += `Message (type ${message.Message_Header.Message_Type}) received from ${device} at ${time}\n`;

      if (message.Message_Contents.Longitude) {
        if (!this.locations[device]) {
          this.locations[device] = new google.maps.Marker({
            map: this.map,
            title: `ESN: ${device}\nVIN: ${data.VIN}`
          });
        }

        let pos = {
          lat: message.Message_Contents.Latitude,
          lng: message.Message_Contents.Longitude
        };
        this.locations[device].setPosition(pos);
        this.map.setCenter(pos);
      }
    }
  }

  return App;
});
