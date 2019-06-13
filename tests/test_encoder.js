const assert = require('assert');
const BFCPLib = require('../out/index');
const helper = require('./helper');

const testTemplate = {
  id: '',
  data: ``,
  create: () => { },
};

const testHello = {
  id: 'Hello',
  output: `
    20 0b 00 01 00 00 00 02  00 01 00 01-05 04 00 01`,
  create: () => {
    const conferenceId = 2;
    const transactionId = 1;
    const userId = 1;
    const floorId = 1;
    const msg = new BFCPLib.Hello(conferenceId, transactionId, userId, floorId);
    return msg;
  },
};

const testHelloAck = {
  id: 'HelloAck',
  request: `
    20 0b 00 01 00 00 00 02  00 03 00 03-05 04 00 01`,
  output: `
    30 0c 00 06 00 00 00 02  00 03 00 03<17 0b 01 02
    07 08 0b 0c 10 11 12>00 <15 0a 02 04 06 0a 14 16
    22 24>00 00`,
  create: (msg) => {
    const conferenceId = msg ? msg.commonHeader.conferenceId : 2;
    const transactionId = msg ? msg.commonHeader.transactionId : 1;
    const userId = msg ? msg.commonHeader.userId : 1;
    const ack = new BFCPLib.HelloAck(conferenceId, transactionId, userId);
    return ack;
  },
};

const testFloorRequest = {
  id: 'FloorRequest',
  output: `
    20 01 00 01 00 00 00 01  00 04 00 01-05 04 00 01`,
  create: () => {
    const conferenceId = 1;
    const transactionId = 4;
    const userId = 1;
    const floorId = 1;
    const msg = new BFCPLib.FloorRequest(conferenceId, transactionId, userId, floorId);
    return msg;
  },
};

const testFloorRelease = {
  id: 'FloorRelease',
  output: `
    20 02 00 01 00 00 00 01 00 05 00 01-07 04 00 02`,
  create: () => {
    const conferenceId = 1;
    const transactionId = 5;
    const userId = 1;
    const floorReqId = 2;
    const msg = new BFCPLib.FloorRelease(conferenceId, transactionId, userId, floorReqId);
    return msg;
  },
};

const main = () => {
  [
    testHello,
    testHelloAck,
    testFloorRequest,
    testFloorRelease,
  ].forEach(test => {
    console.info(`TEST [${test.id}]: BEGIN`);
    const request = test.request ? helper.fromHex(test.request) : undefined;
    const expected = helper.fromHex(test.output);
    const msg = test.create(
      request ? BFCPLib.Parser.parseMessage(request) : undefined
    );
    // console.debug(msg);
    const actual = msg.encode();
    assert.deepStrictEqual(
      actual,
      expected,
      `\nActual:\n${helper.toHex(actual)}\nExpected\n${helper.toHex(expected)}`
    );
    console.info(`TEST [${test.id}]: PASS`);
  });
};

main();
