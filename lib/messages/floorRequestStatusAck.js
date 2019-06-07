const CommonHeader = require('./commonHeader.js');
const FloorId = require('../attributes/floorId.js');
const Message = require('./message.js');
const PayloadLength = require('./payloadLength.js');
const Primitive = require('./primitive.js');

/**
 * @classdesc
 * FloorRequestStatusAck class is a abstraction of the FloorRequestStatusAck Message
 * extended from the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582
 * @extends Message
 * @memberof Message
 */
class FloorRequestStatusAck extends Message {
  /**
   * @constructor
   * @param {Number} conferenceId   The conference id
   * @param {Number} transactionId  The transaction id
   * @param {Number} userId         The user id
   * @param {Number} floorId        The floor id
   */
  constructor(conferenceId, transactionId, userId, floorId) {
    super(
      new CommonHeader(
        Primitive.FloorRequest,
        PayloadLength.FloorRequestStatusAck,
        conferenceId,
        transactionId,
        userId
      ),
      [
        new FloorId(floorId),
      ]
    );
  }
}

module.exports = FloorRequestStatusAck;
