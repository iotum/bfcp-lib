const CommonHeader = require('./commonHeader.js');
const FloorRequestInformation = require('../attributes/floorRequestInformation.js');
const Message = require('./message.js');
const PayloadLength = require('./payloadLength.js');
const Primitive = require('./primitive.js');
const RequestStatusValue = require('./requestStatusValue.js');

/**
 * @classdesc
 * FloorStatus class is a abstraction of the FloorStatus Message
 * as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.3.8
 * @extends Message
 * @memberof Message
 */
class FloorStatus extends Message {
  /**
   * @constructor
   * @param {Number} conferenceId   The conference id
   * @param {Number} transactionId  The transaction id
   * @param {Number} userId         The user id
   * @param {Number} floorRequestId The floor request id
   * @param {Number} floorId        The floor id
   * @param {RequestStatusValue} requestStatus The request status
   */
  constructor(conferenceId, transactionId, userId, floorRequestId, floorId, requestStatus) {
    super(
      new CommonHeader(
        Primitive.FloorStatus,
        PayloadLength.FloorStatus,
        conferenceId,
        transactionId,
        userId
      ),
      [
        new FloorRequestInformation(floorRequestId, floorId, requestStatus),
      ]
    );
  }
}

module.exports = FloorStatus;
