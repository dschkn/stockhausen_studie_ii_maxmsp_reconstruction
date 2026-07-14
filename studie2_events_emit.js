/* Internal event-object and part-emission procedures for Studie II. */
var Studie2EventsInternals = (typeof Studie2EventsInternals !== "undefined") ? Studie2EventsInternals : ((typeof module !== "undefined" && module.exports) ? require("./studie2_events_envelopes.js") : {});
(function (I) {
    "use strict";
    var TAPE_SPEED = 76.2;
    var clone = I.clone;
    var getValue = I.getValue;
    var getFrequencies = I.getFrequencies;
    var maximaByGroups = I.maximaByGroups;
    var dbEnvelopePart1 = I.dbEnvelopePart1;
    var dbEnvelopePart2 = I.dbEnvelopePart2;
    var dbEnvelopePart4 = I.dbEnvelopePart4;
    function panFromLowestFrequency(frequency) {
        var relative = (Math.log(frequency / 100) / Math.log(5)) * 25;
        var pan = relative / 60;
        if (pan < 0) {
            return 0;
        }
        if (pan > 1) {
            return 1;
        }
        return pan;
    }

    function eventObject(part, sequenceIndex, noteIndex, startCm, durationCm, frequencies, dbStart, dbEnd, type) {
        return {
            id: 0,
            part: part,
            set: Math.floor(sequenceIndex / 5) + 1,
            sequence: (sequenceIndex % 5) + 1,
            note: noteIndex + 1,
            type: type || 0,
            startCm: startCm,
            startSec: startCm / TAPE_SPEED,
            durationCm: durationCm,
            durationSec: durationCm / TAPE_SPEED,
            frequencies: clone(frequencies),
            dbStart: dbStart,
            dbEnd: dbEnd,
            pan: panFromLowestFrequency(frequencies[0])
        };
    }

    function pushPart1(events, starts, counts, frequencies, durations, dbValues, envelopes) {
        var sequenceIndex;
        var noteIndex;
        var absoluteIndex = 0;
        var currentStart;
        var count;
        var dbPair;

        for (sequenceIndex = 0; sequenceIndex < counts.length; sequenceIndex++) {
            currentStart = starts[sequenceIndex];
            count = counts[sequenceIndex];
            for (noteIndex = 0; noteIndex < count; noteIndex++) {
                dbPair = dbEnvelopePart1(dbValues, envelopes, absoluteIndex, noteIndex, count);
                events.push(eventObject(1, sequenceIndex, noteIndex, currentStart, durations[absoluteIndex], frequencies[absoluteIndex], dbPair[0], dbPair[1], 1));
                currentStart += durations[absoluteIndex];
                absoluteIndex += 1;
            }
        }
    }

    function pushPart2(events, starts, counts, frequencies, durations, dbValues, envelopes) {
        var maxima = maximaByGroups(durations, counts);
        var sequenceIndex;
        var noteIndex;
        var absoluteIndex = 0;
        var count;
        var startSequence;
        var envelope;
        var duration;
        var start;
        var dbPair;

        for (sequenceIndex = 0; sequenceIndex < counts.length; sequenceIndex++) {
            count = counts[sequenceIndex];
            startSequence = starts[sequenceIndex];
            envelope = envelopes[sequenceIndex];
            for (noteIndex = 0; noteIndex < count; noteIndex++) {
                duration = durations[absoluteIndex];
                dbPair = dbEnvelopePart2(dbValues[absoluteIndex], envelope, maxima[sequenceIndex], duration);
                if (envelope === 1 || envelope === 2) {
                    start = startSequence;
                } else {
                    start = startSequence + (maxima[sequenceIndex] - duration);
                }
                events.push(eventObject(2, sequenceIndex, noteIndex, start, duration, frequencies[absoluteIndex], dbPair[0], dbPair[1], 2));
                absoluteIndex += 1;
            }
        }
    }

    function pushPart3(events, starts, counts, frequencies, durations, dbValues) {
        var sequenceIndex;
        var noteIndex;
        var absoluteIndex = 0;
        var count;

        for (sequenceIndex = 0; sequenceIndex < counts.length; sequenceIndex++) {
            count = counts[sequenceIndex];
            for (noteIndex = 0; noteIndex < count; noteIndex++) {
                events.push(eventObject(3, sequenceIndex, noteIndex, starts[absoluteIndex], durations[absoluteIndex], frequencies[absoluteIndex], dbValues[absoluteIndex], -40, 3));
                absoluteIndex += 1;
            }
        }
    }

    function pushPart4(events, starts, counts, frequencies, durations, dbValues, envelopes) {
        var maxima = maximaByGroups(durations, counts);
        var sequenceIndex;
        var noteIndex;
        var absoluteIndex = 0;
        var count;
        var startSequence;
        var envelope;
        var duration;
        var start;
        var dbPair;

        for (sequenceIndex = 0; sequenceIndex < counts.length; sequenceIndex++) {
            count = counts[sequenceIndex];
            startSequence = starts[sequenceIndex];
            envelope = envelopes[sequenceIndex];
            for (noteIndex = 0; noteIndex < count; noteIndex++) {
                duration = durations[absoluteIndex];
                dbPair = dbEnvelopePart4(dbValues[absoluteIndex], envelope, maxima[sequenceIndex], duration);
                if (envelope === 1 || envelope === 2 || envelope === 5) {
                    start = startSequence;
                } else {
                    start = startSequence + (maxima[sequenceIndex] - duration);
                }
                events.push(eventObject(4, sequenceIndex, noteIndex, start, duration, frequencies[absoluteIndex], dbPair[0], dbPair[1], 2));
                absoluteIndex += 1;
            }
        }
    }

    function pushPart5(events, starts, counts, types, frequencies, durations, dbPairs) {
        var sequenceIndex;
        var noteIndex;
        var absoluteIndex = 0;
        var count;

        for (sequenceIndex = 0; sequenceIndex < counts.length; sequenceIndex++) {
            count = counts[sequenceIndex];
            for (noteIndex = 0; noteIndex < count; noteIndex++) {
                events.push(eventObject(5, sequenceIndex, noteIndex, starts[absoluteIndex], durations[absoluteIndex], frequencies[absoluteIndex], dbPairs[absoluteIndex][0], dbPairs[absoluteIndex][1], types[sequenceIndex]));
                absoluteIndex += 1;
            }
        }
    }

    function pushCoda(events, start, seed, baseDurations, baseFrequencies, baseIntensities) {
        var i;
        var value;
        var frequencies;
        var duration;
        var db;
        var dbStart;
        var dbEnd;
        var event;

        for (i = 0; i < seed.length; i++) {
            value = seed[i];
            frequencies = getFrequencies(baseFrequencies, 1, 1, 1, value);
            duration = getValue(baseDurations, 1, 1, 5, value);
            db = getValue(baseIntensities, 1, 2, 1, value);

            if (value > 3) {
                dbStart = (db < -8) ? -30 : -40;
                dbEnd = db;
            } else {
                dbStart = db;
                dbEnd = (db < -6) ? -30 : -40;
            }

            event = eventObject(6, 0, i, start, duration, frequencies, dbStart, dbEnd, 0);
            event.set = 1;
            event.sequence = 1;
            events.push(event);
            start += duration;
        }
        return start;
    }

    function assignIds(events) {
        var sorted = events.slice(0);
        var i;
        sorted.sort(function (a, b) {
            if (a.startCm !== b.startCm) {
                return a.startCm - b.startCm;
            }
            if (a.part !== b.part) {
                return a.part - b.part;
            }
            return a.note - b.note;
        });
        for (i = 0; i < sorted.length; i++) {
            sorted[i].id = i + 1;
        }
        return sorted;
    }

    I.panFromLowestFrequency = panFromLowestFrequency;
    I.eventObject = eventObject;
    I.pushPart1 = pushPart1;
    I.pushPart2 = pushPart2;
    I.pushPart3 = pushPart3;
    I.pushPart4 = pushPart4;
    I.pushPart5 = pushPart5;
    I.pushCoda = pushCoda;
    I.assignIds = assignIds;
}(Studie2EventsInternals));
if (typeof module !== "undefined" && module.exports) { module.exports = Studie2EventsInternals; }
