import { TTimeSlots } from "./../types";
export const minutesToMillsecond = (minutes: number) => {
  return 1000 * 60 * minutes;
};

export const getTodayDateRange = () => {
  const todayStartDate = new Date();
  const todayEndDate = new Date();
  todayStartDate.setHours(0, 0, 0);
  todayEndDate.setHours(23, 59, 59);
  return { todayStartDate, todayEndDate };
};

export const getTommorrowDateRange = () => {
  const tommorrowStartDate = new Date();
  tommorrowStartDate.setHours(0, 0, 0, 0);
  const tommorrowEndDate = new Date();
  tommorrowEndDate.setHours(23, 59, 59);
  tommorrowStartDate.setDate(tommorrowStartDate.getDate() + 1);
  tommorrowEndDate.setDate(tommorrowEndDate.getDate() + 1);

  return { tommorrowStartDate, tommorrowEndDate };
};
