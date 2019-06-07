const CommonHeader = require('./commonHeader.js');
const FloorId = require('../attributes/floorId.js');
const Message = require('./message.js');
const PayloadLength = require('./payloadLength.js');
const Primitive = require('./primitive.js');

/**
 * @classdesc
 * Hello class is a abstraction of the Hello Message as defined in the
 * RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.3.11
 * @extends Message
 * @memberof Message
 */
class Hello extends Message {
  /**
   * @constructor
   * @param {Number} conferenceId  The conference id
   * @param {Number} transactionId The transaction id
   * @param {Number} userId        The user id
   * @param {Number} floorId       The floor id
   */
  constructor(conferenceId, transactionId, userId, floorId) {
    super(
      new CommonHeader(
        Primitive.Hello,
        PayloadLength.Hello,
        conferenceId,
        transactionId,
        userId
      ),
      [
        new FloorId(floorId)
      ]
    );
  }
}

module.exports = Hello;
