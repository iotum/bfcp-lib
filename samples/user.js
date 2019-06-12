import { Name } from "../lib/attributes/name";
import {
  FloorRelease, FloorRequest, FloorRequestStatus, FloorStatus,
  Hello, HelloAck, Message,
} from "../lib/messages/message";
import { Primitive } from "../lib/messages/primitive";
import { RequestStatusValue } from "../lib/messages/requestStatusValue";
import * as Parser from "../lib/parser/parser";

/**
 * @classdesc
 * This class is a abstract representation of a User in the BFCP environment,
 * and is used as the primary interface to this library. A User receive and
 * returns BFCP messages totally in the binary form, as like when receiving
 * from TCP/UDP sockets, so the application who utilize it doesn't need to
 * know anything about the codification and decodification of BFCP messages.
 * @memberof bfcp-lib
 */
export class User {

  /**
   * Gets the User ID
   * @return User ID
   */
  get userId() {
    return this._userId;
  }

  set userId(userId) {
    this._userId = userId;
  }

  /**
   * Gets the Conference ID
   * @return Conference ID
   */
  get conferenceId() {
    return this._conferenceId;
  }

  set conferenceId(conferenceId) {
    this._conferenceId = conferenceId;
  }

  /**
   * Gets the current message
   * @return This User last message received by the method
   * 'receiveMessage'
   */
  get currentMessage() {
    return this._currentMessage;
  }

  set currentMessage(currentMessage) {
    this._currentMessage = currentMessage;
  }

  /**
   * Gets the current transaction id
   * @return Current transaction id
   */
  get currentTransactionId() {
    return this._currentTransactionId;
  }

  set currentTransactionId(currentTransactionId) {
    this._currentTransactionId = currentTransactionId;
  }

  /**
   * Gets the wanted floor id
   * @return This user last wanted floor id received by a
   * FloorRequest Message
   */
  get wantedFloorId() {
    return this._wantedFloorId;
  }

  set wantedFloorId(wantedFloorId) {
    this._wantedFloorId = wantedFloorId;
  }

  static floorRequestId = 0;

  /**
   * Gets the actual floor request id
   * @return Floor request id
   * @static
   */
  static getFloorRequestId() {
    return this.floorRequestId;
  }

  /**
   * Increments the actual floor request id
   */
  static incFloorRequestId() {
    this.floorRequestId++;
  }

  /**
   * @param {String} userId       A string representing the User ID
   * @param {String} conferenceId A string representing the Conference ID
   * @constructor
   */
  constructor(userId, conferenceId) {
    this._userId = parseInt(userId, 10);
    this._conferenceId = parseInt(conferenceId, 10);
    this._currentMessage = null;
    this._currentTransactionId = 0;
    this._wantedFloorId = 0;
  }

  /**
   * Receives a buffered message, parses it to a BFCP Message Object,
   * sets it as the current message and returns it.
   * @param  {Buffer} message The buffered Message
   * @return {Message} The BFCP Message Object
   * @public
   */
  receiveMessage(message) {
    try {
      const bfcpMessage = Parser.parseMessage(message);
      this.currentMessage = bfcpMessage;
      return bfcpMessage;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gets a buffered HelloAck message
   * @param  {Hello} helloMessage The Hello message that the HelloAck
   * will respond to.
   * @return {Buffer} The HelloAck buffered message
   * @public 
   */
  helloAckMessage(helloMessage) {
    const helloAck = new HelloAck(this.conferenceId, helloMessage.commonHeader.transactionId, this.userId);
    return Buffer.from(helloAck.encode());
  }

  /**
   * Gets a buffered FloorRequestStatus message
   * @param  {FloorRequest | FloorRelease} message
   * The FloorRequest or Release message that the FloorRequestStatus will respond to.
   * @param  {Number} floorId The floor id
   * @param  {RequestStatusValue} requestStatus The request status
   * @return {Buffer} The FloorRequestStatus buffered message
   * @public
   */
  floorRequestStatusMessage(message, floorId, requestStatus) {
    let floorRequestId;
    if (message.commonHeader.primitive === Primitive.FloorRequest) {
      if (requestStatus === RequestStatusValue.Granted) {
        User.incFloorRequestId();
      }
      floorRequestId = User.getFloorRequestId();
    } else {
      floorRequestId = message.getAttribute(Name.FloorRequestId).content;
    }
    const floorRequestStatus = new FloorRequestStatus(
      this.conferenceId, message.commonHeader.transactionId, this.userId, floorRequestId, floorId, requestStatus);
    return Buffer.from(floorRequestStatus.encode());
  }

  /**
   * Gets a buffered FloorStatus message
   * @param  {Number} floorId The floor id
   * @param  {RequestStatusValue} requestStatus The request status
   * @return {Buffer} The FloorStatus buffered message
   * @public
   */
  floorStatusMessage(floorId, requestStatus) {
    if (this.currentMessage) {
      if (this.currentMessage.commonHeader.transactionId > this.currentTransactionId) {
        this.currentTransactionId = this.currentMessage.commonHeader.transactionId;
      }
    }
    this.currentTransactionId++;
    const floorStatus = new FloorStatus(
      this.conferenceId, this.currentTransactionId, this.userId, User.getFloorRequestId(), floorId, requestStatus);
    return Buffer.from(floorStatus.encode());
  }
}
