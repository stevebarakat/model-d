/**
 * Utility function to convert a string to a slug
 */
export function slugify(str: string) {
  return str.toLowerCase().replace(/ /g, "-");
}

/**
 * Utility function to conditionally join class names together
 */
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}
