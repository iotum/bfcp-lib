import { Primitive } from "../messages/primitive";
import { RequestPriority } from "../messages/priority";
import { RequestStatusValue } from "../messages/requestStatusValue";
import { Error as Err } from "./error";
import { Format } from "./format";
import { Type } from "./type";
export declare const ATTRIBUTE_HEADER_SIZE = 2;
declare type Content = number | string | Array<number | string | Attribute>;
/**
 * Attribute class is an abstraction of the Attribute as defined in the
 * RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2
 * @memberof bfcp-lib
 */
export declare abstract class Attribute {
    private _type;
    private _mandatory;
    private _length;
    private _format;
    private _content;
    /**
     * @constructor
     * @param type    Attribute Type
     * @param format  Attribute format
     * @param content The attribute content, which can be an Integer, or other attributes, depending of the format
     */
    constructor(type: Type, length: number, format: Format, content: Content);
    type: number;
    length: number;
    format: Format;
    content: Content;
    mandatory: boolean;
    getContentAttriute(type: Type): string | number | Attribute;
    /**
     * Encodes this Attribute instance from object oriented format to the binary
     * format.
     * @return Binary string representing the BFCP Attribute
     * @public
     */
    encode(): string;
    /**
     * Encodes the Grouped type attribute content.
     * @return Binary string representing the BFCP object content
     * @private
     */
    private _encodeGroupedAttributeContent;
    /**
     * Encodes the OctetString type attribute content.
     * @return Binary string representing the BFCP object content
     * @private
     */
    private _encodeOctetStringContent;
    /**
     * Encodes the OctetString16 type attribute content.
     * @return Binary string representing the BFCP object content
     * @private
     */
    private _encodeOctetString16Content;
}
/**
 * BeneficiaryId class is an abstraction of the BeneficiaryId attribute
 * as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.1
 * @extends Attribute
 */
export declare class BeneficiaryId extends Attribute {
    static decode(data: Uint8Array): BeneficiaryId;
    /**
     * @constructor
     * @param beneficiaryId The beneficiary id integer
     */
    constructor(beneficiaryId: number);
    readonly beneficiaryId: Content;
}
/**
 * FloorId class is an abstraction of the FloorId attribute
 * as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.2
 * @extends Attribute
 */
export declare class FloorId extends Attribute {
    static decode(data: Uint8Array): FloorId;
    /**
     * @constructor
     * @param floorId The floor id
     */
    constructor(floorId: number);
    readonly floorId: Content;
}
/**
 * FloorRequestId class is an abstraction of the FloorRequestId attribute
 * as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.3
 * @extends Attribute
 */
export declare class FloorRequestId extends Attribute {
    static decode(data: Uint8Array): FloorRequestId;
    /**
     * @constructor
     * @param floorRequestId The floor request id
     */
    constructor(floorRequestId: number);
    readonly floorRequestId: Content;
}
export declare class Priority extends Attribute {
    static decode(data: Uint8Array): Priority;
    constructor(priority: RequestPriority);
    readonly floorId: Content;
}
/**
 * RequestStatus class is an abstraction of the RequestStatus attribute as
 * defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.5
 * @extends Attribute
 */
export declare class RequestStatus extends Attribute {
    static decode(data: Uint8Array): RequestStatus;
    /**
     * @constructor
     * @param requestStatus The request status
     * @param queuePosition The queue position
     */
    constructor(requestStatus: RequestStatusValue, queuePosition?: number);
    readonly requestStatus: number;
    readonly queuePosition: number;
}
/**
 * ErrorCode class is an abstraction of the ErrorCode attribute
 * as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.2
 * @extends Attribute
 */
export declare class ErrorCode extends Attribute {
    static decode(data: Uint8Array): ErrorCode;
    /**
     * @constructor
     * @param errorCode The error code
     */
    constructor(errorCode: Err, errorInfo?: string);
    readonly errorCode: number;
}
export declare class ErrorInfo extends Attribute {
    static decode(data: Uint8Array): ErrorInfo;
    constructor(errorInfo: string);
    readonly errorInfo: Content;
}
export declare class ParticipantProvidedInfo extends Attribute {
    static decode(data: Uint8Array): ParticipantProvidedInfo;
    constructor(partProviderInfo: string);
    readonly partProviderInfo: Content;
}
export declare class StatusInfo extends Attribute {
    static decode(data: Uint8Array): StatusInfo;
    constructor(statusInfo: string);
    readonly statusInfo: Content;
}
export declare class UserDisplayName extends Attribute {
    static decode(data: Uint8Array): UserDisplayName;
    constructor(userDisplayName: string);
    readonly userDisplayName: Content;
}
export declare class UserUri extends Attribute {
    static decode(data: Uint8Array): UserUri;
    constructor(userUri: string);
    readonly userUri: Content;
}
/**
 * The BENEFICIARY-INFORMATION attribute is a grouped attribute that
 * consists of a header, which is referred to as BENEFICIARY-
 * INFORMATION-HEADER, followed by a sequence of attributes.
 * @extends Attribute
 */
export declare class BeneficiaryInformation extends Attribute {
    static decode(data: Uint8Array): BeneficiaryInformation;
    constructor(beneficiaryId: number, attributes?: Attribute[]);
    readonly beneficiaryId: number;
}
/**
 * The FLOOR-REQUEST-INFORMATION attribute is a grouped attribute that
 * consists of a header, followed by a sequence of attributes.
 * @extends Attribute
 */
export declare class FloorRequestInformation extends Attribute {
    static decode(data: Uint8Array): FloorRequestInformation;
    /**
     * @constructor
     * @param floorRequestId The floor request id
     * @param floorId        The floor id
     * @param requestStatus  The request status
     */
    constructor(floorRequestId: number, attributes?: Attribute[]);
    readonly floorRequestId: number;
    readonly floorId: number;
    readonly requestStatus: {
        queuePosition: number;
        requestStatus: number;
    };
}
/**
 * The REQUESTED-BY-INFORMATION attribute is a grouped attribute that
 * consists of a header, followed by a sequence of attributes.
 */
export declare class RequestedByInformation extends Attribute {
    static decode(data: Uint8Array): RequestedByInformation;
    constructor(requestedById: number, attributes?: Attribute[]);
    readonly requestedById: number;
}
/**
 * The FLOOR-REQUEST-STATUS attribute is a grouped attribute that
 * consists of a header, followed by a sequence of attributes.
 * @extends Attribute
 */
export declare class FloorRequestStatus extends Attribute {
    static decode(data: Uint8Array): FloorRequestStatus;
    /**
     * @constructor
     * @param floorId       The floor id
     * @param requestStatus The request status
     */
    constructor(floorId: number, attributes?: Attribute[]);
    readonly floorId: number;
}
/**
 * The OVERALL-REQUEST-STATUS attribute is a grouped attribute that
 * consists of a header, followed by a sequence of attributes.
 * @extends Attribute
 */
export declare class OverallRequestStatus extends Attribute {
    static decode(data: Uint8Array): OverallRequestStatus;
    /**
     * @constructor
     * @param floorRequestId The request status
     */
    constructor(floorRequestId: number, attributes?: Attribute[]);
    readonly floorRequestId: number;
    readonly requestStatus: {
        queuePosition: number;
        requestStatus: number;
    };
}
/**
 * SupportedAttributes class is an abstraction of the SupportedAttributes
 * attribute as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.10
 * @extends Attribute
 */
export declare class SupportedAttributes extends Attribute {
    static decode(data: Uint8Array): SupportedAttributes;
    /**
     * @constructor
     * @param attributes A Attribute Type list
     * representing the supported attributes
     */
    constructor(attributes?: Type[]);
    readonly suportedAttributes: (string | number | Attribute)[];
}
/**
 * SupportedPrimitives class is an abstraction of the SupportedPrimitives
 * attribute as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.11
 * @extends Attribute
 */
export declare class SupportedPrimitives extends Attribute {
    static decode(data: Uint8Array): SupportedPrimitives;
    /**
     * @constructor
     * @param primitives A Message Primitive list
     * representing the supported primitives (messages)
     */
    constructor(primitives?: Primitive[]);
    readonly supportedPrimitives: (string | number | Attribute)[];
}
export {};
