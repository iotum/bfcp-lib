import * as ATTR from "../attributes/attribute";
import { Message } from "../messages/message";
export declare function getBinary(data: Uint8Array, start?: number, length?: number): string;
export declare function getString(data: Uint8Array, start?: number, length?: number): any;
export declare function getInteger(data: Uint8Array, start?: number, length?: number): number;
/**
 * Parses an BFCP Message as received in a TCP/UDP socket to a Object Oriented
 * BFCP Message. Must receive the message as a Buffer, like when it arrives
 * from the TCP/UDP socket.
 * @param  message The buffered Message
 * @return Object Oriented BFCP Message
 * @throws Will throw an Error if the Message couldn't be parsed.
 */
export declare function parseMessage(message: Uint8Array): Message;
/**
 * Parses the Attributes bits of the message to a Attribute list object.
 * @param  attributeBuffer Binary string representing the Attributes
 * @return The Attribute list object
 */
export declare function parseAttributes(body: Uint8Array): ATTR.Attribute[];
