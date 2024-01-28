"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseType = exports.AuthType = void 0;
var AuthType;
(function (AuthType) {
    AuthType["Credentails"] = "Credentails";
    AuthType["MagicLink"] = "MagicLink";
    AuthType["Social"] = "Social";
})(AuthType || (exports.AuthType = AuthType = {}));
var ResponseType;
(function (ResponseType) {
    ResponseType["Error"] = "error";
    ResponseType["Success"] = "success";
})(ResponseType || (exports.ResponseType = ResponseType = {}));
