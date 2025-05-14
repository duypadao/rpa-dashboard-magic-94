export const formatUnicorn = (input: string, unicorn: object) => {
    const args = Object.entries(unicorn);
    args.forEach(([k, v]) => {
        input = input.replace(`{{${k}}}`, v);
    })
    return input;
}

export const formatSecond = (seconds, t = null) => {
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    let str = "";
    if (hours > 0) {
        str += "{{hours}}h";
    }
    if (minutes > 0) {
        str += "{{minutes}}m";
    }
    if (seconds > 0) {
        str += "{{seconds}}s";
    }
    if (t) {
        return t(str, {
            hours, minutes, seconds
        })
    }
    return formatUnicorn(str, {
        hours, minutes, seconds
    })
}

/**
* Humanizes a datetime value into a natural language format
* @param {Date|string|number} date - The date to humanize (Date object, ISO string, or timestamp)
* @param {Object} options - Configuration options
* @param {boolean} options.includeTime - Whether to include the time in the output
* @param {boolean} options.useRelative - Whether to use relative time formats for recent dates
* @returns {string} A human-friendly representation of the date
*/
export interface HumanizeDateTimeOptions {
    includeTime: boolean,
    useRelative: boolean,
}
export function humanizeDateTime(date: Date, t: (key: string, unicorn?: object) => void = null, options: HumanizeDateTimeOptions = { includeTime: true, useRelative: true }) {
    const { includeTime = true, useRelative = true } = options;

    // Convert input to Date object if it's not already
    const dateObj = date instanceof Date ? date : new Date(date);


    if (t) {
        // Check if date is valid
        if (isNaN(dateObj.getTime())) {
            return t('Invalid date');
        }

        const now = new Date();
        const diffMs = now.getTime() - dateObj.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        // Handle relative time formatting for recent dates
        if (useRelative) {
            // Just now (within the last minute)
            if (diffSecs < 10) {
                return t('just now');
            }
            if (diffSecs < 60) {
                return t(`{{diffSecs}} seconds ago`, { diffSecs });
            }

            // Minutes ago (within the last hour)
            if (diffMins < 60) {
                return t(`{{diffMins}} ${diffMins === 1 ? 'minute' : 'minutes'} ago`, { diffMins });
            }

            // Hours ago (within the last day)
            if (diffHours < 24) {
                return t(`{{diffHours}} ${diffHours === 1 ? 'hour' : 'hours'} ago`, { diffHours });
            }

            // Yesterday
            if (diffDays === 1) {
                const timeStr = includeTime ? t('at') + ' ' + formatTime(dateObj) : '';
                return t('yesterday') + timeStr;
            }

            // Within the last week
            if (diffDays < 7) {
                const timeStr = includeTime ? t('at') + ' ' + formatTime(dateObj) : '';
                return t('{{diffDays}} {{day_plural}} ago', { diffDays, day_plural: diffDays === 1 ? t('day') : t('days') }) + timeStr;
            }
        }

        // For older dates, use a more formal format
        const formattedDate = formatDate(dateObj);

        if (includeTime) {
            return `${formattedDate} at ${formatTime(dateObj)}`;
        }

        return formattedDate;
    }
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
    }

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Handle relative time formatting for recent dates
    if (useRelative) {
        // Just now (within the last minute)
        if (diffSecs < 10) {
            return 'just now';
        }
        if (diffSecs < 60) {
            return `${diffSecs} seconds ago`;
        }

        // Minutes ago (within the last hour)
        if (diffMins < 60) {
            return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
        }

        // Hours ago (within the last day)
        if (diffHours < 24) {
            return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        }

        // Yesterday
        if (diffDays === 1) {
            const timeStr = includeTime ? t('at') + ' ' + formatTime(dateObj) : '';
            return t('yesterday') + timeStr;
        }

        // Within the last week
        if (diffDays < 7) {
            const timeStr = includeTime ? t('at') + ' ' + formatTime(dateObj) : '';
            return t('{{diffDays}} {{day_plural}} ago', { diffDays, day_plural: diffDays === 1 ? t('day') : t('days') }) + timeStr;
        }
    }

    // For older dates, use a more formal format
    const formattedDate = formatDate(dateObj);

    if (includeTime) {
        return `${formattedDate} ${t('at')} ${formatTime(dateObj)}`;
    }

    return formattedDate;
}

/**
 * Format the date portion in a human-friendly way
 * @param {Date} date - The date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
    const now = new Date();
    const isThisYear = date.getFullYear() === now.getFullYear();

    const options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };

    if (!isThisYear) {
        options.year = 'numeric';
    }

    return date.toLocaleDateString(undefined, options);
}

/**
 * Format the time portion in a human-friendly way
 * @param {Date} date - The date to format
 * @returns {string} Formatted time
 */
export function formatTime(date) {
    return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
    });
}


export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const randomIntFromInterval = (min: number, max: number) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};


export const round = (number: number, decimals: number) => {
    return Math.round((number + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function addDays(date: Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
export function getMonday(d: Date) {
    d = new Date(d);
    var day = d.getDay();
    var diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}
export function getMondayAndSaturdayFromDate(d: Date) {
    const monday = getMonday(d);
    const saturday = addDays(monday, 5)
    return { monday, saturday };
}

export function getFirstDayAndLastDayOfMonthFromDate(d: Date) {
    var date = d, y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    return { firstDay, lastDay };
}

export function getFirstDayAndLastDayOfYearFromDate(d: Date) {
    var date = d, y = date.getFullYear();
    var firstDay = new Date(y, 0, 1);
    var lastDay = new Date(y, 11, 31);
    return { firstDay, lastDay };
}