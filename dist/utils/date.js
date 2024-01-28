"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTommorrowDateRange = exports.getTodayDateRange = exports.minutesToMillsecond = void 0;
const minutesToMillsecond = (minutes) => {
    return 1000 * 60 * minutes;
};
exports.minutesToMillsecond = minutesToMillsecond;
const getTodayDateRange = () => {
    const todayStartDate = new Date();
    const todayEndDate = new Date();
    todayStartDate.setHours(0, 0, 0);
    todayEndDate.setHours(23, 59, 59);
    return { todayStartDate, todayEndDate };
};
exports.getTodayDateRange = getTodayDateRange;
const getTommorrowDateRange = () => {
    const tommorrowStartDate = new Date();
    tommorrowStartDate.setHours(0, 0, 0, 0);
    const tommorrowEndDate = new Date();
    tommorrowEndDate.setHours(23, 59, 59);
    tommorrowStartDate.setDate(tommorrowStartDate.getDate() + 1);
    tommorrowEndDate.setDate(tommorrowEndDate.getDate() + 1);
    return { tommorrowStartDate, tommorrowEndDate };
};
exports.getTommorrowDateRange = getTommorrowDateRange;
