import { Primitive } from "../messages/primitive";
import { RequestPriority } from "../messages/priority";
import { RequestStatusValue } from "../messages/requestStatusValue";
import * as Complements from "../parser/complements";
import { getInteger, getString, parseAttributes } from "../parser/parser";
import { Error as Err } from "./error";
import { Format } from "./format";
import { Type } from "./type";

export const ATTRIBUTE_HEADER_SIZE = 2;

type Content = number | string | Array<number | string | Attribute>;

/**
 * Attribute class is an abstraction of the Attribute as defined in the
 * RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2
 * @memberof bfcp-lib
 */
export abstract class Attribute {
  private _type: number;
  private _mandatory = true;
  private _length: number;
  private _format: Format;
  private _content: Content;

  /**
   * @constructor
   * @param type    Attribute Type
   * @param format  Attribute format
   * @param content The attribute content, which can be an Integer, or other attributes, depending of the format
   */
  constructor(
    type: Type,
    length: number,
    format: Format,
    content: Content,
  ) {
    this._type = type;
    this._length = length;
    this._format = format;
    this._content = content;
  }

  get type() {
    return this._type;
  }

  set type(type) {
    this._type = type;
  }

  get length() {
    return this._length;
  }

  set length(length) {
    this._length = length;
  }

  get format() {
    return this._format;
  }

  set format(format) {
    this._format = format;
  }

  get content() {
    return this._content;
  }

  set content(content) {
    this._content = content;
  }

  get mandatory() {
    return this._mandatory;
  }

  set mandatory(mandatary: boolean) {
    this._mandatory = mandatary;
  }

  /**
   * Encodes this Attribute instance from object oriented format to the binary
   * format.
   * @return Binary string representing the BFCP Attribute
   * @public
   */
  public encode(): string {
    const type = Complements.complementBinary(this.type, 7);
    const mandatary = this.mandatory ? "1" : "0";
    const length = Complements.complementBinary(this.length, 8);
    let content = null;

    switch (this.format) {
      case Format.Unsigned16:
        content = Complements.complementBinary((this.content as number), 16);
        break;

      case Format.Grouped:
        content = this._encodeGroupedAttributeContent();
        break;

      case Format.OctetString:
        content = this._encodeOctetStringContent();
        break;

      case Format.OctetString16:
        content = this._encodeOctetString16Content();
        break;

      default:
        throw new Error("I can't encode this attribute. Format unknown.");
    }

    return Complements.complementPadding(type + mandatary + length + content);
  }

  /**
   * Encodes the Grouped type attribute content.
   * @return Binary string representing the BFCP object content
   * @private
   */
  private _encodeGroupedAttributeContent(): string {
    let newContent = "";

    for (const attribute of (this.content as any[])) {
      if (attribute instanceof Attribute) {
        newContent = newContent + attribute.encode();
      } else if (typeof attribute === "number") {
        newContent = newContent + Complements.complementBinary(attribute, 16);
      } else if (typeof attribute === "string" || attribute instanceof String) {
        newContent = newContent + attribute;
      } else {
        throw new Error("Unknown attribute!");
      }
    }

    return newContent;
  }

  /**
   * Encodes the OctetString type attribute content.
   * @return Binary string representing the BFCP object content
   * @private
   */
  private _encodeOctetStringContent(): string {
    let newContent = "";

    switch (this.type) {
      case Type.SupportedAttributes:
        for (const attributeType of (this.content as number[])) {
          newContent = newContent + Complements.complementBinary(attributeType, 7) + "0";
        }
        return newContent;

      case Type.SupportedPrimitives:
        for (const primitiveType of (this.content as number[])) {
          newContent = newContent + Complements.complementBinary(primitiveType, 8);
        }
        return newContent;

      default:
        throw new Error("I can't encode this octet string attribute. Type unknown.");
    }
  }

  /**
   * Encodes the OctetString16 type attribute content.
   * @return Binary string representing the BFCP object content
   * @private
   */
  private _encodeOctetString16Content(): string {
    switch (this.type) {
      case Type.RequestStatus:
        const requestStatus = Complements.complementBinary(this.content[0], 8);
        const queuePosition = Complements.complementBinary(this.content[1], 8);
        return requestStatus + queuePosition;

      default:
        throw new Error("I can't encode this octet string 16 attribute. Type unknown.");
    }
  }
}

/**
 * BeneficiaryId class is an abstraction of the BeneficiaryId attribute
 * as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.1
 * @extends Attribute
 */
export class BeneficiaryId extends Attribute {
  public static decode(data: Uint8Array) {
    // 2-byte
    const beneficiaryId = getInteger(data);
    return new BeneficiaryId(beneficiaryId);
  }

  /**
   * @constructor
   * @param beneficiaryId The beneficiary id integer
   */
  constructor(beneficiaryId: number) {
    super(Type.BeneficiaryId, 2 + ATTRIBUTE_HEADER_SIZE, Format.Unsigned16, beneficiaryId);
  }

  public get beneficiaryId() {
    return this.content;
  }
}

/**
 * FloorId class is an abstraction of the FloorId attribute
 * as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.2
 * @extends Attribute
 */
export class FloorId extends Attribute {
  public static decode(data: Uint8Array) {
    // 2-byte
    const floorId = getInteger(data);
    return new FloorId(floorId);
  }

  /**
   * @constructor
   * @param floorId The floor id
   */
  constructor(floorId: number) {
    super(Type.FloorId, 2 + ATTRIBUTE_HEADER_SIZE, Format.Unsigned16, floorId);
  }

  public get floorId() {
    return this.content;
  }
}

/**
 * FloorRequestId class is an abstraction of the FloorRequestId attribute
 * as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.3
 * @extends Attribute
 */
export class FloorRequestId extends Attribute {
  public static decode(data: Uint8Array) {
    // 2-byte
    const floorRequestId = getInteger(data);
    return new FloorRequestId(floorRequestId);
  }

  /**
   * @constructor
   * @param floorRequestId The floor request id
   */
  constructor(floorRequestId: number) {
    super(Type.FloorRequestId, 2 + ATTRIBUTE_HEADER_SIZE, Format.Unsigned16, floorRequestId);
  }

  public get floorRequestId() {
    return this.content;
  }
}

export class Priority extends Attribute {
  public static decode(data: Uint8Array) {
    // 2-byte
    const priority = getInteger(data) >> 5;
    return new Priority(priority);
  }

  constructor(priority: RequestPriority) {
    super(Type.Priority, 2 + ATTRIBUTE_HEADER_SIZE, Format.Unsigned16, priority);
  }

  public get floorId() {
    return this.content;
  }
}

/**
 * RequestStatus class is an abstraction of the RequestStatus attribute as
 * defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.5
 * @extends Attribute
 */
export class RequestStatus extends Attribute {
  public static decode(data: Uint8Array) {
    // 1-byte x 2
    const requestStatus = getInteger(data, 0, 1);
    const queuePosition = getInteger(data, 1, 1);
    return new RequestStatus(requestStatus, queuePosition);
  }

  /**
   * @constructor
   * @param requestStatus The request status
   * @param queuePosition The queue position
   */
  constructor(requestStatus: RequestStatusValue, queuePosition = 0) {
    const content = [
      requestStatus,
      queuePosition,
    ];

    super(Type.RequestStatus, 1 + 1 + ATTRIBUTE_HEADER_SIZE, Format.OctetString16, content);
  }

  public get requestStatus() {
    if (this.content instanceof Array) {
      return this.content[0];
    }
  }

  public get queuePosition() {
    if (this.content instanceof Array) {
      return this.content[1];
    }
  }
}

/**
 * ErrorCode class is an abstraction of the ErrorCode attribute
 * as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.2
 * @extends Attribute
 */
export class ErrorCode extends Attribute {
  public static decode(data: Uint8Array) {
    // 1-byte
    const errorCode = getInteger(data, 0, 1);
    let errorInfo = null;
    if (data.length > 1) {
      /* We have Error Specific Details */
      errorInfo = getString(data, 1);
    }
    return new ErrorCode(errorCode, errorInfo);
  }

  /**
   * @constructor
   * @param errorCode The error code
   */
  constructor(errorCode: Err, errorInfo?: string) {
    const content = [];
    content.push(errorCode);
    if (errorInfo) {
      content.push(errorInfo); // optional
    }
    super(Type.ErrorCode, 1 + (errorInfo ? errorInfo.length : 0) + ATTRIBUTE_HEADER_SIZE, Format.Grouped, content);
  }

  public get errorCode() {
    if (this.content instanceof Array) {
      return this.content[0];
    }
  }
}

/* string attributes */

export class ErrorInfo extends Attribute {
  public static decode(data: Uint8Array) {
    return new ErrorInfo(getString(data));
  }

  constructor(errorInfo: string) {
    super(Type.ErrorInfo, errorInfo.length + ATTRIBUTE_HEADER_SIZE, Format.Grouped, [errorInfo]);
  }

  public get errorInfo() {
    return this.content;
  }
}

export class ParticipantProvidedInfo extends Attribute {
  public static decode(data: Uint8Array) {
    return new ParticipantProvidedInfo(getString(data));
  }

  constructor(partProviderInfo: string) {
    super(Type.ErrorInfo, partProviderInfo.length + ATTRIBUTE_HEADER_SIZE, Format.Grouped, [partProviderInfo]);
  }

  public get partProviderInfo() {
    return this.content;
  }
}

export class StatusInfo extends Attribute {
  public static decode(data: Uint8Array) {
    return new StatusInfo(getString(data));
  }

  constructor(statusInfo: string) {
    super(Type.ErrorInfo, statusInfo.length + ATTRIBUTE_HEADER_SIZE, Format.Grouped, [statusInfo]);
  }

  public get statusInfo() {
    return this.content;
  }
}

export class UserDisplayName extends Attribute {
  public static decode(data: Uint8Array) {
    return new UserDisplayName(getString(data));
  }

  constructor(userDisplayName: string) {
    super(Type.ErrorInfo, userDisplayName.length + ATTRIBUTE_HEADER_SIZE, Format.Grouped, [userDisplayName]);
  }

  public get userDisplayName() {
    return this.content;
  }
}

export class UserUri extends Attribute {
  public static decode(data: Uint8Array) {
    return new UserUri(getString(data));
  }

  constructor(userUri: string) {
    super(Type.ErrorInfo, userUri.length + ATTRIBUTE_HEADER_SIZE, Format.Grouped, [userUri]);
  }

  public get userUri() {
    return this.content;
  }
}

/* grouped attributes */

/**
 * The BENEFICIARY-INFORMATION attribute is a grouped attribute that
 * consists of a header, which is referred to as BENEFICIARY-
 * INFORMATION-HEADER, followed by a sequence of attributes.
 * @extends Attribute
 */
export class BeneficiaryInformation extends Attribute {
  public static decode(data: Uint8Array) {
    const beneficiaryId = getInteger(data, 0, 2);
    const attributes = parseAttributes(data.slice(2));
    return new BeneficiaryInformation(beneficiaryId, attributes);
  }

  constructor(beneficiaryId: number, attributes: Attribute[] = []) {
    const content = [];
    content.push(beneficiaryId);
    content.push(...attributes);
    super(Type.BeneficiaryInformation, 2 + sumLengths(attributes) + ATTRIBUTE_HEADER_SIZE, Format.Grouped, content);
  }

  public get beneficiaryId() {
    if (this.content instanceof Array) {
      return this.content[0];
    }
  }
}

/**
 * The FLOOR-REQUEST-INFORMATION attribute is a grouped attribute that
 * consists of a header, followed by a sequence of attributes.
 * @extends Attribute
 */
export class FloorRequestInformation extends Attribute {
  public static decode(data: Uint8Array) {
    const requestedById = getInteger(data, 0, 2);
    const attributes = parseAttributes(data.slice(2));
    return new FloorRequestInformation(requestedById, attributes);
  }

  /**
   * @constructor
   * @param floorRequestId The floor request id
   * @param floorId        The floor id
   * @param requestStatus  The request status
   */
  constructor(floorRequestId: number, attributes: Attribute[] = []) {
    const content = [];
    content.push(floorRequestId);
    content.push(...attributes);
    super(Type.FloorRequestInformation, 2 + sumLengths(attributes) + ATTRIBUTE_HEADER_SIZE, Format.Grouped, content);
  }

  public get floorRequestId() {
    if (this.content instanceof Array) {
      return this.content[0];
    }
  }
}

/**
 * The REQUESTED-BY-INFORMATION attribute is a grouped attribute that
 * consists of a header, followed by a sequence of attributes.
 */
export class RequestedByInformation extends Attribute {
  public static decode(data: Uint8Array) {
    const requestedById = getInteger(data, 0, 2);
    const attributes = parseAttributes(data.slice(2));
    return new RequestedByInformation(requestedById, attributes);
  }

  constructor(requestedById: number, attributes: Attribute[] = []) {
    const content = [];
    content.push(requestedById);
    content.push(...attributes);
    super(Type.RequestedByInformation, 2 + sumLengths(attributes) + ATTRIBUTE_HEADER_SIZE, Format.Grouped, content);
  }

  public get requestedById() {
    if (this.content instanceof Array) {
      return this.content[0];
    }
  }
}

/**
 * The FLOOR-REQUEST-STATUS attribute is a grouped attribute that
 * consists of a header, followed by a sequence of attributes.
 * @extends Attribute
 */
export class FloorRequestStatus extends Attribute {
  public static decode(data: Uint8Array) {
    const floorId = getInteger(data, 0, 2);
    const attributes = parseAttributes(data.slice(2));
    return new FloorRequestStatus(floorId, attributes);
  }

  /**
   * @constructor
   * @param floorId       The floor id
   * @param requestStatus The request status
   */
  constructor(floorId: number, attributes: Attribute[] = []) {
    const content = [];
    content.push(floorId);
    content.push(...attributes);
    super(Type.FloorRequestStatus, 2 + sumLengths(attributes) + ATTRIBUTE_HEADER_SIZE, Format.Grouped, content);
  }

  public get floorId() {
    if (this.content instanceof Array) {
      return this.content[0];
    }
  }
}

/**
 * The OVERALL-REQUEST-STATUS attribute is a grouped attribute that
 * consists of a header, followed by a sequence of attributes.
 * @extends Attribute
 */
export class OverallRequestStatus extends Attribute {
  public static decode(data: Uint8Array) {
    const floorRequestId = getInteger(data, 0, 2);
    const attributes = parseAttributes(data.slice(2));
    return new OverallRequestStatus(floorRequestId, attributes);
  }

  /**
   * @constructor
   * @param floorRequestId The request status
   */
  constructor(floorRequestId: number, attributes: Attribute[] = []) {
    const content = [];
    content.push(floorRequestId);
    content.push(...attributes);
    super(Type.OverallRequestStatus, 2 + sumLengths(attributes) + ATTRIBUTE_HEADER_SIZE, Format.Grouped, content);
  }

  public get floorRequestId() {
    if (this.content instanceof Array) {
      return this.content[0];
    }
  }
}

/**
 * SupportedAttributes class is an abstraction of the SupportedAttributes
 * attribute as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.10
 * @extends Attribute
 */
export class SupportedAttributes extends Attribute {
  public static decode(data: Uint8Array) {
    const types: Type[] = [];
    for (const attr of data) {
      // first 7 bits
      const type = attr >> 1;
      types.push(type);
    }
    return new SupportedAttributes(types);
  }

  /**
   * @constructor
   * @param attributes A Attribute Type list
   * representing the supported attributes
   */
  constructor(attributes?: Type[]) {
    let supported: Type[] = [];
    if (!attributes) {
      supported = [
        Type.BeneficiaryId,
        Type.FloorId,
        Type.FloorRequestId,
        // Type.Priority,
        Type.RequestStatus,
        // Type.ErrorCode,
        // Type.ErrorInfo,
        // Type.ParticipantProvidedInfo,
        // Type.StatusInfo,
        Type.SupportedAttributes,
        Type.SupportedPrimitives,
        // Type.UserDisplayName,
        // Type.UserUri,
        // Type.BeneficiaryInformation,
        // Type.FloorRequestInformation,
        // Type.RequestedByInformation,
        Type.FloorRequestStatus,
        Type.OverallRequestStatus,
      ];
    } else {
      supported = attributes;
    }

    super(Type.SupportedAttributes, supported.length * 1 + ATTRIBUTE_HEADER_SIZE, Format.OctetString, supported);
  }

  public get suportedAttributes() {
    if (this.content instanceof Array) {
      return [...this.content];
    }
  }
}

/**
 * SupportedPrimitives class is an abstraction of the SupportedPrimitives
 * attribute as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.11
 * @extends Attribute
 */
export class SupportedPrimitives extends Attribute {
  public static decode(data: Uint8Array) {
    const primitives: Primitive[] = [];
    for (const prim of data) {
      primitives.push(prim);
    }
    return new SupportedPrimitives(primitives);
  }

  /**
   * @constructor
   * @param primitives A Message Primitive list
   * representing the supported primitives (messages)
   */
  constructor(primitives?: Primitive[]) {
    let supported: Primitive[] = [];
    if (!primitives) {
      supported = [
        Primitive.FloorRequest,
        Primitive.FloorRelease,
        // Primitive.FloorRequestQuery,
        // Primitive.FloorRequestStatus,
        // Primitive.UserQuery,
        // Primitive.UserStatus,
        Primitive.FloorQuery,
        Primitive.FloorStatus,
        Primitive.Hello,
        Primitive.HelloAck,
        // Primitive.Error,
        // Primitive.FloorRequestStatusAck,
        // Primitive.ErrorAck,
        Primitive.FloorStatusAck,
        Primitive.Goodbye,
        Primitive.GoodbyeAck,
      ];
    } else {
      supported = primitives;
    }

    super(Type.SupportedPrimitives, supported.length * 1 + ATTRIBUTE_HEADER_SIZE, Format.OctetString, supported);
  }

  public get supportedPrimitives() {
    if (this.content instanceof Array) {
      return [...this.content];
    }
  }
}

function sumLengths(attributes: Attribute[]) {
  if (attributes.length === 0) {
    return 0;
  }
  return attributes.map((a) => a.length).reduce((acc, val) => acc + val);
}
