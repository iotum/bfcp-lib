/**
 * bfcp-lib: A simple library for BFCP protocol
 * @module bfcp-lib
 */

import * as Attributes from "./lib/attributes/attribute";
import * as Parser from "./lib/parser/parser";

export * from "./lib/messages/message";
export {
    Parser,
    Attributes,
};
