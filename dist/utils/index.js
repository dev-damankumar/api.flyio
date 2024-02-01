"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GQLError = void 0;
class GQLError extends Error {
    constructor(message, code) {
        super(message);
        Object.setPrototypeOf(this, GQLError.prototype);
        this.extensions = {
            code,
        };
    }
}
exports.GQLError = GQLError;
