const blogDateFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

export function formatBlogDate(date: string): string {
  return blogDateFormatter.format(new Date(`${date}T00:00:00.000Z`));
}
