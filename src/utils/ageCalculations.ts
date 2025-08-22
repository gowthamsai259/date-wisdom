import { differenceInYears, differenceInMonths, differenceInDays, format } from "date-fns";

export interface AgeCalculation {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalDays: number;
  dayOfLife: number;
}

export const calculateAge = (birthDate: Date, currentDate: Date = new Date()): AgeCalculation => {
  const years = differenceInYears(currentDate, birthDate);
  const totalMonths = differenceInMonths(currentDate, birthDate);
  const totalDays = differenceInDays(currentDate, birthDate);
  
  // Calculate remaining months after full years
  const yearStart = new Date(birthDate);
  yearStart.setFullYear(yearStart.getFullYear() + years);
  const months = differenceInMonths(currentDate, yearStart);
  
  // Calculate remaining days after full months
  const monthStart = new Date(yearStart);
  monthStart.setMonth(monthStart.getMonth() + months);
  const days = differenceInDays(currentDate, monthStart);
  
  return {
    years,
    months,
    days,
    totalMonths,
    totalDays,
    dayOfLife: totalDays + 1 // +1 because we want to include the birth day
  };
};

export const formatDayOfLife = (dayNumber: number): string => {
  const suffixes = ["th", "st", "nd", "rd"];
  const lastDigit = dayNumber % 10;
  const lastTwoDigits = dayNumber % 100;
  
  let suffix;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    suffix = "th";
  } else {
    suffix = suffixes[lastDigit] || "th";
  }
  
  return `${dayNumber.toLocaleString()}${suffix}`;
};