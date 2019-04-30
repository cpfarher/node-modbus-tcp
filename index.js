// // create an empty modbus client
// var ModbusRTU = require("modbus-serial");
// var client = new ModbusRTU();
// 
// // open connection to a tcp line
// client.connectTCP("10.0.0.9", {
  // port: 502
// });
// client.setID(1);
// 
// // read the values of 10 registers starting at address 0
// // on device number 1. and log the values to the console.
// var start=0
// var step = 124
// setInterval(function () {
  // start+=step
  // client.readHoldingRegisters(start, step, function (err, data) {
    // console.log(err);
  // });
// }, 1000);

const node_modbus = require('node-modbus')

const client = node_modbus.client.tcp.complete({
  'host': '10.0.0.9',
  /* IP or name of server host */
  'port': 502,
  /* well known Modbus port */
  'unitId': 1,
  'timeout': 2000,
  /* 2 sec */
  'autoReconnect': true,
  /* reconnect on connection is lost */
  'reconnectTimeout': 15000,
  /* wait 15 sec if auto reconnect fails to often */
  'logLabel': 'ModbusClientTCP',
  /* label to identify in log files */
  'logLevel': 'debug',
  /* for less log use: info, warn or error */
  'logEnabled': false
})

client.connect()
var start=0
var step=124

function readHoldingRegisters(client, start, step) {
  return new Promise(resolve=>{
    client.readHoldingRegisters(start, step).then((response) => {
      resolve(response)
    });
  });
}

async function doRequest(client, start, step) {
  var startTime = new Date().getTime();
  var times = 100;
  var total = 0;
  for (let i = 0; i < times; i++) {
    var data = await readHoldingRegisters(client, start, step)
    total+=data.register.length
    start += step;
  }

  var endTime = new Date().getTime();
  console.log((total)+' '+(endTime - startTime) + ' ms');
}

client.on('connect', function () {
  
  doRequest(client,start,step).then(v=>{
    console.log('fin');
  })  
  

})