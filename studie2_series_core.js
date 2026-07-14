/*
    studie2_series_core.js
    Pure ES5-compatible implementation of the ten number squares used in
    Stockhausen's Studie II.

    This file contains no Max-specific code. It is included by the Max wrapper
    and can also be tested with Node.js.
*/

var Studie2Series = (function () {
    "use strict";

    var N = 5;
    var NAMES = ["R1", "R2", "R3", "R4", "R5", "U1", "U2", "U3", "U4", "U5"];

    function copy(values) {
        return values.slice(0);
    }

    function wrapOneToFive(value) {
        while (value > N) {
            value -= N;
        }
        while (value < 1) {
            value += N;
        }
        return value;
    }

    function isValidPermutation(values) {
        var seen = {};
        var i;
        var value;

        if (!values || values.length !== N) {
            return false;
        }

        for (i = 0; i < N; i++) {
            value = Number(values[i]);
            if (value !== Math.floor(value) || value < 1 || value > N || seen[value]) {
                return false;
            }
            seen[value] = true;
        }
        return true;
    }

    function normalizeSeed(values) {
        var result = [];
        var i;
        if (!isValidPermutation(values)) {
            throw new Error("Expected a permutation of 1 2 3 4 5.");
        }
        for (i = 0; i < N; i++) {
            result.push(Number(values[i]));
        }
        return result;
    }

    function transposeIntervalSeries(series, initialValue) {
        var result = [];
        var current = initialValue;
        var i;
        var nextIndex;
        var interval;

        for (i = 0; i < series.length; i++) {
            result.push(current);
            nextIndex = (i + 1) % series.length;
            interval = series[nextIndex] - series[i];
            current = wrapOneToFive(current + interval);
        }
        return result;
    }

    function makeR1(seed) {
        var result = [];
        var row;
        var i;
        for (i = 0; i < N; i++) {
            row = transposeIntervalSeries(seed, seed[i]);
            result = result.concat(row);
        }
        return result;
    }

    function indexOfValue(values, value) {
        var i;
        for (i = 0; i < values.length; i++) {
            if (values[i] === value) {
                return i;
            }
        }
        return -1;
    }

    function hopSequence(values, hopWidth) {
        var result = [];
        var i;
        for (i = 0; i < values.length; i++) {
            result.push(values[(i * hopWidth) % values.length]);
        }
        return result;
    }

    function rowDistances(topRow, row) {
        var result = [];
        var i;
        var firstIndex;
        var secondIndex;
        var distance;

        for (i = 0; i < row.length - 1; i++) {
            firstIndex = indexOfValue(topRow, row[i]);
            secondIndex = indexOfValue(topRow, row[i + 1]);
            distance = secondIndex - firstIndex;
            if (distance < 0) {
                distance += N;
            }
            result.push(distance);
        }
        return result;
    }

    function makeDistanceTable(r1) {
        var topRow = r1.slice(0, N);
        var result = [];
        var rowIndex;
        var row;

        for (rowIndex = 1; rowIndex < N; rowIndex++) {
            row = r1.slice(rowIndex * N, (rowIndex + 1) * N);
            result = result.concat(rowDistances(topRow, row));
        }
        return result;
    }

    function makeRowByDistances(topRow, distances, initialValue) {
        var result = [initialValue];
        var currentIndex = indexOfValue(topRow, initialValue);
        var i;

        for (i = 0; i < distances.length; i++) {
            currentIndex = (currentIndex + distances[i]) % N;
            result.push(topRow[currentIndex]);
        }
        return result;
    }

    function makeDerivedSquare(r1, sourceRowIndex, hopWidth, distanceTable) {
        var topRow = r1.slice(sourceRowIndex * N, (sourceRowIndex + 1) * N);
        var rowStarts = hopSequence(topRow, hopWidth);
        var result = copy(topRow);
        var rowIndex;
        var distances;
        var row;

        for (rowIndex = 1; rowIndex < N; rowIndex++) {
            distances = distanceTable.slice((rowIndex - 1) * (N - 1), rowIndex * (N - 1));
            row = makeRowByDistances(topRow, distances, rowStarts[rowIndex]);
            result = result.concat(row);
        }
        return result;
    }

    function invertSquare(square) {
        var result = [];
        var i;
        for (i = 0; i < square.length; i++) {
            result.push(6 - square[i]);
        }
        return result;
    }

    function generate(seedValues) {
        var seed = normalizeSeed(seedValues);
        var squares = {};
        var r1 = makeR1(seed);
        var distances = makeDistanceTable(r1);
        var i;

        squares.R1 = r1;
        for (i = 2; i <= N; i++) {
            squares["R" + i] = makeDerivedSquare(r1, i - 1, i, distances);
        }
        for (i = 1; i <= N; i++) {
            squares["U" + i] = invertSquare(squares["R" + i]);
        }

        return {
            seed: seed,
            names: copy(NAMES),
            squares: squares,
            distanceTable: distances
        };
    }

    function randomSeed(randomFunction) {
        var values = [1, 2, 3, 4, 5];
        var random = randomFunction || Math.random;
        var i;
        var j;
        var temporary;

        for (i = values.length - 1; i > 0; i--) {
            j = Math.floor(random() * (i + 1));
            temporary = values[i];
            values[i] = values[j];
            values[j] = temporary;
        }
        return values;
    }

    function toRows(square) {
        var rows = [];
        var i;
        for (i = 0; i < N; i++) {
            rows.push(square.slice(i * N, (i + 1) * N));
        }
        return rows;
    }

    return {
        NAMES: copy(NAMES),
        generate: generate,
        randomSeed: randomSeed,
        isValidPermutation: isValidPermutation,
        normalizeSeed: normalizeSeed,
        toRows: toRows,
        wrapOneToFive: wrapOneToFive
    };
}());

if (typeof module !== "undefined" && module.exports) {
    module.exports = Studie2Series;
}
