"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gettomorrowDateRange = exports.getTodayDateRange = exports.minutesToMillsecond = void 0;
const minutesToMillsecond = (minutes) => {
    return 1000 * 60 * minutes;
};
exports.minutesToMillsecond = minutesToMillsecond;
const getTodayDateRange = () => {
    const todayStartDate = new Date();
    const todayNowDate = new Date();
    const todayEndDate = new Date();
    todayStartDate.setHours(0, 0, 0);
    todayEndDate.setHours(23, 59, 59);
    return { todayStartDate, todayEndDate, todayNowDate };
};
exports.getTodayDateRange = getTodayDateRange;
const gettomorrowDateRange = () => {
    const tomorrowStartDate = new Date();
    tomorrowStartDate.setHours(0, 0, 0, 0);
    const tomorrowEndDate = new Date();
    tomorrowEndDate.setHours(23, 59, 59);
    tomorrowStartDate.setDate(tomorrowStartDate.getDate() + 1);
    tomorrowEndDate.setDate(tomorrowEndDate.getDate() + 1);
    return { tomorrowStartDate, tomorrowEndDate };
};
exports.gettomorrowDateRange = gettomorrowDateRange;
