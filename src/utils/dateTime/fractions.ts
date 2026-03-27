export const getMilliseconds = ({
    seconds = 0,
    minutes = 0,
    hours = 0,
    days = 0,
    weeks = 0,
    months = 0,
    years = 0,
}): number => {
    //* Constants for direct conversions
    const MS_PER_SECOND = 1000;
    const MS_PER_MINUTE = 60 * MS_PER_SECOND;
    const MS_PER_HOUR = 60 * MS_PER_MINUTE;
    const MS_PER_DAY = 24 * MS_PER_HOUR;
    const MS_PER_WEEK = 7 * MS_PER_DAY;

    //* Direct calculation for fixed units
    const fixedUnitMs = seconds * MS_PER_SECOND +
        minutes * MS_PER_MINUTE +
        hours * MS_PER_HOUR +
        days * MS_PER_DAY +
        weeks * MS_PER_WEEK;

    //* Use Date only for months and years (variable units)
    let variableUnitMs = 0;
    if (months !== 0 || years !== 0) {
        const baseDate = new Date(1970, 0, 1);
        const modifiedDate = new Date(1970, months, 1);
        modifiedDate.setFullYear(baseDate.getFullYear() + years);
        variableUnitMs = modifiedDate.getTime() - baseDate.getTime();
    }

    return fixedUnitMs + variableUnitMs;
};

export const getSeconds = ({
    seconds = 0,
    minutes = 0,
    hours = 0,
    days = 0,
    weeks = 0,
    months = 0,
    years = 0,
}): number => {
    return getMilliseconds({ seconds, minutes, hours, days, weeks, months, years }) / 1000;
};

export const getMinutes = ({
    seconds = 0,
    minutes = 0,
    hours = 0,
    days = 0,
    weeks = 0,
    months = 0,
    years = 0,
}): number => {
    return getMilliseconds({ seconds, minutes, hours, days, weeks, months, years }) / (1000 * 60);
};