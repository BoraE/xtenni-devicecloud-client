"use strict";
(function() {
  const url = 'http://ec2-107-22-152-194.compute-1.amazonaws.com:8000';
  const socket = require('socket.io-client')(url);

  socket.on('connect', () => {
    console.log('Connected to LMU service at', url);
  });

  socket.on('message', (data) => {
    console.log('Message:', data);
  });

  socket.on('disconnect', () => {
    console.log('Connection to LMU service disconnected');
  });

  setInterval(() => {
    const req = {IMEI:"358683062687414", type:"last_location_message"};
    socket.emit('request', req, (data) => {
      console.log('Last Message:', data);
    });
  }, 60000);
}());
