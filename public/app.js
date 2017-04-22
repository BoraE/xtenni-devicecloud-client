// Copyright 2017 Bora Eryilmaz
define([], function(config) {
  'use strict';

  class App {
    constructor() {
      this.markers = {};
      this.routes = {};
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
          mapTypeIds: ['roadmap', 'satellite']
        }
      };
      this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    }

    send_request() {
      const IMEI = ['358683062687414', '358683062267480', '270113183009699599',
                    '358683060203792', '358683060871481', '358683062400081',
                    '358683060656908', '352648069629202', '352648060600103',
                    '357041062469575', '357041062525111', '357041062472835',
                    '357041062542454'];
      IMEI.slice(9,10).forEach((value) => {
        // Action Code (1:reboot, 9:ID, 10:locate, 15:state)
        //const req = {IMEI:value, type:'report_request', code: 10};
        const req = {IMEI:value, type:'last_location_message'};
        //const req = {ID:'5890c157d016366089909a68', IMEI:value, type:'all_messages_after'};
        this.socket.emit('request', req);
      });
    }

    _showMessage(data) {
      //console.log(data);
      const device = data.ESN;
      const message = data.Message;

      if (message === undefined) {
        return;
      }

      const time = new Date().toLocaleTimeString();
      this.messageArea.value += `Message (type: ${message.Message_Header.Message_Type}, code: ${message.Message_Contents.Event_Code}) received from ${device} (VIN: ${data.VIN}, IMEI: ${data.IMEI}) at ${time}\n`;

      if (message.Message_Contents.Longitude) {
        const event = message.Message_Contents.Event_Code;
        const pos = new google.maps.LatLng(message.Message_Contents.Latitude, message.Message_Contents.Longitude);
        this._updateMarkers(device, pos, event, data.VIN);
        this._updateRoutes(device, pos, event);
      }
    }

    _updateMarkers(device, pos, event, VIN) {
      if (!this.markers[device]) {
        this.markers[device] = new google.maps.Marker({
          map: this.map,
          title: `ESN: ${device}\nVIN: ${VIN}`
        });
      }
      this.markers[device].setPosition(pos);
      this.map.setCenter(pos);
      // console.log(this.markers[device]);
    }

    _updateRoutes(device, pos, event) {
      if (!this.routes[device]) {
        this.routes[device] = new google.maps.Polyline({
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
        this.routes[device].setMap(this.map);
      }

      if (event === 101) {
        this.routes[device].moving = true;
        this.routes[device].getPath().clear();
      }

      if (event === 102) {
        this.routes[device].false = true;
      }

      if (this.routes[device].moving) {
        this.routes[device].getPath().push(pos);
      }
      // console.log(this.routes[device]);
    }
  }

  return App;
});
