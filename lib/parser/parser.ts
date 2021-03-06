import * as ATTR from "../attributes/attribute";
import { Type } from "../attributes/type";
import { CommonHeader } from "../messages/commonHeader";
import {
  Error as ErrorMsg, ErrorAck, FloorQuery, FloorRelease, FloorRequest,
  FloorRequestStatus as FloorRequestStatusMsg, FloorRequestStatusAck,
  FloorStatus, FloorStatusAck, Goodbye, GoodbyeAck,
  Hello, HelloAck, Message, MESSAGE_HEADER_SIZE,
} from "../messages/message";
import { Primitive } from "../messages/primitive";
import * as Complements from "../parser/complements";

export function getBinary(data: Uint8Array, start = 0, length = -1) {
  const end = length < 0 ? undefined : start + length;
  const binaries = [];
  for (const byte of data.slice(start, end)) {
    binaries.push(Complements.complementBinary(byte, 8));
  }
  return binaries.join("");
}

export function getString(data: Uint8Array, start = 0, length = -1) {
  const end = length < 0 ? undefined : start + length;
  return String.fromCharCode.apply(null, data.slice(start, end));
}

export function getInteger(data: Uint8Array, start = 0, length = -1) {
  return parseInt(getBinary(data, start, length), 2);
}

/**
 * Parses an BFCP Message as received in a TCP/UDP socket to a Object Oriented
 * BFCP Message. Must receive the message as a Buffer, like when it arrives
 * from the TCP/UDP socket.
 * @param  message The buffered Message
 * @return Object Oriented BFCP Message
 * @throws Will throw an Error if the Message couldn't be parsed.
 */
export function parseMessage(message: Uint8Array): Message {
  if (message.length < MESSAGE_HEADER_SIZE) {
    throw new Error(`Invalid message size: ${message.length} bytes`);
  }

  try {
    const commonHeader = parseCommonHeader(message.slice(0, MESSAGE_HEADER_SIZE));
    const attributes = parseAttributes(message.slice(MESSAGE_HEADER_SIZE));

    switch (commonHeader.primitive) {
      case Primitive.Hello:
        return new Message(commonHeader, attributes) as Hello;

      case Primitive.HelloAck:
        return new Message(commonHeader, attributes) as HelloAck;

      case Primitive.FloorRequest:
        return new Message(commonHeader, attributes) as FloorRequest;

      case Primitive.FloorRelease:
        return new Message(commonHeader, attributes) as FloorRelease;

      case Primitive.FloorRequestStatus:
        return new Message(commonHeader, attributes) as FloorRequestStatusMsg;

      case Primitive.FloorRequestStatusAck:
        return new Message(commonHeader, attributes) as FloorRequestStatusAck;

      case Primitive.FloorStatus:
        return new Message(commonHeader, attributes) as FloorStatus;

      case Primitive.FloorStatusAck:
        return new Message(commonHeader, attributes) as FloorStatusAck;

      case Primitive.FloorQuery:
        return new Message(commonHeader, attributes) as FloorQuery;

      case Primitive.Goodbye:
        return new Message(commonHeader, attributes) as Goodbye;

      case Primitive.GoodbyeAck:
        return new Message(commonHeader, attributes) as GoodbyeAck;

      case Primitive.Error:
        return new Message(commonHeader, attributes) as ErrorMsg;

      case Primitive.ErrorAck:
        return new Message(commonHeader, attributes) as ErrorAck;

      case Primitive.UserQuery:
      case Primitive.UserStatus:
      case Primitive.ChairAction:
      case Primitive.ChairActionAck:
      case Primitive.FloorRequestQuery:
        // throw new Error("Unsupported primitive.");
        return new Message(commonHeader, attributes);

      default:
        // throw new Error("I can't decode this message. Unknown primitive.");
        return new Message(commonHeader, attributes);
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Parses the CommonHeader bits of the message to a CommonHeader Object.
 * @param  commonHeader Binary string representing the CommonHeader
 * @return The CommonHeader object
 */
function parseCommonHeader(header: Uint8Array) {
  let pos = 0;

  const byte1 = getBinary(header, pos, 1);
  const version = parseInt(byte1.substr(0, 3), 2);
  const responder = byte1[4] === "1";
  const fragment = byte1[5] === "1";
  pos += 1;

  const primitive = getInteger(header, pos, 1);
  pos += 1;

  const payloadLength = getInteger(header, pos, 2);
  pos += 2;

  const conferenceId = getInteger(header, pos, 4);
  pos += 4;

  const transactionId = getInteger(header, pos, 2);
  pos += 2;

  const userId = getInteger(header, pos, 2);
  pos += 2;

  const cm = new CommonHeader(primitive, conferenceId, transactionId, userId);
  // cm.payloadLength = payloadLength; // counter via adding attribute
  cm.responderFlag = responder;
  return cm;
}

/**
 * Parses the Attributes bits of the message to a Attribute list object.
 * @param  attributeBuffer Binary string representing the Attributes
 * @return The Attribute list object
 */
export function parseAttributes(body: Uint8Array) {
  const attributes: ATTR.Attribute[] = [];
  for (let pos = 0; pos < body.length;) {
    // attribute header
    const attrHeader = getBinary(body, pos, ATTR.ATTRIBUTE_HEADER_SIZE);
    const type: Type = parseInt(attrHeader.substr(0, 7), 2);
    const mandatory = attrHeader[7] === "1";
    const length = parseInt(attrHeader.substr(8, 8), 2);

    const attrBody = body.slice(pos + ATTR.ATTRIBUTE_HEADER_SIZE, pos + length);
    pos += ATTR.ATTRIBUTE_HEADER_SIZE + attrBody.length;

    let attribute: ATTR.Attribute;
    switch (type) {
      case Type.BeneficiaryId:
        attribute = ATTR.BeneficiaryId.decode(attrBody);
        break;
      case Type.FloorId:
        attribute = ATTR.FloorId.decode(attrBody);
        break;
      case Type.FloorRequestId:
        attribute = ATTR.FloorRequestId.decode(attrBody);
        break;

      case Type.Priority:
        attribute = ATTR.Priority.decode(attrBody);
        break;

      case Type.RequestStatus:
        attribute = ATTR.RequestStatus.decode(attrBody);
        break;

      case Type.ErrorCode:
        attribute = ATTR.ErrorCode.decode(attrBody);
        break;

      /* string attributes */
      case Type.ErrorInfo:
        attribute = ATTR.ErrorInfo.decode(attrBody);
        break;
      case Type.ParticipantProvidedInfo:
        attribute = ATTR.ParticipantProvidedInfo.decode(attrBody);
        break;
      case Type.StatusInfo:
        attribute = ATTR.StatusInfo.decode(attrBody);
        break;
      case Type.UserDisplayName:
        attribute = ATTR.UserDisplayName.decode(attrBody);
        break;
      case Type.UserUri:
        attribute = ATTR.StatusInfo.decode(attrBody);
        break;

      case Type.SupportedAttributes:
        attribute = ATTR.SupportedAttributes.decode(attrBody);
        break;

      case Type.SupportedPrimitives:
        attribute = ATTR.SupportedPrimitives.decode(attrBody);
        break;

      /* grouped attributes */
      case Type.BeneficiaryInformation: // beneficiary-id
        attribute = ATTR.BeneficiaryInformation.decode(attrBody);
        break;
      case Type.FloorRequestInformation: // floor-request-id
        attribute = ATTR.FloorRequestInformation.decode(attrBody);
        break;
      case Type.RequestedByInformation: // requested-by-id
        attribute = ATTR.RequestedByInformation.decode(attrBody);
        break;
      case Type.FloorRequestStatus: // floor-id
        attribute = ATTR.FloorRequestStatus.decode(attrBody);
        break;
      case Type.OverallRequestStatus: // floor-request-id
        attribute = ATTR.OverallRequestStatus.decode(attrBody);
        break;

      default:
        // throw new Error("I cant parse this attribute!");
        break;
    }

    if (attribute) {
      attribute.mandatory = mandatory;
      attributes.push(attribute);
    }

    // DWORD padding
    pos += pos % 4;
  }

  return attributes;
}
