const assert = require('assert');
const Series = require('../studie2_series_core.js');
const Material = require('../studie2_material_core.js');
const Events = require('../studie2_events_core.js');

function permutations(values) {
  if (values.length === 1) return [values.slice()];
  const out = [];
  values.forEach((value, index) => {
    const rest = values.slice(0, index).concat(values.slice(index + 1));
    permutations(rest).forEach(tail => out.push([value].concat(tail)));
  });
  return out;
}

const material = Material.generate();
const seeds = permutations([1,2,3,4,5]);
let minDuration = Infinity;
let maxDuration = -Infinity;
let minSeed = null;
let maxSeed = null;

for (const seed of seeds) {
  const series = Series.generate(seed);
  const result = Events.generate(series, material, { historicalCorrections: false });
  assert.strictEqual(result.eventCount, 380, `event count for ${seed}`);
  assert(result.events.every(event => event.frequencies.length === 5));
  assert(result.events.every(event => event.frequencies.every(Number.isFinite)));
  assert(result.events.every(event => Number.isFinite(event.startSec) && event.startSec >= 0));
  assert(result.events.every(event => Number.isFinite(event.durationSec) && event.durationSec > 0));
  assert(result.events.every(event => Number.isFinite(event.dbStart) && Number.isFinite(event.dbEnd)));
  if (result.totalDurationSec < minDuration) { minDuration = result.totalDurationSec; minSeed = seed.slice(); }
  if (result.totalDurationSec > maxDuration) { maxDuration = result.totalDurationSec; maxSeed = seed.slice(); }
}

console.log(JSON.stringify({
  status: 'ok',
  permutationsTested: seeds.length,
  minDurationSec: minDuration,
  minDurationSeed: minSeed,
  maxDurationSec: maxDuration,
  maxDurationSeed: maxSeed
}, null, 2));
