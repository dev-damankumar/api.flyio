"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const gqlFiles = (0, fs_1.readdirSync)((0, path_1.resolve)(__dirname, '../../../', 'src', 'graphql', './typedefs'));
let typeDefs = '';
gqlFiles.forEach((file) => {
    console.log('file', file);
    if (file.includes('.graphql')) {
        typeDefs += (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, '../../../', 'src', 'graphql', './typedefs', file), {
            encoding: 'utf8',
        });
    }
});
exports.default = typeDefs;
