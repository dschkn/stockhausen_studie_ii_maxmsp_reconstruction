/*
    studie2_material_core.js
    Generates the three basic material banks used by Studie II:
    81 frequencies, 61 tape durations and 61 intensity values.
*/

var Studie2Material = (function () {
    "use strict";

    var RATIO = Math.pow(5, 1 / 25);
    var TAPE_SPEED_CM_PER_SEC = 76.2;

    function recursiveTable(size, start, multiplier) {
        var result = [];
        var i;
        for (i = 0; i < size; i++) {
            result.push(start * Math.pow(multiplier, i));
        }
        return result;
    }

    function reverse(values) {
        return values.slice(0).reverse();
    }

    function makeIntensityTable(start, minimum) {
        var result = [];
        var value;
        for (value = start; value >= minimum; value--) {
            result.push(value);
        }
        for (value = minimum + 1; value <= start; value++) {
            result.push(value);
        }
        return result;
    }

    function generate() {
        var frequencies = recursiveTable(81, 100, RATIO);
        var durationsCm = reverse(recursiveTable(61, 2.5, RATIO));
        var durationsSec = [];
        var intensitiesDb = makeIntensityTable(0, -30);
        var i;

        for (i = 0; i < durationsCm.length; i++) {
            durationsSec.push(durationsCm[i] / TAPE_SPEED_CM_PER_SEC);
        }

        return {
            ratio: RATIO,
            tapeSpeedCmPerSec: TAPE_SPEED_CM_PER_SEC,
            frequencies: frequencies,
            durationsCm: durationsCm,
            durationsSec: durationsSec,
            intensitiesDb: intensitiesDb
        };
    }

    return {
        RATIO: RATIO,
        TAPE_SPEED_CM_PER_SEC: TAPE_SPEED_CM_PER_SEC,
        generate: generate
    };
}());

if (typeof module !== "undefined" && module.exports) {
    module.exports = Studie2Material;
}
