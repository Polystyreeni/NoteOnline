/**
 * Return milliseconds in proper date format
 * @param {number} millis milliseconds from 1.1.1970
 * @returns date string
 */
export function millisToDate(millis) {
    const date = new Date(millis);
    return date.toLocaleString();
}