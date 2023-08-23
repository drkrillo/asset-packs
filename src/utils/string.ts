export function slug(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+\-\s+/gi, ' ')
    .trim()
    .replace(/\s/gi, '_')
}
