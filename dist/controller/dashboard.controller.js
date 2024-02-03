"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getStats = (context) => {
    if (!context.auth)
        throw new Error('Unauthorized access');
    return {
        stats: 10,
    };
};
const setStats = (context) => {
    console.log('set Stat context', context.auth);
    if (!context.auth)
        throw new Error('Unauthorized access');
    return {
        stats: 10,
    };
};
exports.default = {
    getStats,
    setStats,
};
