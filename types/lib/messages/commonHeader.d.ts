import { Primitive } from "./primitive";
/**
 * @classdesc
 * CommonHeader class is a abstraction of the CommonHeader as defined in the
 * RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.1
 * @memberof Message
 */
export declare class CommonHeader {
    private _primitive;
    private _payloadLength;
    private _conferenceId;
    private _transactionId;
    private _userId;
    private _responder;
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
    /** The Message Primitive */
    primitive: Primitive;
    /** The length of the message in 4-octet, excluding the CommonHeader */
    payloadLength: number;
    /** The conference id */
    conferenceId: number;
    /** The transaction id */
    transactionId: number;
    /** The user id */
    userId: number;
    /** The responder flag */
    responderFlag: boolean;
    /**
     * Encodes this CommonHeader instance from object oriented format to the
     * binary format.
     * @return Binary string representing the BFCP CommonHeader
     * @public
     */
    encode(): string;
}
