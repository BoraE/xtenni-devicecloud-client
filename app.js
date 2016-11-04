"use strict";

(function() {
  const url = 'http://ec2-107-22-152-194.compute-1.amazonaws.com:8000';
  const socket = require('socket.io-client')(url);

  const express = require('express');
  const http = require('http');

  const app = express();
  const server = http.Server(app);
  const io = require('socket.io')(server);

  app.set('port', (process.env.PORT || 5000));
  app.use(express.static(__dirname + '/public'));

  server.listen(app.get('port'), () => {
    console.log('Server listening at port %d.', app.get('port'));
  });

  // Wait for socket connections
  io.on('connection', (socket) => {
    console.log('Socket connection established.');

    socket.on('request', (data) => {
      console.log('Request: ', data);
      socket.emit('response', {id: data.id, ESN: data.ESN, message: 'TBD'});
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected.');
    });
  });
  
  
  socket.on('connect', () => {
    console.log('Connected to LMU parser at', url);
  });

  socket.on('message', (data) => {
    console.log('Message:', data);
  });

  socket.on('response', (data) => {
    console.log('Response:', data);
  });

  setInterval( () => {
    socket.emit('request', {
      id: '3A34E03C5B9',
      ESN: '4562061401',
      Message_Type: 8
    });
  }, 90000);

  socket.on('disconnect', () => {
    console.log('Connection to LMU parser disconnected');
  });
}());
