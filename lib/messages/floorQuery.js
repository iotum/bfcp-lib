const CommonHeader = require('./commonHeader.js');
const FloorId = require('../attributes/floorId.js');
const Message = require('./message.js');
const PayloadLength = require('./payloadLength.js');
const Primitive = require('./primitive.js');

/**
 * @classdesc
 * FloorQuery class is a abstraction of the FloorQuery Message as defined in the
 * RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.3.7
 * @extends Message
 * @memberof Message
 */
class FloorQuery extends Message {
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
        Primitive.FloorQuery,
        PayloadLength.FloorQuery,
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

module.exports = FloorQuery;
