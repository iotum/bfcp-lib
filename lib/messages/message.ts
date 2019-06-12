import {
  Attribute, BeneficiaryId, ErrorCode, FloorId, FloorRequestId,
  FloorRequestInformation, FloorRequestStatus as FloorRequestStatusAttr,
  OverallRequestStatus, RequestStatus, SupportedAttributes, SupportedPrimitives,
} from "../attributes/attribute";
import { Error as Err } from "../attributes/error";
import { Name } from "../attributes/name";
import { Type } from "../attributes/type";
import { CommonHeader } from "./commonHeader";
import { Primitive } from "./primitive";
import { RequestStatusValue } from "./requestStatusValue";

export const MESSAGE_HEADER_SIZE = 12;

/**
 * Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3
 */
export class Message {
  private _commonHeader: CommonHeader;
  private _attributes: Attribute[] = [];

  /**
   * @constructor
   * @param commonHeader The message common header
   * @param attributes   The message list of attributes
   */
  constructor(commonHeader: CommonHeader, attributes?: Attribute[]) {
    this._commonHeader = commonHeader;
    if (attributes) {
      for (const attribute of attributes) {
        this.addAttribute(attribute);
      }
    }
  }

  get commonHeader(): CommonHeader {
    return this._commonHeader;
  }
  set commonHeader(commonHeader) {
    this._commonHeader = commonHeader;
  }

  /**
   * Gets an iterator for the attributes.
   */
  get attributes() {
    return this._attributes[Symbol.iterator]();
  }

  /**
   * Gets the message attribute that contains the name received. If this
   * message haven't this attribute, returns null.
   * @param  attributeName The attribute Name
   */
  public getAttribute(attributeName: Name): Attribute {
    for (const attribute of this.attributes) {
      if (attribute.constructor.name === attributeName) {
        return attribute;
      }
    }
    return null;
  }

  /**
   * Adds an attribute object and updates the message length in the header.
   * @param attribute The attribute object
   */
  public addAttribute(attribute: Attribute) {
    if (attribute) {
      this._attributes.push(attribute);
      this.commonHeader.payloadLength += Math.ceil(attribute.length / 4);
    }
  }

  /**
   * Encodes this Message instance from object oriented format to the binary
   * format. This process encode the CommonHeader and all attributes.
   */
  public encode(): number[] {
    const commonHeader = this.commonHeader.encode();
    const attributes = [];
    for (const attribute of this.attributes) {
      attributes.push(attribute.encode());
    }

    const message = commonHeader + attributes.join("");
    const size = message.length / 8;
    const octets = [];

    // binary to uint8
    for (let i = 0; i < size; i++) {
      octets.push(parseInt(message.substring(0 + 8 * i, 8 + 8 * i), 2));
    }

    // padding to DWORD
    Array(octets.length % 4).fill(0).forEach(() => octets.push(0));
    return octets;
  }
}

/**
 * FloorRequest Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.1
 */
export class FloorRequest extends Message {
  /**
   * @constructor
   * @param conferenceId   The conference id
   * @param transactionId  The transaction id
   * @param userId         The user id
   * @param floorId        The floor id
   * @param beneficiaryId  The beneficiary id (optional)
   */
  constructor(conferenceId: number, transactionId: number, userId: number, floorIds: number | number[]) {
    super(
      new CommonHeader(Primitive.FloorRequest, conferenceId, transactionId, userId),
    );

    if (!(floorIds instanceof Array)) {
      floorIds = [floorIds];
    }
    for (const floorId of floorIds) {
      this.addAttribute(new FloorId(floorId));
    }

    // beneficiary
    // requestedBy
    // priority
  }
}

/**
 * FloorRelease Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.2
 */
export class FloorRelease extends Message {
  /**
   * @constructor
   * @param conferenceId   The conference id
   * @param transactionId  The transaction id
   * @param userId         The user id
   * @param floorRequestId The floor request id
   */
  constructor(conferenceId: number, transactionId: number, userId: number, floorRequestId: number) {
    super(
      new CommonHeader(Primitive.FloorRelease, conferenceId, transactionId, userId),
      [
        new FloorRequestId(floorRequestId),
      ],
    );
  }
}

/**
 * FloorRequestQuery Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.3
 */
export class FloorRequestQuery extends Message {
  /**
   * @constructor
   * @param conferenceId   The conference id
   * @param transactionId  The transaction id
   * @param userId         The user id
   * @param floorRequestId The floor request id
   */
  constructor(conferenceId: number, transactionId: number, userId: number, floorRequestId: number) {
    super(
      new CommonHeader(Primitive.FloorRequestQuery, conferenceId, transactionId, userId),
      [
        new FloorRequestId(floorRequestId),
      ],
    );
  }
}

/**
 * FloorRequestStatus Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.4
 */
export class FloorRequestStatus extends Message {
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
  constructor(
    conferenceId: number,
    transactionId: number,
    userId: number,
    floorRequestId: number,
    floorId: number,
    requestStatus: RequestStatusValue,
    isResponse = false,
  ) {
    super(
      new CommonHeader(Primitive.FloorRequestStatus, conferenceId, transactionId, userId),
      [
        buildFloorRequestInfoAttr(floorRequestId, requestStatus),
        new FloorRequestStatusAttr(floorId),
      ],
    );
    this.commonHeader.responderFlag = isResponse;
  }
}

/**
 * UserQuery Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.5
 */
export class UserQuery extends Message {
  /**
   * @constructor
   * @param conferenceId  The conference id
   * @param transactionId The transaction id
   * @param userId        The user id
   * @param beneficiaryId The beneficiary id (Optional)
   */
  constructor(conferenceId: number, transactionId: number, userId: number, beneficiaryId?: number) {
    super(
      new CommonHeader(Primitive.UserQuery, conferenceId, transactionId, userId),
    );
    if (beneficiaryId) {
      this.addAttribute(new BeneficiaryId(beneficiaryId));
    }
  }
}

/**
 * UserStatus Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.6
 */
export class UserStatus extends Message {
  /**
   * @constructor
   * @param conferenceId    The conference id
   * @param transactionId   The transaction id
   * @param userId          The user id
   * @param floorRequestId  The floor request id
   * @param requestStatus   The request status
   * @param beneficiaryId   The beneficiary id (optional)
   */
  constructor(
    conferenceId: number,
    transactionId: number,
    userId: number,
    floorRequestId: number,
    requestStatus: RequestStatusValue,
    beneficiaryId: number,
  ) {
    super(
      new CommonHeader(Primitive.UserStatus, conferenceId, transactionId, userId),
      [
        new FloorRequestInformation(floorRequestId, [
          new OverallRequestStatus(floorRequestId, [
            new RequestStatus(requestStatus),
          ]),
        ]),
      ],
    );
    this.commonHeader.responderFlag = true;
    if (beneficiaryId) {
      this.addAttribute(new BeneficiaryId(beneficiaryId));
    }
    // user-displayname
    // user-uri
  }
}

/**
 * FloorQuery Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.7
 */
export class FloorQuery extends Message {
  /**
   * The client inserts in the message all the Floor IDs it wants to
   * receive information about.  The floor control server will send
   * periodic information about all of these floors.  If the client does
   * not want to receive information about a particular floor any longer,
   * it sends a new FloorQuery message removing the FLOOR-ID of this
   * floor.  If the client does not want to receive information about any
   * floor any longer, it sends a FloorQuery message with no FLOOR-ID
   * attribute.
   * @constructor
   * @param conferenceId   The conference id
   * @param transactionId  The transaction id
   * @param userId         The user id
   * @param floorId        The floor id
   */
  constructor(conferenceId: number, transactionId: number, userId: number, floorId?: number) {
    super(
      new CommonHeader(Primitive.FloorQuery, conferenceId, transactionId, userId),
    );
    if (floorId) {
      this.addAttribute(new FloorId(floorId));
    }
  }
}

/**
 * FloorStatus Message
 * as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.8
 */
export class FloorStatus extends Message {
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
  constructor(
    conferenceId: number,
    transactionId: number,
    userId: number,
    floorRequestId: number,
    floorId?: number,
    requestStatus?: RequestStatusValue,
    isResponse = false,
  ) {
    super(
      new CommonHeader(Primitive.FloorStatus, conferenceId, transactionId, userId),
    );
    this.commonHeader.responderFlag = isResponse;
    if (floorId) {
      this.addAttribute(new FloorId(floorId));
    }
    if (floorRequestId) {
      this.addAttribute(buildFloorRequestInfoAttr(floorRequestId, requestStatus));
    }
  }
}

// https://tools.ietf.org/html/rfc4582#section-5.3.9
// export class ChairAction extends Message {}

// https://tools.ietf.org/html/rfc4582#section-5.3.10
// export class ChairActionAck extends Message {} // responseFlag = true

/**
 * Hello Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.11
 */
export class Hello extends Message {
  /**
   * @constructor
   * @param conferenceId  The conference id
   * @param transactionId The transaction id
   * @param userId        The user id
   * @param floorId       The floor id
   */
  constructor(conferenceId: number, transactionId: number, userId: number, floorId: number) {
    super(
      new CommonHeader(Primitive.Hello, conferenceId, transactionId, userId),
      [
        new FloorId(floorId),
      ],
    );
  }
}

/**
 * HelloAck Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.12
 */
export class HelloAck extends Message {
  /**
   * @constructor
   * @param conferenceId  The conference id
   * @param transactionId The transaction id
   * @param userId        The user id
   */
  constructor(conferenceId: number, transactionId: number, userId: number) {
    super(
      new CommonHeader(Primitive.HelloAck, conferenceId, transactionId, userId),
      [
        new SupportedPrimitives(),
        new SupportedAttributes(),
      ],
    );
    this.commonHeader.responderFlag = true;
  }
}

/**
 * Error Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.13
 */
export class Error extends Message {
  /**
   * @constructor
   * @param conferenceId  The conference id
   * @param transactionId The transaction id
   * @param userId        The user id
   * @param  errorCode     The error code
   */
  constructor(conferenceId: number, transactionId: number, userId: number, errorCode: Err, errorInfo?: string) {
    super(
      new CommonHeader(Primitive.Error, conferenceId, transactionId, userId),
      [
        new ErrorCode(errorCode, errorInfo),
      ],
    );
    this.commonHeader.responderFlag = true;
  }
}

/**
 * FloorRequestStatusAck Message
 * extended from the RFC 4582 - BFCP
 */
export class FloorRequestStatusAck extends Message {
  /**
   * @constructor
   * @param conferenceId   The conference id
   * @param transactionId  The transaction id
   * @param userId         The user id
   */
  constructor(conferenceId: number, transactionId: number, userId: number) {
    super(
      new CommonHeader(Primitive.FloorRequestStatusAck, conferenceId, transactionId, userId),
    );
    this.commonHeader.responderFlag = true;
  }
}

/**
 * ErrorAck Message
 * extended from the RFC 4582 - BFCP
 */
export class ErrorAck extends Message {
  /**
   * @constructor
   * @param conferenceId   The conference id
   * @param transactionId  The transaction id
   * @param userId         The user id
   */
  constructor(conferenceId: number, transactionId: number, userId: number) {
    super(
      new CommonHeader(Primitive.ErrorAck, conferenceId, transactionId, userId),
    );
    this.commonHeader.responderFlag = true;
  }
}

/**
 * FloorStatusAck Message
 * extended from the RFC 4582 - BFCP
 */
export class FloorStatusAck extends Message {
  /**
   * @constructor
   * @param conferenceId   The conference id
   * @param transactionId  The transaction id
   * @param userId         The user id
   */
  constructor(conferenceId: number, transactionId: number, userId: number) {
    super(
      new CommonHeader(Primitive.FloorStatusAck, conferenceId, transactionId, userId),
    );
    this.commonHeader.responderFlag = true;
  }
}

/**
 * Goodbye Message
 * extended from the RFC 4582 - BFCP
 */
export class Goodbye extends Message {
  /**
   * @constructor
   * @param conferenceId  The conference id
   * @param transactionId The transaction id
   * @param userId        The user id
   */
  constructor(conferenceId, transactionId, userId) {
    super(
      new CommonHeader(Primitive.Goodbye, conferenceId, transactionId, userId),
    );
  }
}

/**
 * GoodbyeAck Message
 * extended from the RFC 4582 - BFCP
 */
export class GoodbyeAck extends Message {
  /**
   * @constructor
   * @param conferenceId  The conference id
   * @param transactionId The transaction id
   * @param userId        The user id
   */
  constructor(conferenceId: number, transactionId: number, userId: number) {
    super(
      new CommonHeader(Primitive.GoodbyeAck, conferenceId, transactionId, userId),
    );
    this.commonHeader.responderFlag = true;
  }
}

function buildFloorRequestInfoAttr(floorRequestId: number, requestStatus: RequestStatusValue) {
  return new FloorRequestInformation(floorRequestId, [
    new OverallRequestStatus(floorRequestId, [
      new RequestStatus(requestStatus),
    ]),
  ]);
}
