/** Tracks edits independently of request timing and React renders. */
export function createSaveTracker() {
  let revision = 0;
  let saved = 0;
  let pending: number | null = null;
  return {
    edit() { revision += 1; },
    dirty() { return revision !== saved; },
    begin() {
      if (pending !== null) return null;
      pending = revision;
      return pending;
    },
    complete(value: number) {
      saved = value;
      pending = null;
      return revision === saved;
    },
    fail() { pending = null; },
  };
}
