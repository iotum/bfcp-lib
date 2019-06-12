/**
 * Error class is a abstract representation of the error code as
 * defined in the RFCP 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2
 */
export enum Error {
  ConfNotExist = 1,
  UserNotExist = 2,
  UnknownPrim = 3,
  UnknownMandAttr = 4,
  UnauthOperation = 5,
  InvalidFloorId = 6,
  FloorReqIdNotExist = 7,
  MaxFloorReqReached = 8,
  UseTls = 9,
  ParseError = 10,
  UseDtls = 11,
  UnsupportedVersion = 12,
  BadLength = 13,
  GenericError = 14,
}
