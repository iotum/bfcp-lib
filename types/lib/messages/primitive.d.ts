/**
 * @classdesc
 * Primitive class is a abstraction of the Message Primitive as defined in
 * the RFCP 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.1
 * @memberof Message
 * @static
 */
export declare enum Primitive {
    /** Gets FloorRequest Primitive */
    FloorRequest = 1,
    /** Gets FloorRelease Primitive */
    FloorRelease = 2,
    /** Gets FloorRequestQuery Primitive */
    FloorRequestQuery = 3,
    /** Gets FloorRequestStatus Primitive */
    FloorRequestStatus = 4,
    /** Gets UserQuery Primitive */
    UserQuery = 5,
    /** Gets UserStatus Primitive */
    UserStatus = 6,
    /** Gets FloorQuery Primitive */
    FloorQuery = 7,
    /** Gets FloorStatus Primitive */
    FloorStatus = 8,
    /** Gets ChairAction Primitive */
    ChairAction = 9,
    /** Gets ChairActionAck Primitive */
    ChairActionAck = 10,
    /** Gets Hello Primitive */
    Hello = 11,
    /** Gets HelloAck Primitive */
    HelloAck = 12,
    /** Gets Error Primitive */
    Error = 13,
    /** Gets FloorRequestStatusAck Primitive */
    FloorRequestStatusAck = 14,
    /** Gets ErrorAck Primitive */
    ErrorAck = 15,
    /** Gets FloorStatusAck Primitive */
    FloorStatusAck = 16,
    /** Gets Goodbye Primitive */
    Goodbye = 17,
    /** Gets GoodbyeAck Primitive */
    GoodbyeAck = 18
}
