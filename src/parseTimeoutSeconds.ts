export const defaultTimeout = 15 * 60

export function parseTimeoutSeconds(timeoutString?: string): number {
  return Math.max(
    (parseInt(timeoutString, 10) || defaultTimeout),
    0
  )
}
