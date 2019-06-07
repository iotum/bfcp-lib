const Complements = require('../parser/complements.js');
const Primitive = require('./primitive.js');

/**
 * @classdesc
 * CommonHeader class is a abstraction of the CommonHeader as defined in the
 * RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.1
 * @memberof Message
 */
class CommonHeader {
  /**
   * @constructor
   * @param {Primitive} primitive     The Message Primitive
   * @param {Number}                    payloadLength The length of the message
   *                                                   in 4-octet, excluding the CommonHeader
   * @param {Number}                    conferenceId  The conference id
   * @param {Number}                    transactionId The transaction id
   * @param {Number}                    userId        The user id
   */
  constructor(primitive, payloadLength, conferenceId, transactionId, userId) {
    this._primitive = primitive;
    this._payloadLength = payloadLength;
    this._conferenceId = conferenceId;
    this._transactionId = transactionId;
    this._userId = userId;
  }

  /**
   * Gets the message primitive
   * @return {Primitive} Message Primitive
   * @public
   */
  get primitive() {
    return this._primitive;
  }

  set primitive(primitive) {
    this._primitive = primitive;
  }

  /**
   * Gets the message length in 4-octet (32 bits), excluding the commonHeader
   * @return {Number} The message length
   * @public
   */
  get payloadLength() {
    return this._payloadLength;
  }

  set payloadLength(payloadLength) {
    this._payloadLength = payloadLength;
  }

  /**
   * Gets the conference id
   * @return {Number} Conference id
   * @public
   */
  get conferenceId() {
    return this._conferenceId;
  }

  set conferenceId(conferenceId) {
    this._conferenceId = conferenceId;
  }

  /**
   * Gets the transaction id
   * @return {Number} Transaction id
   * @public
   */
  get transactionId() {
    return this._transactionId;
  }

  set transactionId(transactionId) {
    this._transactionId = transactionId;
  }

  /**
   * Gets the user id
   * @return {Number} User id
   * @public
   */
  get userId() {
    return this._userId;
  }

  set userId(userId) {
    this._userId = userId;
  }

  /**
   * Encodes this CommonHeader instance from object oriented format to the
   * binary format.
   * @return {String} Binary string representing the BFCP CommonHeader
   * @public
   */
  encode() {
    let ver = '001';
    let reserved = '00000';
    let primitive = Complements.complementBinary(this.primitive.toString(2), 8);
    let payloadLength = Complements.complementBinary(this.payloadLength.toString(2), 16);
    let conferenceId = Complements.complementBinary(this.conferenceId.toString(2), 32);
    let transactionId = Complements.complementBinary(this.transactionId.toString(2), 16);
    let userId = Complements.complementBinary(this.userId.toString(2), 16);

    return ver + reserved + primitive + payloadLength + conferenceId +
      transactionId + userId;
  }
}

module.exports = CommonHeader;
