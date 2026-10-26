import test from 'node:test';
import assert from 'node:assert/strict';

const saveModule = await import('../lib/save-tracker.ts').catch(() => ({}));

test('uma resposta antiga não marca edições novas como salvas', () => {
  assert.equal(typeof saveModule.createSaveTracker, 'function');
  const tracker = saveModule.createSaveTracker();
  tracker.edit();
  const revision = tracker.begin();
  tracker.edit();
  assert.equal(tracker.complete(revision), false);
  assert.equal(tracker.dirty(), true);
});

test('impede salvamentos simultâneos e permite tentar novamente após falha', () => {
  assert.equal(typeof saveModule.createSaveTracker, 'function');
  const tracker = saveModule.createSaveTracker();
  tracker.edit();
  const revision = tracker.begin();
  assert.equal(tracker.begin(), null);
  tracker.fail();
  assert.equal(tracker.dirty(), true);
  assert.equal(tracker.begin(), revision);
  assert.equal(tracker.complete(revision), true);
  assert.equal(tracker.dirty(), false);
});
