const assert = require('assert');
const BFCPLib = require('../out/index');
const helper = require('./helper');

const testTemplate = {
  id: '',
  data: ``,
  verify: (msg) => { },
  doc: ``
};

const testHello = {
  id: "Hello",
  data: `
    20 0b 00 01 00 00 00 01 00 02 00 01 05 04 00 01`,
  verify: (msg) => {
    assert.strictEqual(msg.commonHeader.primitive, 11);
    assert.strictEqual(msg.commonHeader.payloadLength, 1);
    assert.strictEqual(msg.commonHeader.conferenceId, 1);
    assert.strictEqual(msg.commonHeader.transactionId, 2);
    assert.strictEqual(msg.commonHeader.userId, 1);

    const attributes = [...msg.attributes];
    assert.strictEqual(attributes.length, 1);
    // FloorID
    assert.strictEqual(attributes[0].type, 2);
    assert.strictEqual(attributes[0].length, 4);
    assert.strictEqual(attributes[0].content, 1);
  },
  doc: `Binary Floor Control Protocol
    001. .... = Version(ver): 1
    ...0 .... = Transaction Responder (R): False
    .... 0... = Fragmentation (F): False
    Primitive: Hello (11)
    Payload Length: 1
    Conference ID: 1
    Transaction ID: 2
    User ID: 1
    0000 010. = Attribute Type: FloorID (2)
        .... ...1 = Mandatory bit(M): True
        Attribute Length: 4
        FLOOR-ID: 1
  `
};


const testHelloAck = {
  id: "HelloAck",
  data: `
    30 0c 00 0a 00 00 00 01 00 01 00 01 17 14 01 02
    03 04 05 06 07 08 0b 0c 0d 0e 0f 10 11 12 00 00
    15 14 02 04 06 08 0a 0c 0e 10 12 14 16 18 1a 1c
    1e 20 22 24`,
  verify: (msg) => {
    assert.strictEqual(msg.commonHeader.primitive, 12);
    assert.strictEqual(msg.commonHeader.payloadLength, 10);
    assert.strictEqual(msg.commonHeader.conferenceId, 1);
    assert.strictEqual(msg.commonHeader.transactionId, 1);
    assert.strictEqual(msg.commonHeader.userId, 1);

    const attributes = [...msg.attributes];
    assert.strictEqual(attributes.length, 2);
    // SupportedPrimitives
    assert.strictEqual(attributes[0].type, 11);
    assert.strictEqual(attributes[0].length, 20);
    assert.strictEqual(attributes[0].content.length, 18);
    // SupportedAttributes
    assert.strictEqual(attributes[1].type, 10);
    assert.strictEqual(attributes[1].length, 20);
    assert.strictEqual(attributes[1].content.length, 18);
  },
  doc: `Binary Floor Control Protocol
    001. .... = Version(ver): 1
    ...1 .... = Transaction Responder (R): True
    .... 0... = Fragmentation (F): False
    Primitive: HelloAck (12)
    Payload Length: 10
    Conference ID: 1
    Transaction ID: 1
    User ID: 1
    0001 011. = Attribute Type: SupportedPrimitives (11)
        .... ...1 = Mandatory bit(M): True
        Attribute Length: 20
        Supported Primitive: FloorRequest (1)
        Supported Primitive: FloorRelease (2)
        Supported Primitive: FloorRequestQuery (3)
        Supported Primitive: FloorRequestStatus (4)
        Supported Primitive: UserQuery (5)
        Supported Primitive: UserStatus (6)
        Supported Primitive: FloorQuery (7)
        Supported Primitive: FloorStatus (8)
        Supported Primitive: Hello (11)
        Supported Primitive: HelloAck (12)
        Supported Primitive: Error (13)
        Supported Primitive: FloorRequestStatusAck (14)
        Supported Primitive: ErrorAck (15)
        Supported Primitive: FloorStatusAck (16)
        Supported Primitive: Goodbye (17)
        Supported Primitive: GoodbyeAck (18)
        Supported Primitive: <Invalid Primitive> (0)
        Supported Primitive: <Invalid Primitive> (0)
    0001 010. = Attribute Type: SupportedAttributes (10)
        .... ...1 = Mandatory bit(M): True
        Attribute Length: 20
        0000 001. = Supported Attribute: BeneficiaryID (1)
        0000 010. = Supported Attribute: FloorID (2)
        0000 011. = Supported Attribute: FloorRequestID (3)
        0000 100. = Supported Attribute: Priority (4)
        0000 101. = Supported Attribute: RequestStatus (5)
        0000 110. = Supported Attribute: ErrorCode (6)
        0000 111. = Supported Attribute: ErrorInfo (7)
        0001 000. = Supported Attribute: ParticipantProvidedInfo (8)
        0001 001. = Supported Attribute: StatusInfo (9)
        0001 010. = Supported Attribute: SupportedAttributes (10)
        0001 011. = Supported Attribute: SupportedPrimitives (11)
        0001 100. = Supported Attribute: UserDisplayName (12)
        0001 101. = Supported Attribute: UserURI (13)
        0001 110. = Supported Attribute: BeneficiaryInformation (14)
        0001 111. = Supported Attribute: FloorRequestInformation (15)
        0010 000. = Supported Attribute: RequestedByInformation (16)
        0010 001. = Supported Attribute: FloorRequestStatus (17)
        0010 010. = Supported Attribute: OverallRequestStatus (18)
  `
};

const testFloorStatus = {
  id: 'FloorStatus',
  data: `
    20 08 00 05 00 00 00 01 00 03 00 01 05 04 00 01
    1f 10 00 01 25 08 00 01 0b 04 06 00 23 04 00 01`,
  verify: (msg) => {
    assert.strictEqual(msg.commonHeader.primitive, 8);
    assert.strictEqual(msg.commonHeader.payloadLength, 5);
    assert.strictEqual(msg.commonHeader.conferenceId, 1);
    assert.strictEqual(msg.commonHeader.transactionId, 3);
    assert.strictEqual(msg.commonHeader.userId, 1);

    const attributes = [...msg.attributes];
    assert.strictEqual(attributes.length, 2);
    // FloorID
    assert.strictEqual(attributes[0].type, 2);
    assert.strictEqual(attributes[0].length, 4);
    assert.strictEqual(attributes[0].content, 1);
    // FloorRequestInformation
    assert.strictEqual(attributes[1].type, 15);
    assert.strictEqual(attributes[1].length, 16);
    assert.strictEqual(attributes[1].floorRequestId, 1);
    // OverallRequestStatus
    assert.strictEqual(attributes[1].content[1].type, 18);
    assert.strictEqual(attributes[1].content[1].length, 8);
    assert.strictEqual(attributes[1].content[1].floorRequestId, 1);
    // RequestStatus
    assert.strictEqual(attributes[1].content[1].content[1].type, 5);
    assert.strictEqual(attributes[1].content[1].content[1].length, 4);
    assert.deepStrictEqual(attributes[1].content[1].content[1].requestStatus, 6);
    assert.deepStrictEqual(attributes[1].content[1].content[1].queuePosition, 0);
    // FloorRequestStatus
    assert.strictEqual(attributes[1].content[2].type, 17);
    assert.strictEqual(attributes[1].content[2].length, 4);
    assert.strictEqual(attributes[1].content[2].floorId, 1); // FLOOR-ID
  },
  doc: `Binary Floor Control Protocol
    001. .... = Version(ver): 1
    ...0 .... = Transaction Responder (R): False
    .... 0... = Fragmentation (F): False
    Primitive: FloorStatus (8)
    Payload Length: 5
    Conference ID: 1
    Transaction ID: 3
    User ID: 1
    0000 010. = Attribute Type: FloorID (2)
        .... ...1 = Mandatory bit(M): True
        Attribute Length: 4
        FLOOR-ID: 1
    0001 111. = Attribute Type: FloorRequestInformation (15)
        .... ...1 = Mandatory bit(M): True
        Attribute Length: 16
        FLOOR-REQUEST-ID: 1
        0010 010. = Attribute Type: OverallRequestStatus (18)
            .... ...1 = Mandatory bit(M): True
            Attribute Length: 8
            FLOOR-REQUEST-ID: 1
            0000 101. = Attribute Type: RequestStatus (5)
                .... ...1 = Mandatory bit(M): True
                Attribute Length: 4
                Request Status: Released (6)
                Queue Position: 0
        0010 001. = Attribute Type: FloorRequestStatus (17)
            .... ...1 = Mandatory bit(M): True
            Attribute Length: 4
            FLOOR-ID: 1
  `
};

const testFloorRequestStatus = {
  id: 'FloorRequestStatus',
  data: `
    30 04 00 04 00 00 00 01 00 04 00 01 1f 10 00 02
    25 08 00 02 0b 04 03 00 23 04 00 01`,
  verify: (msg) => {
    assert.strictEqual(msg.commonHeader.primitive, 4);
    assert.strictEqual(msg.commonHeader.payloadLength, 4);
    assert.strictEqual(msg.commonHeader.conferenceId, 1);
    assert.strictEqual(msg.commonHeader.transactionId, 4);
    assert.strictEqual(msg.commonHeader.userId, 1);

    const attributes = [...msg.attributes];
    assert.strictEqual(attributes.length, 1);
    // FloorRequestInformation
    assert.strictEqual(attributes[0].type, 15);
    assert.strictEqual(attributes[0].length, 16);
    assert.strictEqual(attributes[0].floorRequestId, 2);
    // OverallRequestStatus
    assert.strictEqual(attributes[0].content[1].type, 18);
    assert.strictEqual(attributes[0].content[1].length, 8);
    assert.strictEqual(attributes[0].content[1].floorRequestId, 2);
    // RequestStatus
    assert.strictEqual(attributes[0].content[1].content[1].type, 5);
    assert.strictEqual(attributes[0].content[1].content[1].length, 4);
    assert.strictEqual(attributes[0].content[1].content[1].requestStatus, 3);
    assert.strictEqual(attributes[0].content[1].content[1].queuePosition, 0);
    // FloorRequestStatus
    assert.strictEqual(attributes[0].content[2].type, 17);
    assert.strictEqual(attributes[0].content[2].length, 4);
    assert.strictEqual(attributes[0].content[2].floorId, 1);
  },
  doc: `Binary Floor Control Protocol
    001. .... = Version(ver): 1
    ...1 .... = Transaction Responder (R): True
    .... 0... = Fragmentation (F): False
    Primitive: FloorRequestStatus (4)
    Payload Length: 4
    Conference ID: 1
    Transaction ID: 4
    User ID: 1
    0001 111. = Attribute Type: FloorRequestInformation (15)
        .... ...1 = Mandatory bit(M): True
        Attribute Length: 16
        FLOOR-REQUEST-ID: 2
        0010 010. = Attribute Type: OverallRequestStatus (18)
            .... ...1 = Mandatory bit(M): True
            Attribute Length: 8
            FLOOR-REQUEST-ID: 2
            0000 101. = Attribute Type: RequestStatus (5)
                .... ...1 = Mandatory bit(M): True
                Attribute Length: 4
                Request Status: Granted (3)
                Queue Position: 0
        0010 001. = Attribute Type: FloorRequestStatus (17)
            .... ...1 = Mandatory bit(M): True
            Attribute Length: 4
            FLOOR-ID: 1
  `
};

const main = () => {
  [
    testHello,
    testHelloAck,
    testFloorStatus,
    testFloorRequestStatus,
  ].forEach(test => {
    console.info(`TEST [${test.id}]: BEGIN`);
    const msg = BFCPLib.Parser.parseMessage(helper.fromHex(test.data));
    test.verify(msg);
    console.info(`TEST [${test.id}]: PASS`);
  });
};

main();
