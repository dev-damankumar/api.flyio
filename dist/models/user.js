"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("./../generated/graphql");
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    authType: {
        type: String,
        enum: [graphql_1.AuthType.Credentails, graphql_1.AuthType.MagicLink, graphql_1.AuthType.Social],
        required: true,
        default: graphql_1.AuthType.Credentails,
    },
    password: {
        type: String,
    },
    security: {
        resetPassword: {
            otp: Number,
            token: String,
            expiry: Date,
        },
        verification: {
            otp: Number,
            token: String,
            expiry: Date,
        },
    },
    address: {
        city: {
            type: String,
        },
        country: {
            type: String,
        },
        state: {
            type: String,
        },
        pincode: {
            type: Number,
        },
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("User", userSchema);
