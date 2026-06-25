export function formatDate(value: string | number | Date): string {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
}
