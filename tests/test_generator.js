const assert = require('assert');
const Series = require('../studie2_series_core.js');
const Material = require('../studie2_material_core.js');
const Events = require('../studie2_events_core.js');

const expectedR1 = [
  3,5,1,4,2,
  5,2,3,1,4,
  1,3,4,2,5,
  4,1,2,5,3,
  2,4,5,3,1
];
const expectedR2 = [
  5,2,3,1,4,
  3,5,2,1,4,
  4,3,5,2,1,
  2,5,3,4,1,
  1,3,5,4,2
];

const series = Series.generate([3,5,1,4,2]);
assert.deepStrictEqual(series.squares.R1, expectedR1);
assert.deepStrictEqual(series.squares.R2, expectedR2);
assert.deepStrictEqual(series.squares.U1, expectedR1.map(value => 6 - value));
assert.deepStrictEqual(series.squares.U2, expectedR2.map(value => 6 - value));
assert.strictEqual(series.names.length, 10);
for (const name of series.names) {
  assert.strictEqual(series.squares[name].length, 25);
}

const variation = Series.generate([1,5,4,2,3]);
for (const name of variation.names) {
  assert.strictEqual(variation.squares[name].length, 25);
  for (let row = 0; row < 5; row++) {
    const values = variation.squares[name].slice(row * 5, row * 5 + 5).slice().sort();
    assert.deepStrictEqual(values, [1,2,3,4,5]);
  }
}

const material = Material.generate();
assert.strictEqual(material.frequencies.length, 81);
assert.strictEqual(material.durationsCm.length, 61);
assert.strictEqual(material.intensitiesDb.length, 61);
assert(Math.abs(material.frequencies[0] - 100) < 1e-9);
assert(material.frequencies[80] > 17000 && material.frequencies[80] < 17300);

const original = Events.generate(series, material, { historicalCorrections: true });
assert.strictEqual(original.eventCount, 380);
assert.deepStrictEqual(original.partEventCounts, [75,75,75,75,75,5]);
assert(original.totalDurationSec > 160 && original.totalDurationSec < 190);
assert(original.events.every(e => e.frequencies.length === 5));
assert(original.events.every(e => e.durationSec > 0));
assert(original.events.every(e => Number.isFinite(e.startSec)));
assert(original.events.every(e => e.dbStart <= 0 && e.dbEnd <= 0));

const generatedVariation = Events.generate(variation, material, { historicalCorrections: false });
assert.strictEqual(generatedVariation.eventCount, 380);
assert.notDeepStrictEqual(
  generatedVariation.events.slice(0, 10).map(e => e.frequencies),
  original.events.slice(0, 10).map(e => e.frequencies)
);

console.log(JSON.stringify({
  status: 'ok',
  originalDurationSec: original.totalDurationSec,
  variationDurationSec: generatedVariation.totalDurationSec,
  originalFirstEvent: original.events[0],
  variationFirstEvent: generatedVariation.events[0]
}, null, 2));
