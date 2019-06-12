/**
 * ReqStatus is a abstract representation of the request status as
 * defined in the RFCP 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2
 */
export declare enum RequestPriority {
    Lowest = 0,
    Low = 1,
    Normal = 2,
    High = 3,
    Highest = 4
}
