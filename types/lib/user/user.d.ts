/// <reference types="node" />
import { FloorRelease, FloorRequest, Hello, Message } from "../messages/message";
import { RequestStatusValue } from "../messages/requestStatusValue";
/**
 * @classdesc
 * This class is a abstract representation of a User in the BFCP environment,
 * and is used as the primary interface to this library. A User receive and
 * returns BFCP messages totally in the binary form, as like when receiving
 * from TCP/UDP sockets, so the application who utilize it doesn't need to
 * know anything about the codification and decodification of BFCP messages.
 * @memberof bfcp-lib
 */
export declare class User {
    /**
     * Gets the User ID
     * @return User ID
     */
    userId: number;
    /**
     * Gets the Conference ID
     * @return Conference ID
     */
    conferenceId: number;
    /**
     * Gets the current message
     * @return This User last message received by the method
     * 'receiveMessage'
     */
    currentMessage: Message;
    /**
     * Gets the current transaction id
     * @return Current transaction id
     */
    currentTransactionId: number;
    /**
     * Gets the wanted floor id
     * @return This user last wanted floor id received by a
     * FloorRequest Message
     */
    wantedFloorId: number;
    static floorRequestId: number;
    /**
     * Gets the actual floor request id
     * @return Floor request id
     * @static
     */
    static getFloorRequestId(): number;
    /**
     * Increments the actual floor request id
     */
    static incFloorRequestId(): void;
    private _userId;
    private _conferenceId;
    private _currentMessage;
    private _currentTransactionId;
    private _wantedFloorId;
    /**
     * @param userId       A string representing the User ID
     * @param conferenceId A string representing the Conference ID
     * @constructor
     */
    constructor(userId: string, conferenceId: string);
    /**
     * Receives a buffered message, parses it to a BFCP Message Object,
     * sets it as the current message and returns it.
     * @param  message The buffered Message
     * @return The BFCP Message Object
     * @public
     */
    receiveMessage(message: Buffer): Message;
    /**
     * Gets a buffered HelloAck message
     * @param  helloMessage The Hello message that the HelloAck
     * will respond to.
     * @return  The HelloAck buffered message
     * @public
     */
    helloAckMessage(helloMessage: Hello): Buffer;
    /**
     * Gets a buffered FloorRequestStatus message
     * @param  message
     * The FloorRequest or Release message that the FloorRequestStatus will respond to.
     * @param  floorId The floor id
     * @param  requestStatus The request status
     * @return The FloorRequestStatus buffered message
     * @public
     */
    floorRequestStatusMessage(message: FloorRequest | FloorRelease, floorId: number, requestStatus: RequestStatusValue): Buffer;
    /**
     * Gets a buffered FloorStatus message
     * @param  floorId The floor id
     * @param  requestStatus The request status
     * @return The FloorStatus buffered message
     * @public
     */
    floorStatusMessage(floorId: number, requestStatus: RequestStatusValue): Buffer;
}
