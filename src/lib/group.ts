/**
 * Family group ID — taken from URL `?g=...` query parameter.
 * If absent, falls back to 'demo'. The group ID is the shared secret —
 * anyone with the URL can read/write the group's parking records.
 */
export function getGroupId(): string {
  const params = new URLSearchParams(window.location.search);
  const g = params.get('g');
  if (g && /^[a-z0-9-_]{1,40}$/i.test(g)) return g;
  return 'demo';
}
