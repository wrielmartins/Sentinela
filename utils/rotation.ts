export const TEAMS = ['A', 'B', 'C', 'D'] as const;
export const REF_DATE = new Date(2026, 0, 29); // Jan 29, 2026

/**
 * Calculates which team is on duty for a given date.
 * Base logic: 29/01/2026 = Team D.
 */
export const getTeamForDate = (date: Date): string => {
    // Normalize dates to midnight for consistent day calculation
    const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const d2 = new Date(REF_DATE.getFullYear(), REF_DATE.getMonth(), REF_DATE.getDate());

    const diffTime = d1.getTime() - d2.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // 29/01 is 'D'. Since TEAMS is [A, B, C, D], index for D is 3.
    let index = (3 + diffDays) % 4;
    while (index < 0) index += 4;

    return TEAMS[index];
};

/**
 * Checks if two dates are the same day.
 */
export const isSameDay = (d1: Date, d2: Date): boolean => {
    return (
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()
    );
};
