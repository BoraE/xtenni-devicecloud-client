//  Copyright 2017 Bora Eryilmaz
'use strict';

const express = require('express');

class Server {
  constructor() {
    this.startSocket();
    this.startServer();
  }

  startSocket() {
    const url = 'http://ec2-107-22-152-194.compute-1.amazonaws.com:8000';
    // const url = 'http://localhost:8000';
    this.device_cloud = require('socket.io-client')(url);

    this.device_cloud.on('connect', () => {
      console.log('Connected to LMU service at', url);
    });

    this.device_cloud.on('message', (data) => {
      console.log('Message:', data);
      this.handle_LMU_message(data);
    });

    this.device_cloud.on('disconnect', () => {
      console.log('Connection to LMU service disconnected');
    });
  }

  startServer() {
    const app = express();
    app.set('port', (process.env.PORT || 8000));
    app.use(express.static(__dirname + '/../public'));

    // Start the HTTP server
    const server = require('http').Server(app);
    server.listen(app.get('port'), () => {
      console.log('Server listening at port %d.', app.get('port'));
    });

    // Wait for socket connections
    this.io = require('socket.io')(server);
    this.io.on('connection', (socket) => {
      console.log(`Socket connection established from ${socket.conn.remoteAddress}.`);

      socket.on('request', (req) => {
        console.log('Request:', req);
        this.handle_client_request(req);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected.');
      });
    });
  }

  handle_client_request(req) {
    if (this.device_cloud) {
      this.device_cloud.emit('request', req, (data) => {
        console.log(data);
      });
    }
  }

  handle_LMU_message(data) {
    if (this.io) {
      this.io.emit('message', data);
    }
  }
}

module.exports = Server;

