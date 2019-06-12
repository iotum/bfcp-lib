import { Attribute } from "../attributes/attribute";
import { Error as Err } from "../attributes/error";
import { Name } from "../attributes/name";
import { CommonHeader } from "./commonHeader";
import { RequestStatusValue } from "./requestStatusValue";
export declare const MESSAGE_HEADER_SIZE = 12;
/**
 * Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3
 */
export declare class Message {
    private _commonHeader;
    private _attributes;
    /**
     * @constructor
     * @param commonHeader The message common header
     * @param attributes   The message list of attributes
     */
    constructor(commonHeader: CommonHeader, attributes?: Attribute[]);
    commonHeader: CommonHeader;
    /**
     * Gets an iterator for the attributes.
     */
    readonly attributes: IterableIterator<Attribute>;
    /**
     * Gets the message attribute that contains the name received. If this
     * message haven't this attribute, returns null.
     * @param  attributeName The attribute Name
     */
    getAttribute(attributeName: Name): Attribute;
    /**
     * Adds an attribute object and updates the message length in the header.
     * @param attribute The attribute object
     */
    addAttribute(attribute: Attribute): void;
    /**
     * Encodes this Message instance from object oriented format to the binary
     * format. This process encode the CommonHeader and all attributes.
     */
    encode(): number[];
}
/**
 * FloorRequest Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.1
 */
export declare class FloorRequest extends Message {
    /**
     * @constructor
     * @param conferenceId   The conference id
     * @param transactionId  The transaction id
     * @param userId         The user id
     * @param floorId        The floor id
     * @param beneficiaryId  The beneficiary id (optional)
     */
    constructor(conferenceId: number, transactionId: number, userId: number, floorIds?: number[]);
}
/**
 * FloorRelease Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.2
 */
export declare class FloorRelease extends Message {
    /**
     * @constructor
     * @param conferenceId   The conference id
     * @param transactionId  The transaction id
     * @param userId         The user id
     * @param floorRequestId The floor request id
     */
    constructor(conferenceId: number, transactionId: number, userId: number, floorRequestId: number);
}
/**
 * FloorRequestQuery Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.3
 */
export declare class FloorRequestQuery extends Message {
    /**
     * @constructor
     * @param conferenceId   The conference id
     * @param transactionId  The transaction id
     * @param userId         The user id
     * @param floorRequestId The floor request id
     */
    constructor(conferenceId: number, transactionId: number, userId: number, floorRequestId: number);
}
/**
 * FloorRequestStatus Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.4
 */
export declare class FloorRequestStatus extends Message {
    /**
     * @constructor
     * @param conferenceId   The conference id
     * @param transactionId  The transaction id
     * @param userId         The user id
     * @param floorRequestId The floor request id
     * @param floorId        The floor id
     * @param requestStatus  The request status
     * @param isResponse     The responder flag
     */
    constructor(conferenceId: number, transactionId: number, userId: number, floorRequestId: number, floorId: number, requestStatus: RequestStatusValue, isResponse?: boolean);
}
/**
 * UserQuery Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.5
 */
export declare class UserQuery extends Message {
    /**
     * @constructor
     * @param conferenceId  The conference id
     * @param transactionId The transaction id
     * @param userId        The user id
     * @param beneficiaryId The beneficiary id (Optional)
     */
    constructor(conferenceId: number, transactionId: number, userId: number, beneficiaryId?: number);
}
/**
 * UserStatus Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.6
 */
export declare class UserStatus extends Message {
    /**
     * @constructor
     * @param conferenceId    The conference id
     * @param transactionId   The transaction id
     * @param userId          The user id
     * @param floorRequestId  The floor request id
     * @param requestStatus   The request status
     * @param beneficiaryId   The beneficiary id (optional)
     */
    constructor(conferenceId: number, transactionId: number, userId: number, floorRequestId: number, requestStatus: RequestStatusValue, beneficiaryId: number);
}
/**
 * FloorQuery Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.7
 */
export declare class FloorQuery extends Message {
    /**
     * @constructor
     * @param conferenceId   The conference id
     * @param transactionId  The transaction id
     * @param userId         The user id
     * @param floorId        The floor id
     */
    constructor(conferenceId: number, transactionId: number, userId: number, floorId: number);
}
/**
 * FloorStatus Message
 * as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.8
 */
export declare class FloorStatus extends Message {
    /**
     * @constructor
     * @param conferenceId   The conference id
     * @param transactionId  The transaction id
     * @param userId         The user id
     * @param floorRequestId The floor request id
     * @param floorId        The floor id
     * @param requestStatus  The request status
     * @param isResponse     The responder flag
     */
    constructor(conferenceId: number, transactionId: number, userId: number, floorRequestId: number, floorId?: number, requestStatus?: RequestStatusValue, isResponse?: boolean);
}
/**
 * Hello Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.11
 */
export declare class Hello extends Message {
    /**
     * @constructor
     * @param conferenceId  The conference id
     * @param transactionId The transaction id
     * @param userId        The user id
     * @param floorId       The floor id
     */
    constructor(conferenceId: number, transactionId: number, userId: number, floorId?: number);
}
/**
 * HelloAck Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.12
 */
export declare class HelloAck extends Message {
    /**
     * @constructor
     * @param conferenceId  The conference id
     * @param transactionId The transaction id
     * @param userId        The user id
     */
    constructor(conferenceId: number, transactionId: number, userId: number);
}
/**
 * Error Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.13
 */
export declare class Error extends Message {
    /**
     * @constructor
     * @param conferenceId  The conference id
     * @param transactionId The transaction id
     * @param userId        The user id
     * @param  errorCode     The error code
     */
    constructor(conferenceId: number, transactionId: number, userId: number, errorCode: Err, errorInfo?: string);
}
/**
 * FloorRequestStatusAck Message
 * extended from the RFC 4582 - BFCP
 */
export declare class FloorRequestStatusAck extends Message {
    /**
     * @constructor
     * @param conferenceId   The conference id
     * @param transactionId  The transaction id
     * @param userId         The user id
     */
    constructor(conferenceId: number, transactionId: number, userId: number);
}
/**
 * ErrorAck Message
 * extended from the RFC 4582 - BFCP
 */
export declare class ErrorAck extends Message {
    /**
     * @constructor
     * @param conferenceId   The conference id
     * @param transactionId  The transaction id
     * @param userId         The user id
     */
    constructor(conferenceId: number, transactionId: number, userId: number);
}
/**
 * FloorStatusAck Message
 * extended from the RFC 4582 - BFCP
 */
export declare class FloorStatusAck extends Message {
    /**
     * @constructor
     * @param conferenceId   The conference id
     * @param transactionId  The transaction id
     * @param userId         The user id
     */
    constructor(conferenceId: number, transactionId: number, userId: number);
}
/**
 * Goodbye Message
 * extended from the RFC 4582 - BFCP
 */
export declare class Goodbye extends Message {
    /**
     * @constructor
     * @param conferenceId  The conference id
     * @param transactionId The transaction id
     * @param userId        The user id
     */
    constructor(conferenceId: any, transactionId: any, userId: any);
}
/**
 * GoodbyeAck Message
 * extended from the RFC 4582 - BFCP
 */
export declare class GoodbyeAck extends Message {
    /**
     * @constructor
     * @param conferenceId  The conference id
     * @param transactionId The transaction id
     * @param userId        The user id
     */
    constructor(conferenceId: number, transactionId: number, userId: number);
}
