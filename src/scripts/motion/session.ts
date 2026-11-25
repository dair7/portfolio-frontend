const storagePrefix = "motion:";

export function claimFirstVisit(key: string): boolean {
  const storageKey = `${storagePrefix}${key}`;
  // Storage can throw in private modes; skipping the intro is the safe fallback.
  try {
    if (sessionStorage.getItem(storageKey)) return false;
    sessionStorage.setItem(storageKey, "seen");
    return true;
  } catch {
    return false;
  }
}
