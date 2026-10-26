import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

function handler(path, name, context) {
  const source = readFileSync(path, 'utf8');
  const start = source.indexOf('async function ' + name);
  const end = source.indexOf('\n  }\n', start) + 4;
  const compiled = ts.transpileModule('const handler = ' + source.slice(start, end), {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return new Function(...Object.keys(context), compiled + '; return handler;')(...Object.values(context));
}

for (const path of ['app/(auth)/login/page.tsx', 'app/(auth)/register/page.tsx']) {
  test(path + ': libera formulário após falha de conexão', async () => {
    const loading = [];
    const errors = [];
    const reject = async () => { throw new Error('offline'); };
    const submit = handler(path, 'handleSubmit', {
      setError: (value) => errors.push(value),
      setLoading: (value) => loading.push(value),
      username: ' teste ', password: 'senha-de-teste',
      fetch: reject, signIn: reject,
      router: { push() { assert.fail('não deve navegar'); }, refresh() {} },
    });
    await submit({ preventDefault() {} });
    assert.deepEqual(loading, [true, false]);
    assert.match(errors.at(-1), /conexão/);
  });
}

test('criação de diagrama permite tentar novamente após falha de conexão', async () => {
  const creating = [];
  const errors = [];
  const create = handler('components/TypeWizard.tsx', 'handleCreate', {
    creatingId: null,
    setCreatingId: (value) => creating.push(value),
    setError: (value) => errors.push(value),
    fetch: async () => { throw new Error('offline'); },
    router: { push() { assert.fail('não deve navegar'); } },
  });
  await create('flowchart');
  assert.deepEqual(creating, ['flowchart', null]);
  assert.match(errors.at(-1), /conexão/);
});
