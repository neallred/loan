export function numTo$(x: number): string {
  return '$' + (Math.round((x * 100)) / 100).toLocaleString()
}
