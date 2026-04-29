export function calcAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();

  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export const MIN_CHILD_AGE = 2;
export const MAX_CHILD_AGE = 18;

function shiftYears(date: Date, years: number) {
  const shiftedDate = new Date(date);
  shiftedDate.setFullYear(shiftedDate.getFullYear() + years);
  return shiftedDate;
}

function startOfDay(date: Date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

export function getChildBirthDateRange(now = new Date()) {
  return {
    minDate: startOfDay(shiftYears(now, -MAX_CHILD_AGE)),
    maxDate: startOfDay(shiftYears(now, -MIN_CHILD_AGE)),
  };
}

export function isChildAgeAllowed(birthDate: Date, now = new Date()) {
  const { minDate, maxDate } = getChildBirthDateRange(now);
  const normalizedBirthDate = startOfDay(birthDate);
  return normalizedBirthDate >= minDate && normalizedBirthDate <= maxDate;
}
