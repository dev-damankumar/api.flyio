"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const util_1 = require("util");
const constants_1 = require("../constants");
const send = ({ to, subject, html, cc = '' }) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: constants_1.email.from,
        to,
        subject,
        html,
        cc,
    };
    if (constants_1._prod_ && !constants_1.mockSMTP) {
        mail_1.default.setApiKey(constants_1.sendGridApiKey);
        const info = yield mail_1.default.send(mailOptions);
        console.log('Email Sent!!:', info);
        return;
    }
    const account = yield (0, util_1.promisify)(nodemailer_1.default.createTestAccount)();
    console.log('Test email account created', account);
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass, // generated ethereal password
        },
    });
    const info = yield transporter.sendMail(mailOptions);
    console.log('Preview URL: %s', nodemailer_1.default.getTestMessageUrl(info));
});
exports.send = send;
