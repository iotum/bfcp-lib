(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.BFCPLib = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var primitive_1 = require("../messages/primitive");
var Complements = require("../parser/complements");
var parser_1 = require("../parser/parser");
var format_1 = require("./format");
var type_1 = require("./type");
exports.ATTRIBUTE_HEADER_SIZE = 2;
/**
 * Attribute class is an abstraction of the Attribute as defined in the
 * RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2
 * @memberof bfcp-lib
 */
var Attribute = /** @class */ (function () {
    /**
     * @constructor
     * @param type    Attribute Type
     * @param format  Attribute format
     * @param content The attribute content, which can be an Integer, or other attributes, depending of the format
     */
    function Attribute(type, length, format, content) {
        this._mandatory = true;
        this._type = type;
        this._length = length;
        this._format = format;
        this._content = content;
    }
    Object.defineProperty(Attribute.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (type) {
            this._type = type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "length", {
        get: function () {
            return this._length;
        },
        set: function (length) {
            this._length = length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "format", {
        get: function () {
            return this._format;
        },
        set: function (format) {
            this._format = format;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "content", {
        get: function () {
            return this._content;
        },
        set: function (content) {
            this._content = content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "mandatory", {
        get: function () {
            return this._mandatory;
        },
        set: function (mandatary) {
            this._mandatory = mandatary;
        },
        enumerable: true,
        configurable: true
    });
    Attribute.prototype.getContentAttriute = function (type) {
        if (this.content instanceof Array) {
            return this.content.find(function (a) { return a.type === type; });
        }
        return null;
    };
    /**
     * Encodes this Attribute instance from object oriented format to the binary
     * format.
     * @return Binary string representing the BFCP Attribute
     * @public
     */
    Attribute.prototype.encode = function () {
        var type = Complements.complementBinary(this.type, 7);
        var mandatary = this.mandatory ? "1" : "0";
        var length = Complements.complementBinary(this.length, 8);
        var content = null;
        switch (this.format) {
            case format_1.Format.Unsigned16:
                content = Complements.complementBinary(this.content, 16);
                break;
            case format_1.Format.Grouped:
                content = this._encodeGroupedAttributeContent();
                break;
            case format_1.Format.OctetString:
                content = this._encodeOctetStringContent();
                break;
            case format_1.Format.OctetString16:
                content = this._encodeOctetString16Content();
                break;
            default:
                throw new Error("I can't encode this attribute. Format unknown.");
        }
        return Complements.complementPadding(type + mandatary + length + content);
    };
    /**
     * Encodes the Grouped type attribute content.
     * @return Binary string representing the BFCP object content
     * @private
     */
    Attribute.prototype._encodeGroupedAttributeContent = function () {
        var e_1, _a;
        var newContent = "";
        try {
            for (var _b = __values(this.content), _c = _b.next(); !_c.done; _c = _b.next()) {
                var attribute = _c.value;
                if (attribute instanceof Attribute) {
                    newContent = newContent + attribute.encode();
                }
                else if (typeof attribute === "number") {
                    newContent = newContent + Complements.complementBinary(attribute, 16);
                }
                else if (typeof attribute === "string" || attribute instanceof String) {
                    newContent = newContent + attribute;
                }
                else {
                    throw new Error("Unknown attribute!");
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return newContent;
    };
    /**
     * Encodes the OctetString type attribute content.
     * @return Binary string representing the BFCP object content
     * @private
     */
    Attribute.prototype._encodeOctetStringContent = function () {
        var e_2, _a, e_3, _b;
        var newContent = "";
        switch (this.type) {
            case type_1.Type.SupportedAttributes:
                try {
                    for (var _c = __values(this.content), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var attributeType = _d.value;
                        newContent = newContent + Complements.complementBinary(attributeType, 7) + "0";
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                return newContent;
            case type_1.Type.SupportedPrimitives:
                try {
                    for (var _e = __values(this.content), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var primitiveType = _f.value;
                        newContent = newContent + Complements.complementBinary(primitiveType, 8);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                return newContent;
            default:
                throw new Error("I can't encode this octet string attribute. Type unknown.");
        }
    };
    /**
     * Encodes the OctetString16 type attribute content.
     * @return Binary string representing the BFCP object content
     * @private
     */
    Attribute.prototype._encodeOctetString16Content = function () {
        switch (this.type) {
            case type_1.Type.RequestStatus:
                var requestStatus = Complements.complementBinary(this.content[0], 8);
                var queuePosition = Complements.complementBinary(this.content[1], 8);
                return requestStatus + queuePosition;
            default:
                throw new Error("I can't encode this octet string 16 attribute. Type unknown.");
        }
    };
    return Attribute;
}());
exports.Attribute = Attribute;
/**
 * BeneficiaryId class is an abstraction of the BeneficiaryId attribute
 * as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.1
 * @extends Attribute
 */
var BeneficiaryId = /** @class */ (function (_super) {
    __extends(BeneficiaryId, _super);
    /**
     * @constructor
     * @param beneficiaryId The beneficiary id integer
     */
    function BeneficiaryId(beneficiaryId) {
        return _super.call(this, type_1.Type.BeneficiaryId, 2 + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.Unsigned16, beneficiaryId) || this;
    }
    BeneficiaryId.decode = function (data) {
        // 2-byte
        var beneficiaryId = parser_1.getInteger(data);
        return new BeneficiaryId(beneficiaryId);
    };
    Object.defineProperty(BeneficiaryId.prototype, "beneficiaryId", {
        get: function () {
            return this.content;
        },
        enumerable: true,
        configurable: true
    });
    return BeneficiaryId;
}(Attribute));
exports.BeneficiaryId = BeneficiaryId;
/**
 * FloorId class is an abstraction of the FloorId attribute
 * as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.2
 * @extends Attribute
 */
var FloorId = /** @class */ (function (_super) {
    __extends(FloorId, _super);
    /**
     * @constructor
     * @param floorId The floor id
     */
    function FloorId(floorId) {
        return _super.call(this, type_1.Type.FloorId, 2 + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.Unsigned16, floorId) || this;
    }
    FloorId.decode = function (data) {
        // 2-byte
        var floorId = parser_1.getInteger(data);
        return new FloorId(floorId);
    };
    Object.defineProperty(FloorId.prototype, "floorId", {
        get: function () {
            return this.content;
        },
        enumerable: true,
        configurable: true
    });
    return FloorId;
}(Attribute));
exports.FloorId = FloorId;
/**
 * FloorRequestId class is an abstraction of the FloorRequestId attribute
 * as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.3
 * @extends Attribute
 */
var FloorRequestId = /** @class */ (function (_super) {
    __extends(FloorRequestId, _super);
    /**
     * @constructor
     * @param floorRequestId The floor request id
     */
    function FloorRequestId(floorRequestId) {
        return _super.call(this, type_1.Type.FloorRequestId, 2 + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.Unsigned16, floorRequestId) || this;
    }
    FloorRequestId.decode = function (data) {
        // 2-byte
        var floorRequestId = parser_1.getInteger(data);
        return new FloorRequestId(floorRequestId);
    };
    Object.defineProperty(FloorRequestId.prototype, "floorRequestId", {
        get: function () {
            return this.content;
        },
        enumerable: true,
        configurable: true
    });
    return FloorRequestId;
}(Attribute));
exports.FloorRequestId = FloorRequestId;
var Priority = /** @class */ (function (_super) {
    __extends(Priority, _super);
    function Priority(priority) {
        return _super.call(this, type_1.Type.Priority, 2 + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.Unsigned16, priority) || this;
    }
    Priority.decode = function (data) {
        // 2-byte
        var priority = parser_1.getInteger(data) >> 5;
        return new Priority(priority);
    };
    Object.defineProperty(Priority.prototype, "floorId", {
        get: function () {
            return this.content;
        },
        enumerable: true,
        configurable: true
    });
    return Priority;
}(Attribute));
exports.Priority = Priority;
/**
 * RequestStatus class is an abstraction of the RequestStatus attribute as
 * defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.5
 * @extends Attribute
 */
var RequestStatus = /** @class */ (function (_super) {
    __extends(RequestStatus, _super);
    /**
     * @constructor
     * @param requestStatus The request status
     * @param queuePosition The queue position
     */
    function RequestStatus(requestStatus, queuePosition) {
        if (queuePosition === void 0) { queuePosition = 0; }
        var _this = this;
        var content = [
            requestStatus,
            queuePosition,
        ];
        _this = _super.call(this, type_1.Type.RequestStatus, 1 + 1 + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.OctetString16, content) || this;
        return _this;
    }
    RequestStatus.decode = function (data) {
        // 1-byte x 2
        var requestStatus = parser_1.getInteger(data, 0, 1);
        var queuePosition = parser_1.getInteger(data, 1, 1);
        return new RequestStatus(requestStatus, queuePosition);
    };
    Object.defineProperty(RequestStatus.prototype, "requestStatus", {
        get: function () {
            if (this.content instanceof Array) {
                return this.content[0];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestStatus.prototype, "queuePosition", {
        get: function () {
            if (this.content instanceof Array) {
                return this.content[1];
            }
        },
        enumerable: true,
        configurable: true
    });
    return RequestStatus;
}(Attribute));
exports.RequestStatus = RequestStatus;
/**
 * ErrorCode class is an abstraction of the ErrorCode attribute
 * as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.2
 * @extends Attribute
 */
var ErrorCode = /** @class */ (function (_super) {
    __extends(ErrorCode, _super);
    /**
     * @constructor
     * @param errorCode The error code
     */
    function ErrorCode(errorCode, errorInfo) {
        var _this = this;
        var content = [];
        content.push(errorCode);
        if (errorInfo) {
            content.push(errorInfo); // optional
        }
        _this = _super.call(this, type_1.Type.ErrorCode, 1 + (errorInfo ? errorInfo.length : 0) + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.Grouped, content) || this;
        return _this;
    }
    ErrorCode.decode = function (data) {
        // 1-byte
        var errorCode = parser_1.getInteger(data, 0, 1);
        var errorInfo = null;
        if (data.length > 1) {
            /* We have Error Specific Details */
            errorInfo = parser_1.getString(data, 1);
        }
        return new ErrorCode(errorCode, errorInfo);
    };
    Object.defineProperty(ErrorCode.prototype, "errorCode", {
        get: function () {
            if (this.content instanceof Array) {
                return this.content[0];
            }
        },
        enumerable: true,
        configurable: true
    });
    return ErrorCode;
}(Attribute));
exports.ErrorCode = ErrorCode;
/* string attributes */
var ErrorInfo = /** @class */ (function (_super) {
    __extends(ErrorInfo, _super);
    function ErrorInfo(errorInfo) {
        return _super.call(this, type_1.Type.ErrorInfo, errorInfo.length + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.Grouped, [errorInfo]) || this;
    }
    ErrorInfo.decode = function (data) {
        return new ErrorInfo(parser_1.getString(data));
    };
    Object.defineProperty(ErrorInfo.prototype, "errorInfo", {
        get: function () {
            return this.content;
        },
        enumerable: true,
        configurable: true
    });
    return ErrorInfo;
}(Attribute));
exports.ErrorInfo = ErrorInfo;
var ParticipantProvidedInfo = /** @class */ (function (_super) {
    __extends(ParticipantProvidedInfo, _super);
    function ParticipantProvidedInfo(partProviderInfo) {
        return _super.call(this, type_1.Type.ErrorInfo, partProviderInfo.length + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.Grouped, [partProviderInfo]) || this;
    }
    ParticipantProvidedInfo.decode = function (data) {
        return new ParticipantProvidedInfo(parser_1.getString(data));
    };
    Object.defineProperty(ParticipantProvidedInfo.prototype, "partProviderInfo", {
        get: function () {
            return this.content;
        },
        enumerable: true,
        configurable: true
    });
    return ParticipantProvidedInfo;
}(Attribute));
exports.ParticipantProvidedInfo = ParticipantProvidedInfo;
var StatusInfo = /** @class */ (function (_super) {
    __extends(StatusInfo, _super);
    function StatusInfo(statusInfo) {
        return _super.call(this, type_1.Type.ErrorInfo, statusInfo.length + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.Grouped, [statusInfo]) || this;
    }
    StatusInfo.decode = function (data) {
        return new StatusInfo(parser_1.getString(data));
    };
    Object.defineProperty(StatusInfo.prototype, "statusInfo", {
        get: function () {
            return this.content;
        },
        enumerable: true,
        configurable: true
    });
    return StatusInfo;
}(Attribute));
exports.StatusInfo = StatusInfo;
var UserDisplayName = /** @class */ (function (_super) {
    __extends(UserDisplayName, _super);
    function UserDisplayName(userDisplayName) {
        return _super.call(this, type_1.Type.ErrorInfo, userDisplayName.length + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.Grouped, [userDisplayName]) || this;
    }
    UserDisplayName.decode = function (data) {
        return new UserDisplayName(parser_1.getString(data));
    };
    Object.defineProperty(UserDisplayName.prototype, "userDisplayName", {
        get: function () {
            return this.content;
        },
        enumerable: true,
        configurable: true
    });
    return UserDisplayName;
}(Attribute));
exports.UserDisplayName = UserDisplayName;
var UserUri = /** @class */ (function (_super) {
    __extends(UserUri, _super);
    function UserUri(userUri) {
        return _super.call(this, type_1.Type.ErrorInfo, userUri.length + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.Grouped, [userUri]) || this;
    }
    UserUri.decode = function (data) {
        return new UserUri(parser_1.getString(data));
    };
    Object.defineProperty(UserUri.prototype, "userUri", {
        get: function () {
            return this.content;
        },
        enumerable: true,
        configurable: true
    });
    return UserUri;
}(Attribute));
exports.UserUri = UserUri;
/* grouped attributes */
/**
 * The BENEFICIARY-INFORMATION attribute is a grouped attribute that
 * consists of a header, which is referred to as BENEFICIARY-
 * INFORMATION-HEADER, followed by a sequence of attributes.
 * @extends Attribute
 */
var BeneficiaryInformation = /** @class */ (function (_super) {
    __extends(BeneficiaryInformation, _super);
    function BeneficiaryInformation(beneficiaryId, attributes) {
        if (attributes === void 0) { attributes = []; }
        var _this = this;
        var content = [];
        content.push(beneficiaryId);
        content.push.apply(content, __spread(attributes));
        _this = _super.call(this, type_1.Type.BeneficiaryInformation, 2 + sumLengths(attributes) + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.Grouped, content) || this;
        return _this;
    }
    BeneficiaryInformation.decode = function (data) {
        var beneficiaryId = parser_1.getInteger(data, 0, 2);
        var attributes = parser_1.parseAttributes(data.slice(2));
        return new BeneficiaryInformation(beneficiaryId, attributes);
    };
    Object.defineProperty(BeneficiaryInformation.prototype, "beneficiaryId", {
        get: function () {
            if (this.content instanceof Array) {
                return this.content[0];
            }
        },
        enumerable: true,
        configurable: true
    });
    return BeneficiaryInformation;
}(Attribute));
exports.BeneficiaryInformation = BeneficiaryInformation;
/**
 * The FLOOR-REQUEST-INFORMATION attribute is a grouped attribute that
 * consists of a header, followed by a sequence of attributes.
 * @extends Attribute
 */
var FloorRequestInformation = /** @class */ (function (_super) {
    __extends(FloorRequestInformation, _super);
    /**
     * @constructor
     * @param floorRequestId The floor request id
     * @param floorId        The floor id
     * @param requestStatus  The request status
     */
    function FloorRequestInformation(floorRequestId, attributes) {
        if (attributes === void 0) { attributes = []; }
        var _this = this;
        var content = [];
        content.push(floorRequestId);
        content.push.apply(content, __spread(attributes));
        _this = _super.call(this, type_1.Type.FloorRequestInformation, 2 + sumLengths(attributes) + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.Grouped, content) || this;
        return _this;
    }
    FloorRequestInformation.decode = function (data) {
        var requestedById = parser_1.getInteger(data, 0, 2);
        var attributes = parser_1.parseAttributes(data.slice(2));
        return new FloorRequestInformation(requestedById, attributes);
    };
    Object.defineProperty(FloorRequestInformation.prototype, "floorRequestId", {
        get: function () {
            if (this.content instanceof Array) {
                return this.content[0];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FloorRequestInformation.prototype, "floorId", {
        get: function () {
            var frs = _super.prototype.getContentAttriute.call(this, type_1.Type.FloorRequestStatus);
            return frs ? frs.floorId : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FloorRequestInformation.prototype, "requestStatus", {
        get: function () {
            var ors = _super.prototype.getContentAttriute.call(this, type_1.Type.OverallRequestStatus);
            return ors ? ors.requestStatus : null;
        },
        enumerable: true,
        configurable: true
    });
    return FloorRequestInformation;
}(Attribute));
exports.FloorRequestInformation = FloorRequestInformation;
/**
 * The REQUESTED-BY-INFORMATION attribute is a grouped attribute that
 * consists of a header, followed by a sequence of attributes.
 */
var RequestedByInformation = /** @class */ (function (_super) {
    __extends(RequestedByInformation, _super);
    function RequestedByInformation(requestedById, attributes) {
        if (attributes === void 0) { attributes = []; }
        var _this = this;
        var content = [];
        content.push(requestedById);
        content.push.apply(content, __spread(attributes));
        _this = _super.call(this, type_1.Type.RequestedByInformation, 2 + sumLengths(attributes) + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.Grouped, content) || this;
        return _this;
    }
    RequestedByInformation.decode = function (data) {
        var requestedById = parser_1.getInteger(data, 0, 2);
        var attributes = parser_1.parseAttributes(data.slice(2));
        return new RequestedByInformation(requestedById, attributes);
    };
    Object.defineProperty(RequestedByInformation.prototype, "requestedById", {
        get: function () {
            if (this.content instanceof Array) {
                return this.content[0];
            }
        },
        enumerable: true,
        configurable: true
    });
    return RequestedByInformation;
}(Attribute));
exports.RequestedByInformation = RequestedByInformation;
/**
 * The FLOOR-REQUEST-STATUS attribute is a grouped attribute that
 * consists of a header, followed by a sequence of attributes.
 * @extends Attribute
 */
var FloorRequestStatus = /** @class */ (function (_super) {
    __extends(FloorRequestStatus, _super);
    /**
     * @constructor
     * @param floorId       The floor id
     * @param requestStatus The request status
     */
    function FloorRequestStatus(floorId, attributes) {
        if (attributes === void 0) { attributes = []; }
        var _this = this;
        var content = [];
        content.push(floorId);
        content.push.apply(content, __spread(attributes));
        _this = _super.call(this, type_1.Type.FloorRequestStatus, 2 + sumLengths(attributes) + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.Grouped, content) || this;
        return _this;
    }
    FloorRequestStatus.decode = function (data) {
        var floorId = parser_1.getInteger(data, 0, 2);
        var attributes = parser_1.parseAttributes(data.slice(2));
        return new FloorRequestStatus(floorId, attributes);
    };
    Object.defineProperty(FloorRequestStatus.prototype, "floorId", {
        get: function () {
            if (this.content instanceof Array) {
                return this.content[0];
            }
        },
        enumerable: true,
        configurable: true
    });
    return FloorRequestStatus;
}(Attribute));
exports.FloorRequestStatus = FloorRequestStatus;
/**
 * The OVERALL-REQUEST-STATUS attribute is a grouped attribute that
 * consists of a header, followed by a sequence of attributes.
 * @extends Attribute
 */
var OverallRequestStatus = /** @class */ (function (_super) {
    __extends(OverallRequestStatus, _super);
    /**
     * @constructor
     * @param floorRequestId The request status
     */
    function OverallRequestStatus(floorRequestId, attributes) {
        if (attributes === void 0) { attributes = []; }
        var _this = this;
        var content = [];
        content.push(floorRequestId);
        content.push.apply(content, __spread(attributes));
        _this = _super.call(this, type_1.Type.OverallRequestStatus, 2 + sumLengths(attributes) + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.Grouped, content) || this;
        return _this;
    }
    OverallRequestStatus.decode = function (data) {
        var floorRequestId = parser_1.getInteger(data, 0, 2);
        var attributes = parser_1.parseAttributes(data.slice(2));
        return new OverallRequestStatus(floorRequestId, attributes);
    };
    Object.defineProperty(OverallRequestStatus.prototype, "floorRequestId", {
        get: function () {
            if (this.content instanceof Array) {
                return this.content[0];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OverallRequestStatus.prototype, "requestStatus", {
        get: function () {
            var rs = _super.prototype.getContentAttriute.call(this, type_1.Type.RequestStatus);
            return rs ? {
                queuePosition: rs.queuePosition,
                requestStatus: rs.requestStatus,
            } : null;
        },
        enumerable: true,
        configurable: true
    });
    return OverallRequestStatus;
}(Attribute));
exports.OverallRequestStatus = OverallRequestStatus;
/**
 * SupportedAttributes class is an abstraction of the SupportedAttributes
 * attribute as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.10
 * @extends Attribute
 */
var SupportedAttributes = /** @class */ (function (_super) {
    __extends(SupportedAttributes, _super);
    /**
     * @constructor
     * @param attributes A Attribute Type list
     * representing the supported attributes
     */
    function SupportedAttributes(attributes) {
        var _this = this;
        var supported = [];
        if (!attributes) {
            supported = [
                type_1.Type.BeneficiaryId,
                type_1.Type.FloorId,
                type_1.Type.FloorRequestId,
                // Type.Priority,
                type_1.Type.RequestStatus,
                // Type.ErrorCode,
                // Type.ErrorInfo,
                // Type.ParticipantProvidedInfo,
                // Type.StatusInfo,
                type_1.Type.SupportedAttributes,
                type_1.Type.SupportedPrimitives,
                // Type.UserDisplayName,
                // Type.UserUri,
                // Type.BeneficiaryInformation,
                // Type.FloorRequestInformation,
                // Type.RequestedByInformation,
                type_1.Type.FloorRequestStatus,
                type_1.Type.OverallRequestStatus,
            ];
        }
        else {
            supported = attributes;
        }
        _this = _super.call(this, type_1.Type.SupportedAttributes, supported.length * 1 + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.OctetString, supported) || this;
        return _this;
    }
    SupportedAttributes.decode = function (data) {
        var e_4, _a;
        var types = [];
        try {
            for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var attr = data_1_1.value;
                // first 7 bits
                var type = attr >> 1;
                types.push(type);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return new SupportedAttributes(types);
    };
    Object.defineProperty(SupportedAttributes.prototype, "suportedAttributes", {
        get: function () {
            if (this.content instanceof Array) {
                return __spread(this.content);
            }
        },
        enumerable: true,
        configurable: true
    });
    return SupportedAttributes;
}(Attribute));
exports.SupportedAttributes = SupportedAttributes;
/**
 * SupportedPrimitives class is an abstraction of the SupportedPrimitives
 * attribute as defined in the RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.11
 * @extends Attribute
 */
var SupportedPrimitives = /** @class */ (function (_super) {
    __extends(SupportedPrimitives, _super);
    /**
     * @constructor
     * @param primitives A Message Primitive list
     * representing the supported primitives (messages)
     */
    function SupportedPrimitives(primitives) {
        var _this = this;
        var supported = [];
        if (!primitives) {
            supported = [
                primitive_1.Primitive.FloorRequest,
                primitive_1.Primitive.FloorRelease,
                // Primitive.FloorRequestQuery,
                // Primitive.FloorRequestStatus,
                // Primitive.UserQuery,
                // Primitive.UserStatus,
                primitive_1.Primitive.FloorQuery,
                primitive_1.Primitive.FloorStatus,
                primitive_1.Primitive.Hello,
                primitive_1.Primitive.HelloAck,
                // Primitive.Error,
                // Primitive.FloorRequestStatusAck,
                // Primitive.ErrorAck,
                primitive_1.Primitive.FloorStatusAck,
                primitive_1.Primitive.Goodbye,
                primitive_1.Primitive.GoodbyeAck,
            ];
        }
        else {
            supported = primitives;
        }
        _this = _super.call(this, type_1.Type.SupportedPrimitives, supported.length * 1 + exports.ATTRIBUTE_HEADER_SIZE, format_1.Format.OctetString, supported) || this;
        return _this;
    }
    SupportedPrimitives.decode = function (data) {
        var e_5, _a;
        var primitives = [];
        try {
            for (var data_2 = __values(data), data_2_1 = data_2.next(); !data_2_1.done; data_2_1 = data_2.next()) {
                var prim = data_2_1.value;
                primitives.push(prim);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (data_2_1 && !data_2_1.done && (_a = data_2.return)) _a.call(data_2);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return new SupportedPrimitives(primitives);
    };
    Object.defineProperty(SupportedPrimitives.prototype, "supportedPrimitives", {
        get: function () {
            if (this.content instanceof Array) {
                return __spread(this.content);
            }
        },
        enumerable: true,
        configurable: true
    });
    return SupportedPrimitives;
}(Attribute));
exports.SupportedPrimitives = SupportedPrimitives;
function sumLengths(attributes) {
    if (attributes.length === 0) {
        return 0;
    }
    return attributes.map(function (a) { return a.length; }).reduce(function (acc, val) { return acc + val; });
}

},{"../messages/primitive":8,"../parser/complements":11,"../parser/parser":12,"./format":3,"./type":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Error class is a abstract representation of the error code as
 * defined in the RFCP 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2
 */
var Error;
(function (Error) {
    Error[Error["ConfNotExist"] = 1] = "ConfNotExist";
    Error[Error["UserNotExist"] = 2] = "UserNotExist";
    Error[Error["UnknownPrim"] = 3] = "UnknownPrim";
    Error[Error["UnknownMandAttr"] = 4] = "UnknownMandAttr";
    Error[Error["UnauthOperation"] = 5] = "UnauthOperation";
    Error[Error["InvalidFloorId"] = 6] = "InvalidFloorId";
    Error[Error["FloorReqIdNotExist"] = 7] = "FloorReqIdNotExist";
    Error[Error["MaxFloorReqReached"] = 8] = "MaxFloorReqReached";
    Error[Error["UseTls"] = 9] = "UseTls";
    Error[Error["ParseError"] = 10] = "ParseError";
    Error[Error["UseDtls"] = 11] = "UseDtls";
    Error[Error["UnsupportedVersion"] = 12] = "UnsupportedVersion";
    Error[Error["BadLength"] = 13] = "BadLength";
    Error[Error["GenericError"] = 14] = "GenericError";
})(Error = exports.Error || (exports.Error = {}));

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Format class is a abstraction of the attribute Format as defined in
 * the RFCP 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2
 */
var Format;
(function (Format) {
    /** Gets Unsigned16 Format string */
    Format["Unsigned16"] = "Unsigned16";
    /** Gets OctetString16 Format string */
    Format["OctetString16"] = "OctetString16";
    /** Gets OctetString Format string */
    Format["OctetString"] = "OctetString";
    /** Gets Grouped Format string */
    Format["Grouped"] = "Grouped";
})(Format = exports.Format || (exports.Format = {}));

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Name class is a abstraction of the attribute Names
 */
var Name;
(function (Name) {
    /** Gets BeneficiaryId Name string */
    Name["BeneficiaryId"] = "BeneficiaryId";
    /** Gets FloorId Name string */
    Name["FloorId"] = "FloorId";
    /** Gets FloorRequestId Name string */
    Name["FloorRequestId"] = "FloorRequestId";
    /** Gets Priority Name string */
    Name["Priority"] = "Priority";
    /** Gets RequestStatus Name string */
    Name["RequestStatus"] = "RequestStatus";
    /** Gets ErrorCode Name string */
    Name["ErrorCode"] = "ErrorCode";
    /** Gets ErrorInfo Name string */
    Name["ErrorInfo"] = "ErrorInfo";
    /** Gets ParticipantProvidedInfo Name string */
    Name["ParticipantProvidedInfo"] = "ParticipantProvidedInfo";
    /** Gets StatusInfo Name string */
    Name["StatusInfo"] = "StatusInfo";
    /** Gets SupportedAttributes Name string */
    Name["SupportedAttributes"] = "SupportedAttributes";
    /** Gets SupportedPrimitives Name string */
    Name["SupportedPrimitives"] = "SupportedPrimitives";
    /** Gets UserDisplayName Name string */
    Name["UserDisplayName"] = "UserDisplayName";
    /** Gets UserUri Name string */
    Name["UserUri"] = "UserUri";
    /** Gets BeneficiaryInformation Name string */
    Name["BeneficiaryInformation"] = "BeneficiaryInformation";
    /** Gets FloorRequestInformation Name string */
    Name["FloorRequestInformation"] = "FloorRequestInformation";
    /** Gets RequestedByInformation Name string */
    Name["RequestedByInformation"] = "RequestedByInformation";
    /** Gets FloorRequestStatus Name string */
    Name["FloorRequestStatus"] = "FloorRequestStatus";
    /** Gets OverallRequestStatus Name string */
    Name["OverallRequestStatus"] = "OverallRequestStatus";
})(Name = exports.Name || (exports.Name = {}));

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The Attribute Type as defined in the RFCP 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.2
 */
var Type;
(function (Type) {
    /** Gets BeneficiaryId Type */
    Type[Type["BeneficiaryId"] = 1] = "BeneficiaryId";
    /** Gets FloorId Type */
    Type[Type["FloorId"] = 2] = "FloorId";
    /** Gets FloorRequestId Type */
    Type[Type["FloorRequestId"] = 3] = "FloorRequestId";
    /** Gets Priority Type */
    Type[Type["Priority"] = 4] = "Priority";
    /** Gets RequestStatus Type */
    Type[Type["RequestStatus"] = 5] = "RequestStatus";
    /** Gets ErrorCode Type */
    Type[Type["ErrorCode"] = 6] = "ErrorCode";
    /** Gets ErrorInfo Type */
    Type[Type["ErrorInfo"] = 7] = "ErrorInfo";
    /** Gets ParticipantProvidedInfo Type */
    Type[Type["ParticipantProvidedInfo"] = 8] = "ParticipantProvidedInfo";
    /** Gets StatusInfo Type */
    Type[Type["StatusInfo"] = 9] = "StatusInfo";
    /** Gets SupportedAttributes Type */
    Type[Type["SupportedAttributes"] = 10] = "SupportedAttributes";
    /** Gets SupportedPrimitives Type */
    Type[Type["SupportedPrimitives"] = 11] = "SupportedPrimitives";
    /** Gets UserDisplayName Type */
    Type[Type["UserDisplayName"] = 12] = "UserDisplayName";
    /** Gets UserUri Type */
    Type[Type["UserUri"] = 13] = "UserUri";
    /* grouped */
    /** Gets BeneficiaryInformation Type */
    Type[Type["BeneficiaryInformation"] = 14] = "BeneficiaryInformation";
    /** Gets FloorRequestInformation Type */
    Type[Type["FloorRequestInformation"] = 15] = "FloorRequestInformation";
    /** Gets RequestedByInformation Type */
    Type[Type["RequestedByInformation"] = 16] = "RequestedByInformation";
    /** Gets FloorRequestStatus Type */
    Type[Type["FloorRequestStatus"] = 17] = "FloorRequestStatus";
    /** Gets OverallRequestStatus Type */
    Type[Type["OverallRequestStatus"] = 18] = "OverallRequestStatus";
    /* unknown (Polycom RMX 1800) */
    Type[Type["Unknown19"] = 19] = "Unknown19";
    Type[Type["Unknown20"] = 20] = "Unknown20";
    /** Mandatory Attribute */
    Type[Type["Mandatory"] = 128] = "Mandatory";
    /** Encode Handler */
    Type[Type["EncodeHandler"] = 256] = "EncodeHandler";
})(Type = exports.Type || (exports.Type = {}));

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Complements = require("../parser/complements");
/*
  The following is the format of the common header.

     0                   1                   2                   3
     0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    | Ver |R|F| Res |  Primitive    |        Payload Length         |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                         Conference ID                         |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |         Transaction ID        |            User ID            |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    | Fragment Offset (if F is set) | Fragment Length (if F is set) |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
*/
/**
 * @classdesc
 * CommonHeader class is a abstraction of the CommonHeader as defined in the
 * RFC 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.1
 * @memberof Message
 */
var CommonHeader = /** @class */ (function () {
    /**
     * @constructor
     * @param primitive     The Message Primitive
     * @param payloadLength The length of the message in 4-octet, excluding the CommonHeader
     * @param conferenceId  The conference id
     * @param transactionId The transaction id
     * @param userId        The user id
     * @param isResponse    The responder flag
     */
    function CommonHeader(primitive, conferenceId, transactionId, userId) {
        this._payloadLength = 0;
        this._responder = false;
        this._primitive = primitive;
        this._payloadLength = 0;
        this._conferenceId = conferenceId;
        this._transactionId = transactionId;
        this._userId = userId;
    }
    Object.defineProperty(CommonHeader.prototype, "primitive", {
        /** The Message Primitive */
        get: function () {
            return this._primitive;
        },
        set: function (primitive) {
            this._primitive = primitive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommonHeader.prototype, "payloadLength", {
        /** The length of the message in 4-octet, excluding the CommonHeader */
        get: function () {
            return this._payloadLength;
        },
        set: function (payloadLength) {
            this._payloadLength = payloadLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommonHeader.prototype, "conferenceId", {
        /** The conference id */
        get: function () {
            return this._conferenceId;
        },
        set: function (conferenceId) {
            this._conferenceId = conferenceId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommonHeader.prototype, "transactionId", {
        /** The transaction id */
        get: function () {
            return this._transactionId;
        },
        set: function (transactionId) {
            this._transactionId = transactionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommonHeader.prototype, "userId", {
        /** The user id */
        get: function () {
            return this._userId;
        },
        set: function (userId) {
            this._userId = userId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommonHeader.prototype, "responderFlag", {
        /** The responder flag */
        get: function () {
            return this._responder;
        },
        set: function (responder) {
            this._responder = responder;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Encodes this CommonHeader instance from object oriented format to the
     * binary format.
     * @return Binary string representing the BFCP CommonHeader
     * @public
     */
    CommonHeader.prototype.encode = function () {
        var ver = "001";
        var responder = this._responder ? "1" : "0";
        var fragmentation = "0";
        var reserved = "000";
        var primitive = Complements.complementBinary(this.primitive, 8);
        var payloadLength = Complements.complementBinary(this.payloadLength, 16);
        var conferenceId = Complements.complementBinary(this.conferenceId, 32);
        var transactionId = Complements.complementBinary(this.transactionId, 16);
        var userId = Complements.complementBinary(this.userId, 16);
        return ver + responder + fragmentation + reserved +
            primitive + payloadLength + conferenceId + transactionId + userId;
    };
    return CommonHeader;
}());
exports.CommonHeader = CommonHeader;

},{"../parser/complements":11}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var attribute_1 = require("../attributes/attribute");
var type_1 = require("../attributes/type");
var commonHeader_1 = require("./commonHeader");
var primitive_1 = require("./primitive");
exports.MESSAGE_HEADER_SIZE = 12;
/**
 * Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3
 */
var Message = /** @class */ (function () {
    /**
     * @constructor
     * @param commonHeader The message common header
     * @param attributes   The message list of attributes
     */
    function Message(commonHeader, attributes) {
        var e_1, _a;
        this._attributes = [];
        this._commonHeader = commonHeader;
        if (attributes) {
            try {
                for (var attributes_1 = __values(attributes), attributes_1_1 = attributes_1.next(); !attributes_1_1.done; attributes_1_1 = attributes_1.next()) {
                    var attribute = attributes_1_1.value;
                    this.addAttribute(attribute);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (attributes_1_1 && !attributes_1_1.done && (_a = attributes_1.return)) _a.call(attributes_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    }
    Object.defineProperty(Message.prototype, "commonHeader", {
        get: function () {
            return this._commonHeader;
        },
        set: function (commonHeader) {
            this._commonHeader = commonHeader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "attributes", {
        /**
         * Gets an iterator for the attributes.
         */
        get: function () {
            return this._attributes[Symbol.iterator]();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the message attribute that contains the name received. If this
     * message haven't this attribute, returns null.
     * @param  attributeName The attribute Name
     */
    Message.prototype.getAttribute = function (attributeName) {
        var e_2, _a;
        try {
            for (var _b = __values(this.attributes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var attribute = _c.value;
                if (attribute.type === type_1.Type[attributeName]) {
                    return attribute;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return null;
    };
    /**
     * Adds an attribute object and updates the message length in the header.
     * @param attribute The attribute object
     */
    Message.prototype.addAttribute = function (attribute) {
        if (attribute) {
            this._attributes.push(attribute);
            this.commonHeader.payloadLength += Math.ceil(attribute.length / 4);
        }
    };
    /**
     * Encodes this Message instance from object oriented format to the binary
     * format. This process encode the CommonHeader and all attributes.
     */
    Message.prototype.encode = function () {
        var e_3, _a;
        var commonHeader = this.commonHeader.encode();
        var attributes = [];
        try {
            for (var _b = __values(this.attributes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var attribute = _c.value;
                attributes.push(attribute.encode());
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var message = commonHeader + attributes.join("");
        var size = message.length / 8;
        var octets = [];
        // binary to uint8
        for (var i = 0; i < size; i++) {
            octets.push(parseInt(message.substring(0 + 8 * i, 8 + 8 * i), 2));
        }
        // padding to DWORD
        Array(octets.length % 4).fill(0).forEach(function () { return octets.push(0); });
        return octets;
    };
    return Message;
}());
exports.Message = Message;
/**
 * FloorRequest Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.1
 */
var FloorRequest = /** @class */ (function (_super) {
    __extends(FloorRequest, _super);
    /**
     * @constructor
     * @param conferenceId   The conference id
     * @param transactionId  The transaction id
     * @param userId         The user id
     * @param floorId        The floor id
     * @param beneficiaryId  The beneficiary id (optional)
     */
    function FloorRequest(conferenceId, transactionId, userId, floorIds) {
        var e_4, _a;
        var _this = _super.call(this, new commonHeader_1.CommonHeader(primitive_1.Primitive.FloorRequest, conferenceId, transactionId, userId)) || this;
        if (!(floorIds instanceof Array)) {
            floorIds = [floorIds];
        }
        try {
            for (var floorIds_1 = __values(floorIds), floorIds_1_1 = floorIds_1.next(); !floorIds_1_1.done; floorIds_1_1 = floorIds_1.next()) {
                var floorId = floorIds_1_1.value;
                _this.addAttribute(new attribute_1.FloorId(floorId));
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (floorIds_1_1 && !floorIds_1_1.done && (_a = floorIds_1.return)) _a.call(floorIds_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return _this;
        // beneficiary
        // requestedBy
        // priority
    }
    return FloorRequest;
}(Message));
exports.FloorRequest = FloorRequest;
/**
 * FloorRelease Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.2
 */
var FloorRelease = /** @class */ (function (_super) {
    __extends(FloorRelease, _super);
    /**
     * @constructor
     * @param conferenceId   The conference id
     * @param transactionId  The transaction id
     * @param userId         The user id
     * @param floorRequestId The floor request id
     */
    function FloorRelease(conferenceId, transactionId, userId, floorRequestId) {
        return _super.call(this, new commonHeader_1.CommonHeader(primitive_1.Primitive.FloorRelease, conferenceId, transactionId, userId), [
            new attribute_1.FloorRequestId(floorRequestId),
        ]) || this;
    }
    return FloorRelease;
}(Message));
exports.FloorRelease = FloorRelease;
/**
 * FloorRequestQuery Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.3
 */
var FloorRequestQuery = /** @class */ (function (_super) {
    __extends(FloorRequestQuery, _super);
    /**
     * @constructor
     * @param conferenceId   The conference id
     * @param transactionId  The transaction id
     * @param userId         The user id
     * @param floorRequestId The floor request id
     */
    function FloorRequestQuery(conferenceId, transactionId, userId, floorRequestId) {
        return _super.call(this, new commonHeader_1.CommonHeader(primitive_1.Primitive.FloorRequestQuery, conferenceId, transactionId, userId), [
            new attribute_1.FloorRequestId(floorRequestId),
        ]) || this;
    }
    return FloorRequestQuery;
}(Message));
exports.FloorRequestQuery = FloorRequestQuery;
/**
 * FloorRequestStatus Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.4
 */
var FloorRequestStatus = /** @class */ (function (_super) {
    __extends(FloorRequestStatus, _super);
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
    function FloorRequestStatus(conferenceId, transactionId, userId, floorRequestId, floorId, requestStatus, isResponse) {
        if (isResponse === void 0) { isResponse = false; }
        var _this = _super.call(this, new commonHeader_1.CommonHeader(primitive_1.Primitive.FloorRequestStatus, conferenceId, transactionId, userId), [
            buildFloorRequestInfoAttr(floorRequestId, requestStatus),
            new attribute_1.FloorRequestStatus(floorId),
        ]) || this;
        _this.commonHeader.responderFlag = isResponse;
        return _this;
    }
    return FloorRequestStatus;
}(Message));
exports.FloorRequestStatus = FloorRequestStatus;
/**
 * UserQuery Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.5
 */
var UserQuery = /** @class */ (function (_super) {
    __extends(UserQuery, _super);
    /**
     * @constructor
     * @param conferenceId  The conference id
     * @param transactionId The transaction id
     * @param userId        The user id
     * @param beneficiaryId The beneficiary id (Optional)
     */
    function UserQuery(conferenceId, transactionId, userId, beneficiaryId) {
        var _this = _super.call(this, new commonHeader_1.CommonHeader(primitive_1.Primitive.UserQuery, conferenceId, transactionId, userId)) || this;
        if (beneficiaryId) {
            _this.addAttribute(new attribute_1.BeneficiaryId(beneficiaryId));
        }
        return _this;
    }
    return UserQuery;
}(Message));
exports.UserQuery = UserQuery;
/**
 * UserStatus Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.6
 */
var UserStatus = /** @class */ (function (_super) {
    __extends(UserStatus, _super);
    /**
     * @constructor
     * @param conferenceId    The conference id
     * @param transactionId   The transaction id
     * @param userId          The user id
     * @param floorRequestId  The floor request id
     * @param requestStatus   The request status
     * @param beneficiaryId   The beneficiary id (optional)
     */
    function UserStatus(conferenceId, transactionId, userId, floorRequestId, requestStatus, beneficiaryId) {
        var _this = _super.call(this, new commonHeader_1.CommonHeader(primitive_1.Primitive.UserStatus, conferenceId, transactionId, userId), [
            new attribute_1.FloorRequestInformation(floorRequestId, [
                new attribute_1.OverallRequestStatus(floorRequestId, [
                    new attribute_1.RequestStatus(requestStatus),
                ]),
            ]),
        ]) || this;
        _this.commonHeader.responderFlag = true;
        if (beneficiaryId) {
            _this.addAttribute(new attribute_1.BeneficiaryId(beneficiaryId));
        }
        return _this;
        // user-displayname
        // user-uri
    }
    return UserStatus;
}(Message));
exports.UserStatus = UserStatus;
/**
 * FloorQuery Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.7
 */
var FloorQuery = /** @class */ (function (_super) {
    __extends(FloorQuery, _super);
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
    function FloorQuery(conferenceId, transactionId, userId, floorId) {
        var _this = _super.call(this, new commonHeader_1.CommonHeader(primitive_1.Primitive.FloorQuery, conferenceId, transactionId, userId)) || this;
        if (floorId) {
            _this.addAttribute(new attribute_1.FloorId(floorId));
        }
        return _this;
    }
    return FloorQuery;
}(Message));
exports.FloorQuery = FloorQuery;
/**
 * FloorStatus Message
 * as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.8
 */
var FloorStatus = /** @class */ (function (_super) {
    __extends(FloorStatus, _super);
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
    function FloorStatus(conferenceId, transactionId, userId, floorRequestId, floorId, requestStatus, isResponse) {
        if (isResponse === void 0) { isResponse = false; }
        var _this = _super.call(this, new commonHeader_1.CommonHeader(primitive_1.Primitive.FloorStatus, conferenceId, transactionId, userId)) || this;
        _this.commonHeader.responderFlag = isResponse;
        if (floorId) {
            _this.addAttribute(new attribute_1.FloorId(floorId));
        }
        if (floorRequestId) {
            _this.addAttribute(buildFloorRequestInfoAttr(floorRequestId, requestStatus));
        }
        return _this;
    }
    return FloorStatus;
}(Message));
exports.FloorStatus = FloorStatus;
// https://tools.ietf.org/html/rfc4582#section-5.3.9
// export class ChairAction extends Message {}
// https://tools.ietf.org/html/rfc4582#section-5.3.10
// export class ChairActionAck extends Message {} // responseFlag = true
/**
 * Hello Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.11
 */
var Hello = /** @class */ (function (_super) {
    __extends(Hello, _super);
    /**
     * @constructor
     * @param conferenceId  The conference id
     * @param transactionId The transaction id
     * @param userId        The user id
     * @param floorId       The floor id
     */
    function Hello(conferenceId, transactionId, userId, floorId) {
        return _super.call(this, new commonHeader_1.CommonHeader(primitive_1.Primitive.Hello, conferenceId, transactionId, userId), [
            new attribute_1.FloorId(floorId),
        ]) || this;
    }
    return Hello;
}(Message));
exports.Hello = Hello;
/**
 * HelloAck Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.12
 */
var HelloAck = /** @class */ (function (_super) {
    __extends(HelloAck, _super);
    /**
     * @constructor
     * @param conferenceId  The conference id
     * @param transactionId The transaction id
     * @param userId        The user id
     */
    function HelloAck(conferenceId, transactionId, userId) {
        var _this = _super.call(this, new commonHeader_1.CommonHeader(primitive_1.Primitive.HelloAck, conferenceId, transactionId, userId), [
            new attribute_1.SupportedPrimitives(),
            new attribute_1.SupportedAttributes(),
        ]) || this;
        _this.commonHeader.responderFlag = true;
        return _this;
    }
    return HelloAck;
}(Message));
exports.HelloAck = HelloAck;
/**
 * Error Message as defined in the RFC 4582 - BFCP
 * @see https://tools.ietf.org/html/rfc4582#section-5.3.13
 */
var Error = /** @class */ (function (_super) {
    __extends(Error, _super);
    /**
     * @constructor
     * @param conferenceId  The conference id
     * @param transactionId The transaction id
     * @param userId        The user id
     * @param  errorCode     The error code
     */
    function Error(conferenceId, transactionId, userId, errorCode, errorInfo) {
        var _this = _super.call(this, new commonHeader_1.CommonHeader(primitive_1.Primitive.Error, conferenceId, transactionId, userId), [
            new attribute_1.ErrorCode(errorCode, errorInfo),
        ]) || this;
        _this.commonHeader.responderFlag = true;
        return _this;
    }
    return Error;
}(Message));
exports.Error = Error;
/**
 * FloorRequestStatusAck Message
 * extended from the RFC 4582 - BFCP
 */
var FloorRequestStatusAck = /** @class */ (function (_super) {
    __extends(FloorRequestStatusAck, _super);
    /**
     * @constructor
     * @param conferenceId   The conference id
     * @param transactionId  The transaction id
     * @param userId         The user id
     * @param floorId        The floor id
     */
    function FloorRequestStatusAck(conferenceId, transactionId, userId, floorId) {
        var _this = _super.call(this, new commonHeader_1.CommonHeader(primitive_1.Primitive.FloorRequestStatusAck, conferenceId, transactionId, userId), [
            new attribute_1.FloorId(floorId),
        ]) || this;
        _this.commonHeader.responderFlag = true;
        return _this;
    }
    return FloorRequestStatusAck;
}(Message));
exports.FloorRequestStatusAck = FloorRequestStatusAck;
/**
 * ErrorAck Message
 * extended from the RFC 4582 - BFCP
 */
var ErrorAck = /** @class */ (function (_super) {
    __extends(ErrorAck, _super);
    /**
     * @constructor
     * @param conferenceId   The conference id
     * @param transactionId  The transaction id
     * @param userId         The user id
     */
    function ErrorAck(conferenceId, transactionId, userId) {
        var _this = _super.call(this, new commonHeader_1.CommonHeader(primitive_1.Primitive.ErrorAck, conferenceId, transactionId, userId)) || this;
        _this.commonHeader.responderFlag = true;
        return _this;
    }
    return ErrorAck;
}(Message));
exports.ErrorAck = ErrorAck;
/**
 * FloorStatusAck Message
 * extended from the RFC 4582 - BFCP
 */
var FloorStatusAck = /** @class */ (function (_super) {
    __extends(FloorStatusAck, _super);
    /**
     * @constructor
     * @param conferenceId   The conference id
     * @param transactionId  The transaction id
     * @param userId         The user id
     * @param floorId        The floor id
     */
    function FloorStatusAck(conferenceId, transactionId, userId, floorId) {
        var _this = _super.call(this, new commonHeader_1.CommonHeader(primitive_1.Primitive.FloorStatusAck, conferenceId, transactionId, userId), [
            new attribute_1.FloorId(floorId),
        ]) || this;
        _this.commonHeader.responderFlag = true;
        return _this;
    }
    return FloorStatusAck;
}(Message));
exports.FloorStatusAck = FloorStatusAck;
/**
 * Goodbye Message
 * extended from the RFC 4582 - BFCP
 */
var Goodbye = /** @class */ (function (_super) {
    __extends(Goodbye, _super);
    /**
     * @constructor
     * @param conferenceId  The conference id
     * @param transactionId The transaction id
     * @param userId        The user id
     */
    function Goodbye(conferenceId, transactionId, userId) {
        return _super.call(this, new commonHeader_1.CommonHeader(primitive_1.Primitive.Goodbye, conferenceId, transactionId, userId)) || this;
    }
    return Goodbye;
}(Message));
exports.Goodbye = Goodbye;
/**
 * GoodbyeAck Message
 * extended from the RFC 4582 - BFCP
 */
var GoodbyeAck = /** @class */ (function (_super) {
    __extends(GoodbyeAck, _super);
    /**
     * @constructor
     * @param conferenceId  The conference id
     * @param transactionId The transaction id
     * @param userId        The user id
     */
    function GoodbyeAck(conferenceId, transactionId, userId) {
        var _this = _super.call(this, new commonHeader_1.CommonHeader(primitive_1.Primitive.GoodbyeAck, conferenceId, transactionId, userId)) || this;
        _this.commonHeader.responderFlag = true;
        return _this;
    }
    return GoodbyeAck;
}(Message));
exports.GoodbyeAck = GoodbyeAck;
function buildFloorRequestInfoAttr(floorRequestId, requestStatus) {
    return new attribute_1.FloorRequestInformation(floorRequestId, [
        new attribute_1.OverallRequestStatus(floorRequestId, [
            new attribute_1.RequestStatus(requestStatus),
        ]),
    ]);
}

},{"../attributes/attribute":1,"../attributes/type":5,"./commonHeader":6,"./primitive":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @classdesc
 * Primitive class is a abstraction of the Message Primitive as defined in
 * the RFCP 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.1
 * @memberof Message
 * @static
 */
var Primitive;
(function (Primitive) {
    /** Gets FloorRequest Primitive */
    Primitive[Primitive["FloorRequest"] = 1] = "FloorRequest";
    /** Gets FloorRelease Primitive */
    Primitive[Primitive["FloorRelease"] = 2] = "FloorRelease";
    /** Gets FloorRequestQuery Primitive */
    Primitive[Primitive["FloorRequestQuery"] = 3] = "FloorRequestQuery";
    /** Gets FloorRequestStatus Primitive */
    Primitive[Primitive["FloorRequestStatus"] = 4] = "FloorRequestStatus";
    /** Gets UserQuery Primitive */
    Primitive[Primitive["UserQuery"] = 5] = "UserQuery";
    /** Gets UserStatus Primitive */
    Primitive[Primitive["UserStatus"] = 6] = "UserStatus";
    /** Gets FloorQuery Primitive */
    Primitive[Primitive["FloorQuery"] = 7] = "FloorQuery";
    /** Gets FloorStatus Primitive */
    Primitive[Primitive["FloorStatus"] = 8] = "FloorStatus";
    /** Gets ChairAction Primitive */
    Primitive[Primitive["ChairAction"] = 9] = "ChairAction";
    /** Gets ChairActionAck Primitive */
    Primitive[Primitive["ChairActionAck"] = 10] = "ChairActionAck";
    /** Gets Hello Primitive */
    Primitive[Primitive["Hello"] = 11] = "Hello";
    /** Gets HelloAck Primitive */
    Primitive[Primitive["HelloAck"] = 12] = "HelloAck";
    /** Gets Error Primitive */
    Primitive[Primitive["Error"] = 13] = "Error";
    /* (EXTENDED FROM RFC) */
    /** Gets FloorRequestStatusAck Primitive */
    Primitive[Primitive["FloorRequestStatusAck"] = 14] = "FloorRequestStatusAck";
    /** Gets ErrorAck Primitive */
    Primitive[Primitive["ErrorAck"] = 15] = "ErrorAck";
    /** Gets FloorStatusAck Primitive */
    Primitive[Primitive["FloorStatusAck"] = 16] = "FloorStatusAck";
    /** Gets Goodbye Primitive */
    Primitive[Primitive["Goodbye"] = 17] = "Goodbye";
    /** Gets GoodbyeAck Primitive */
    Primitive[Primitive["GoodbyeAck"] = 18] = "GoodbyeAck";
})(Primitive = exports.Primitive || (exports.Primitive = {}));

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ReqStatus is a abstract representation of the request status as
 * defined in the RFCP 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2
 */
var RequestPriority;
(function (RequestPriority) {
    RequestPriority[RequestPriority["Lowest"] = 0] = "Lowest";
    RequestPriority[RequestPriority["Low"] = 1] = "Low";
    RequestPriority[RequestPriority["Normal"] = 2] = "Normal";
    RequestPriority[RequestPriority["High"] = 3] = "High";
    RequestPriority[RequestPriority["Highest"] = 4] = "Highest";
})(RequestPriority = exports.RequestPriority || (exports.RequestPriority = {}));

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * RequestStatusValue class is a abstraction of the Message Request Status as defined in
 * the RFCP 4582 - BFCP
 * https://tools.ietf.org/html/rfc4582#section-5.2.5
 * @memberof Message
 * @static
 */
var RequestStatusValue;
(function (RequestStatusValue) {
    /** Gets Pending value */
    RequestStatusValue[RequestStatusValue["Pending"] = 1] = "Pending";
    /** Gets Accepted value */
    RequestStatusValue[RequestStatusValue["Accepted"] = 2] = "Accepted";
    /** Gets Granted value */
    RequestStatusValue[RequestStatusValue["Granted"] = 3] = "Granted";
    /** Gets Denied value */
    RequestStatusValue[RequestStatusValue["Denied"] = 4] = "Denied";
    /** Gets Cancelled value */
    RequestStatusValue[RequestStatusValue["Cancelled"] = 5] = "Cancelled";
    /** Gets Released value */
    RequestStatusValue[RequestStatusValue["Released"] = 6] = "Released";
    /** Gets Revoked value */
    RequestStatusValue[RequestStatusValue["Revoked"] = 7] = "Revoked";
})(RequestStatusValue = exports.RequestStatusValue || (exports.RequestStatusValue = {}));

},{}],11:[function(require,module,exports){
"use strict";
/**
 * @module
 * Complements class is a static class to handle string (binary) operations of
 * complement (used to make a formated binary string from a not formated one).
 * @memberof bfcp-lib
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Complements the binary string with '0' at it begin until have reached the
 * necessary string length.
 * @param  binary The binary string
 * @param  length The necessary length
 * @return        The binary string with the correct length
 */
function complementBinary(val, length) {
    var binary = val.toString(2);
    var complement = length - binary.length;
    if (complement <= 0) {
        return binary;
    }
    var complementString = "0".repeat(complement);
    return complementString + binary;
}
exports.complementBinary = complementBinary;
/**
 * Complements the binary string with 8 bits of '0' at it end have reached
 * the 32bits format. (padding)
 * @param  content The binary string
 * @return         The binary string with the correct format
 */
function complementPadding(content) {
    while (content.length < 100000 && content.length % 32 !== 0) {
        content = content + "00000000";
    }
    return content;
}
exports.complementPadding = complementPadding;

},{}],12:[function(require,module,exports){
"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ATTR = require("../attributes/attribute");
var type_1 = require("../attributes/type");
var commonHeader_1 = require("../messages/commonHeader");
var message_1 = require("../messages/message");
var primitive_1 = require("../messages/primitive");
var Complements = require("../parser/complements");
function getBinary(data, start, length) {
    var e_1, _a;
    if (start === void 0) { start = 0; }
    if (length === void 0) { length = -1; }
    var end = length < 0 ? undefined : start + length;
    var binaries = [];
    try {
        for (var _b = __values(data.slice(start, end)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var byte = _c.value;
            binaries.push(Complements.complementBinary(byte, 8));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return binaries.join("");
}
exports.getBinary = getBinary;
function getString(data, start, length) {
    if (start === void 0) { start = 0; }
    if (length === void 0) { length = -1; }
    var end = length < 0 ? undefined : start + length;
    return String.fromCharCode.apply(null, data.slice(start, end));
}
exports.getString = getString;
function getInteger(data, start, length) {
    if (start === void 0) { start = 0; }
    if (length === void 0) { length = -1; }
    return parseInt(getBinary(data, start, length), 2);
}
exports.getInteger = getInteger;
/**
 * Parses an BFCP Message as received in a TCP/UDP socket to a Object Oriented
 * BFCP Message. Must receive the message as a Buffer, like when it arrives
 * from the TCP/UDP socket.
 * @param  message The buffered Message
 * @return Object Oriented BFCP Message
 * @throws Will throw an Error if the Message couldn't be parsed.
 */
function parseMessage(message) {
    if (message.length < message_1.MESSAGE_HEADER_SIZE) {
        throw new Error("Invalid message size: " + message.length + " bytes");
    }
    try {
        var commonHeader = parseCommonHeader(message.slice(0, message_1.MESSAGE_HEADER_SIZE));
        var attributes = parseAttributes(message.slice(message_1.MESSAGE_HEADER_SIZE));
        switch (commonHeader.primitive) {
            case primitive_1.Primitive.Hello:
                return new message_1.Message(commonHeader, attributes);
            case primitive_1.Primitive.HelloAck:
                return new message_1.Message(commonHeader, attributes);
            case primitive_1.Primitive.FloorRequest:
                return new message_1.Message(commonHeader, attributes);
            case primitive_1.Primitive.FloorRelease:
                return new message_1.Message(commonHeader, attributes);
            case primitive_1.Primitive.FloorRequestStatus:
                return new message_1.Message(commonHeader, attributes);
            case primitive_1.Primitive.FloorRequestStatusAck:
                return new message_1.Message(commonHeader, attributes);
            case primitive_1.Primitive.FloorStatus:
                return new message_1.Message(commonHeader, attributes);
            case primitive_1.Primitive.FloorStatusAck:
                return new message_1.Message(commonHeader, attributes);
            case primitive_1.Primitive.FloorQuery:
                return new message_1.Message(commonHeader, attributes);
            case primitive_1.Primitive.Goodbye:
                return new message_1.Message(commonHeader, attributes);
            case primitive_1.Primitive.GoodbyeAck:
                return new message_1.Message(commonHeader, attributes);
            case primitive_1.Primitive.Error:
                return new message_1.Message(commonHeader, attributes);
            case primitive_1.Primitive.ErrorAck:
                return new message_1.Message(commonHeader, attributes);
            case primitive_1.Primitive.UserQuery:
            case primitive_1.Primitive.UserStatus:
            case primitive_1.Primitive.ChairAction:
            case primitive_1.Primitive.ChairActionAck:
            case primitive_1.Primitive.FloorRequestQuery:
                // throw new Error("Unsupported primitive.");
                return new message_1.Message(commonHeader, attributes);
            default:
                // throw new Error("I can't decode this message. Unknown primitive.");
                return new message_1.Message(commonHeader, attributes);
        }
    }
    catch (error) {
        throw error;
    }
}
exports.parseMessage = parseMessage;
/**
 * Parses the CommonHeader bits of the message to a CommonHeader Object.
 * @param  commonHeader Binary string representing the CommonHeader
 * @return The CommonHeader object
 */
function parseCommonHeader(header) {
    var pos = 0;
    var byte1 = getBinary(header, pos, 1);
    var version = parseInt(byte1.substr(0, 3), 2);
    var responder = byte1[4] === "1";
    var fragment = byte1[5] === "1";
    pos += 1;
    var primitive = getInteger(header, pos, 1);
    pos += 1;
    var payloadLength = getInteger(header, pos, 2);
    pos += 2;
    var conferenceId = getInteger(header, pos, 4);
    pos += 4;
    var transactionId = getInteger(header, pos, 2);
    pos += 2;
    var userId = getInteger(header, pos, 2);
    pos += 2;
    var cm = new commonHeader_1.CommonHeader(primitive, conferenceId, transactionId, userId);
    // cm.payloadLength = payloadLength; // counter via adding attribute
    cm.responderFlag = responder;
    return cm;
}
/**
 * Parses the Attributes bits of the message to a Attribute list object.
 * @param  attributeBuffer Binary string representing the Attributes
 * @return The Attribute list object
 */
function parseAttributes(body) {
    var attributes = [];
    for (var pos = 0; pos < body.length;) {
        // attribute header
        var attrHeader = getBinary(body, pos, ATTR.ATTRIBUTE_HEADER_SIZE);
        var type = parseInt(attrHeader.substr(0, 7), 2);
        var mandatory = attrHeader[7] === "1";
        var length = parseInt(attrHeader.substr(8, 8), 2);
        var attrBody = body.slice(pos + ATTR.ATTRIBUTE_HEADER_SIZE, pos + length);
        pos += ATTR.ATTRIBUTE_HEADER_SIZE + attrBody.length;
        var attribute = void 0;
        switch (type) {
            case type_1.Type.BeneficiaryId:
                attribute = ATTR.BeneficiaryId.decode(attrBody);
                break;
            case type_1.Type.FloorId:
                attribute = ATTR.FloorId.decode(attrBody);
                break;
            case type_1.Type.FloorRequestId:
                attribute = ATTR.FloorRequestId.decode(attrBody);
                break;
            case type_1.Type.Priority:
                attribute = ATTR.Priority.decode(attrBody);
                break;
            case type_1.Type.RequestStatus:
                attribute = ATTR.RequestStatus.decode(attrBody);
                break;
            case type_1.Type.ErrorCode:
                attribute = ATTR.ErrorCode.decode(attrBody);
                break;
            /* string attributes */
            case type_1.Type.ErrorInfo:
                attribute = ATTR.ErrorInfo.decode(attrBody);
                break;
            case type_1.Type.ParticipantProvidedInfo:
                attribute = ATTR.ParticipantProvidedInfo.decode(attrBody);
                break;
            case type_1.Type.StatusInfo:
                attribute = ATTR.StatusInfo.decode(attrBody);
                break;
            case type_1.Type.UserDisplayName:
                attribute = ATTR.UserDisplayName.decode(attrBody);
                break;
            case type_1.Type.UserUri:
                attribute = ATTR.StatusInfo.decode(attrBody);
                break;
            case type_1.Type.SupportedAttributes:
                attribute = ATTR.SupportedAttributes.decode(attrBody);
                break;
            case type_1.Type.SupportedPrimitives:
                attribute = ATTR.SupportedPrimitives.decode(attrBody);
                break;
            /* grouped attributes */
            case type_1.Type.BeneficiaryInformation: // beneficiary-id
                attribute = ATTR.BeneficiaryInformation.decode(attrBody);
                break;
            case type_1.Type.FloorRequestInformation: // floor-request-id
                attribute = ATTR.FloorRequestInformation.decode(attrBody);
                break;
            case type_1.Type.RequestedByInformation: // requested-by-id
                attribute = ATTR.RequestedByInformation.decode(attrBody);
                break;
            case type_1.Type.FloorRequestStatus: // floor-id
                attribute = ATTR.FloorRequestStatus.decode(attrBody);
                break;
            case type_1.Type.OverallRequestStatus: // floor-request-id
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
exports.parseAttributes = parseAttributes;

},{"../attributes/attribute":1,"../attributes/type":5,"../messages/commonHeader":6,"../messages/message":7,"../messages/primitive":8,"../parser/complements":11}],13:[function(require,module,exports){
"use strict";
/**
 * bfcp-lib: A simple library for BFCP protocol
 * @module bfcp-lib
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var Attributes = require("./lib/attributes/attribute");
exports.Attributes = Attributes;
var Parser = require("./lib/parser/parser");
exports.Parser = Parser;
var error_1 = require("./lib/attributes/error");
exports.Error = error_1.Error;
var format_1 = require("./lib/attributes/format");
exports.Format = format_1.Format;
var name_1 = require("./lib/attributes/name");
exports.Name = name_1.Name;
var type_1 = require("./lib/attributes/type");
exports.Type = type_1.Type;
var primitive_1 = require("./lib/messages/primitive");
exports.Primitive = primitive_1.Primitive;
var priority_1 = require("./lib/messages/priority");
exports.RequestPriority = priority_1.RequestPriority;
var requestStatusValue_1 = require("./lib/messages/requestStatusValue");
exports.RequestStatusValue = requestStatusValue_1.RequestStatusValue;
__export(require("./lib/messages/message"));

},{"./lib/attributes/attribute":1,"./lib/attributes/error":2,"./lib/attributes/format":3,"./lib/attributes/name":4,"./lib/attributes/type":5,"./lib/messages/message":7,"./lib/messages/primitive":8,"./lib/messages/priority":9,"./lib/messages/requestStatusValue":10,"./lib/parser/parser":12}]},{},[13])(13)
});
