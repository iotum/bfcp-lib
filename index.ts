/**
 * bfcp-lib: A simple library for BFCP protocol
 * @module bfcp-lib
 */

import * as Attributes from "./lib/attributes/attribute";
import * as Parser from "./lib/parser/parser";

export { Error } from "./lib/attributes/error";
export { Format } from "./lib/attributes/format";
export { Name } from "./lib/attributes/name";
export { Type } from "./lib/attributes/type";

export { Primitive } from "./lib/messages/primitive";
export { RequestPriority } from "./lib/messages/priority";
export { RequestStatusValue } from "./lib/messages/requestStatusValue";

export * from "./lib/messages/message";
export {
    Parser,
    Attributes,
};
