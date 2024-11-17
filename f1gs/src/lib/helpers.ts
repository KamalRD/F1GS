import dayjs from 'dayjs';
import { BackEndEvent, DayLawYear, NightLawYear } from './types';
import { EditEventValues } from '@/components/admin/events/EditEvent';

export function computeEventDiff(a: BackEndEvent, b: EditEventValues): Partial<BackEndEvent> {
    const diff: Partial<BackEndEvent> = {};

    for (const key in a) {
        if (key === "id") {
            continue;
        }
        if (Object.prototype.hasOwnProperty.call(a, key)) {
            const valueA = a[key as keyof BackEndEvent];
            const valueB = b[key as keyof BackEndEvent];

            // Check if the values are dates

            if (key === 'start_time' || key === 'end_time') {
                // Use Day.js to compare dates with both date and time precision
                if (!dayjs(valueA as Date).isSame(dayjs(valueB))) {
                    diff[key] = valueB;
                }
            } else if (valueA !== valueB) {
                // Regular comparison for non-date values
                diff[key as keyof Partial<BackEndEvent>] = valueB;
            }
        }
    }

    return diff;
}

export function calculateGraduationYear(lawYear: DayLawYear | NightLawYear): number {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-based month

    const isDayLawYear = (year: DayLawYear | NightLawYear): year is DayLawYear => {
        return year === '1L' || year === '2L' || year === '3L';
    };

    if (isDayLawYear(lawYear)) {
        switch (lawYear) {
            case '1L':
                return currentMonth >= 5 && currentMonth <= 12
                    ? currentYear + 3
                    : currentYear + 2;
            case '2L':
                return currentMonth >= 5 && currentMonth <= 12
                    ? currentYear + 2
                    : currentYear + 1;
            case '3L':
                return currentMonth >= 5 && currentMonth <= 12
                    ? currentYear + 1
                    : currentYear;
            default:
                return currentYear;
        }
    } else {
        switch (lawYear) {
            case '1LE':
                return currentMonth >= 5 && currentMonth <= 12
                    ? currentYear + 4
                    : currentYear + 3;
            case '2LE':
                return currentMonth >= 5 && currentMonth <= 12
                    ? currentYear + 3
                    : currentYear + 2;
            case '3LE':
                return currentMonth >= 5 && currentMonth <= 12
                    ? currentYear + 2
                    : currentYear + 1;
            case '4LE':
                return currentMonth >= 5 && currentMonth <= 12
                    ? currentYear + 1
                    : currentYear;
            default:
                return currentYear;
        }
    }
}