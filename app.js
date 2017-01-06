"use strict";
(function() {
  const url = 'http://ec2-107-22-152-194.compute-1.amazonaws.com:8000';
  // const url = 'http://localhost:8000';
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

  const IMEI = ['358683062687414', '358683062267480', '270113183009699599'];
  // Action Code (1:reboot, 9:ID, 10:locate, 15:state)
  // const req = {IMEI:IMEI[2], type:'report_request', code: 10};
  // const req = {IMEI:IMEI[1], type:'last_location_message'};
  const req = {ID:'586ecf6e6234d91201c9b33b', IMEI:IMEI[1], type:'all_messages_after'};

  socket.emit('request', req, (data) => {
    console.log(require('util').inspect(data, false, null))
  });
}());
