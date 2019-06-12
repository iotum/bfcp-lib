import { Primitive } from "./primitive";
/**
 * @classdesc
 * CommonHeader class is a abstraction of the CommonHeader as defined in the
 * RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.1
 * @memberof Message
 */
export declare class CommonHeader {
    _primitive: Primitive;
    _payloadLength: number;
    _conferenceId: number;
    _transactionId: number;
    _userId: number;
    _responder: boolean;
    /**
     * @constructor
     * @param primitive     The Message Primitive
     * @param payloadLength The length of the message in 4-octet, excluding the CommonHeader
     * @param conferenceId  The conference id
     * @param transactionId The transaction id
     * @param userId        The user id
     * @param isResponse    The responder flag
     */
    constructor(primitive: Primitive, conferenceId: number, transactionId: number, userId: number);
    primitive: Primitive;
    payloadLength: number;
    conferenceId: number;
    transactionId: number;
    userId: number;
    responderFlag: boolean;
    /**
     * Encodes this CommonHeader instance from object oriented format to the
     * binary format.
     * @return Binary string representing the BFCP CommonHeader
     * @public
     */
    encode(): string;
}
