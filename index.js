/**
 * bfcp-lib: A simple library for BFCP protocol
 * @module bfcp-lib
 */

const BFCPLib = {
  'Parser': require('./lib/parser/parser.js'),
  'Attributes': {
    'Attribute': require('./lib/attributes/attribute.js'),
    'BeneficiaryId': require('./lib/attributes/beneficiaryId.js'),
    'FloorId': require('./lib/attributes/floorId.js'),
    'FloorRequestId': require('./lib/attributes/floorRequestId.js'),
    'FloorRequestInformation': require('./lib/attributes/floorRequestInformation.js'),
    'FloorRequestStatusAtr': require('./lib/attributes/floorRequestStatus.js'),
    'Format': require('./lib/attributes/format.js'),
    'Length': require('./lib/attributes/length.js'),
    'Name': require('./lib/attributes/name.js'),
    'RequestStatus': require('./lib/attributes/requestStatus.js'),
    'SupportedAttributes': require('./lib/attributes/supportedAttributes.js'),
    'SupportedPrimitives': require('./lib/attributes/supportedPrimitives.js'),
    'Type': require('./lib/attributes/type.js'),
  },
  'CommonHeader': require('./lib/messages/commonHeader.js'),
  'FloorQuery': require('./lib/messages/floorQuery.js'),
  'FloorRelease': require('./lib/messages/floorRelease.js'),
  'FloorRequest': require('./lib/messages/floorRequest.js'),
  'FloorRequestStatus': require('./lib/messages/floorRequestStatus.js'),
  'FloorRequestStatusAck': require('./lib/messages/floorRequestStatusAck.js'),
  'FloorStatus': require('./lib/messages/floorStatus.js'),
  'FloorStatusAck': require('./lib/messages/floorStatusAck.js'),
  'Hello': require('./lib/messages/hello.js'),
  'HelloAck': require('./lib/messages/helloAck.js'),
  'Message': require('./lib/messages/message.js'),
  'PayloadLength': require('./lib/messages/payloadLength.js'),
  'Primitive': require('./lib/messages/primitive.js'),
  'RequestStatusValue': require('./lib/messages/requestStatusValue.js'),
}

module.exports = BFCPLib;
