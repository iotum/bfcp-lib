/**
 * RequestStatusValue class is a abstraction of the Message Request Status as defined in
 * the RFCP 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.5
 * @memberof Message
 * @static
 */
export enum RequestStatusValue {
  /** Gets Pending value */
  Pending = 1,
  /** Gets Accepted value */
  Accepted = 2,
  /** Gets Granted value */
  Granted = 3,
  /** Gets Denied value */
  Denied = 4,
  /** Gets Cancelled value */
  Cancelled = 5,
  /** Gets Released value */
  Released = 6,
  /** Gets Revoked value */
  Revoked = 7,
}
