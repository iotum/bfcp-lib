import * as Complements from "../parser/complements";
import { Primitive } from "./primitive";

/*
  The following is the format of the common header.

     0                   1                   2                   3
     0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    | Ver |R|F| Res |  Primitive    |        Payload Length         |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                         Conference ID                         |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |         Transaction ID        |            User ID            |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    | Fragment Offset (if F is set) | Fragment Length (if F is set) |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
*/
/**
 * @classdesc
 * CommonHeader class is a abstraction of the CommonHeader as defined in the
 * RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.1
 * @memberof Message
 */
export class CommonHeader {
  public _primitive: Primitive;
  public _payloadLength = 0;
  public _conferenceId: number;
  public _transactionId: number;
  public _userId: number;
  public _responder = false;

  /**
   * @constructor
   * @param primitive     The Message Primitive
   * @param payloadLength The length of the message in 4-octet, excluding the CommonHeader
   * @param conferenceId  The conference id
   * @param transactionId The transaction id
   * @param userId        The user id
   * @param isResponse    The responder flag
   */
  constructor(primitive: Primitive, conferenceId: number, transactionId: number, userId: number) {
    this._primitive = primitive;
    this._payloadLength = 0;
    this._conferenceId = conferenceId;
    this._transactionId = transactionId;
    this._userId = userId;
  }

  get primitive(): Primitive {
    return this._primitive;
  }
  set primitive(primitive) {
    this._primitive = primitive;
  }

  get payloadLength(): number {
    return this._payloadLength;
  }
  set payloadLength(payloadLength) {
    this._payloadLength = payloadLength;
  }

  get conferenceId(): number {
    return this._conferenceId;
  }
  set conferenceId(conferenceId) {
    this._conferenceId = conferenceId;
  }

  get transactionId(): number {
    return this._transactionId;
  }
  set transactionId(transactionId) {
    this._transactionId = transactionId;
  }

  get userId(): number {
    return this._userId;
  }
  set userId(userId) {
    this._userId = userId;
  }

  get responderFlag(): boolean {
    return this._responder;
  }
  set responderFlag(responder) {
    this._responder = responder;
  }

  /**
   * Encodes this CommonHeader instance from object oriented format to the
   * binary format.
   * @return Binary string representing the BFCP CommonHeader
   * @public
   */
  public encode(): string {
    const ver = "001";
    const responder = this._responder ? "1" : "0";
    const fragmentation = "0";
    const reserved = "000";
    const primitive = Complements.complementBinary(this.primitive, 8);
    const payloadLength = Complements.complementBinary(this.payloadLength, 16);
    const conferenceId = Complements.complementBinary(this.conferenceId, 32);
    const transactionId = Complements.complementBinary(this.transactionId, 16);
    const userId = Complements.complementBinary(this.userId, 16);

    return ver + responder + fragmentation + reserved +
      primitive + payloadLength + conferenceId + transactionId + userId;
  }
}
