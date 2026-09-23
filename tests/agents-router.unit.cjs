// The lab's router must agree with the agents-system evals, case by case.
const test = require('node:test');
const assert = require('node:assert');
const data = require('../lab/data.json');
const { checkCase, route } = require('../lab/router.js');

for (const c of data.cases) {
  test(`eval ${c.id}`, () => {
    const r = checkCase(c, data);
    assert.ok(r.ok, r.problems.join(', '));
  });
}

test('trace lists the precedence checks in order', () => {
  const r = route({ title: 'Investiga en paralelo dos opciones', body: '', labels: [] }, data);
  assert.deepStrictEqual(r.trace.map((s) => s.step), ['riesgo', 'agente explícito', 'paralelismo']);
});
