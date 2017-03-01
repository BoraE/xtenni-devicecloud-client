// Copyright 2017 Bora Eryilmaz
'use strict';

const express = require('express');
const config = require('./configs/config');

/**
 * Wires together server modules to build a demo application.
 */
class Server {
  /**
   * Starts a web application server.
   */
  constructor() {
    this.startSocket();
    this.startServer();
  }

  /**
   * Starts the HTTP server and the web socket to handle communication
   * with client web applications.
   */
  startServer() {
    const app = express();
    app.set('port', config.server.port);
    app.use(express.static(__dirname + '/../public'));

    // Start the HTTP server
    const server = require('http').Server(app);
    server.listen(app.get('port'), () => {
      console.log('Server listening at port %d.', app.get('port'));
    });

    // Wait for socket connections
    this.io = require('socket.io')(server);
    this.io.on('connection', (socket) => {
      let address = socket.conn.remoteAddress.replace(/[^0-9|.]*/g, '');
      console.log(`Socket connection established from ${address}.`);

      socket.on('request', (req) => {
        //console.log('Request:', req);
        this.handle_client_request(req);
      });

      socket.on('disconnect', () => {
        console.log(`Socket from ${address} disconnected.`);
      });

      socket.on('error', (err) => {
        console.log('Socket error:', err);
      });
    });
  }

  startSocket() {
    const url = `${config.device_cloud.url}:${config.device_cloud.port}`;
    this.device_cloud = require('socket.io-client')(url, {query: {'api_key': config.device_cloud.api_key}});

    this.device_cloud.on('connect', () => {
      console.log('Connected to LMU service at', url);
    });

    this.device_cloud.on('message', (data) => {
      console.log(`Message (Type: ${data.Message.Message_Header.Message_Type}, Event Code: ${data.Message.Message_Contents.Event_Code}) received from ESN:${data.ESN} (VIN:${data.VIN})`);
      this.handle_LMU_message(data);
    });

    this.device_cloud.on('disconnect', () => {
      console.log('Connection to LMU service disconnected');
    });

    this.device_cloud.on('error', (err) => {
      console.log('Error:', err);
    });
  }

  handle_client_request(req) {
    if (this.device_cloud) {
      this.device_cloud.emit('request', req, (data) => {
        //console.log('Response:', data);
        this.handle_LMU_message(data);
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
