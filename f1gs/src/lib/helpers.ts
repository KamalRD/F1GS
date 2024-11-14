import dayjs from 'dayjs';
import { BackEndEvent } from './types';
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
                if (!dayjs(valueA).isSame(dayjs(valueB))) {
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
