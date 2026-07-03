// Date-badge formatting for event cards. Parses the ISO date string manually
// so build output never depends on the build machine's timezone.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function eventBadge(eventDate) {
    const [year, month, day] = eventDate.split('-');
    return {
        day: String(Number(day)),
        monthYear: `${MONTHS[Number(month) - 1]} ${year}`,
    };
}
