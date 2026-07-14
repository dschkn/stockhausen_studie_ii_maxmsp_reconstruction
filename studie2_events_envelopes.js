/* Internal amplitude-envelope procedures for Studie II. */
var Studie2EventsInternals = (typeof Studie2EventsInternals !== "undefined") ? Studie2EventsInternals : ((typeof module !== "undefined" && module.exports) ? require("./studie2_events_parameters.js") : {});
(function (I) {
    "use strict";
    var clone = I.clone;
    var append3 = I.append3;
    var getValue = I.getValue;
    var maximaByGroups = I.maximaByGroups;
    function dbEnvelopePart1(dbValues, envelopeValues, absoluteIndex, noteIndex, count) {
        var db = dbValues[absoluteIndex];
        var envelope = envelopeValues[absoluteIndex];
        var dbNext;
        var envelopeNext;

        if (noteIndex !== count - 1) {
            dbNext = dbValues[absoluteIndex + 1];
            envelopeNext = envelopeValues[absoluteIndex + 1];
        } else {
            dbNext = 0;
            envelopeNext = 1;
        }

        if (envelope === 1) {
            return [-40, db];
        }
        if (noteIndex === count - 1 || envelopeNext === 1 || dbNext > db) {
            return [db, -40];
        }
        return [db, dbNext];
    }

    function dbEnvelopePart2(db, envelope, maximumDuration, duration) {
        var relation;
        var difference;
        var dbStart;
        var dbEnd;

        if (envelope === 2 || envelope === 5) {
            return [-40, db];
        }
        if (envelope === 3) {
            return [db, -40];
        }
        if (envelope === 1) {
            dbStart = db;
            relation = duration / maximumDuration;
            difference = dbStart + 35;
            dbEnd = dbStart - (relation * difference);
            dbEnd = (dbEnd <= -35) ? -40 : dbEnd;
            return [dbStart, dbEnd];
        }
        dbEnd = db;
        relation = duration / maximumDuration;
        difference = dbEnd + 35;
        dbStart = dbEnd - (relation * difference);
        dbStart = (dbStart <= -35) ? -40 : dbStart;
        return [dbStart, dbEnd];
    }

    function dbTablePart4(baseIntensities, counts, groups, transposition, columns, pos1, pos2, pos3, envelopes) {
        var positions = append3(pos1, pos2, pos3);
        var output = new Array(positions.length);
        var sequenceIndex;
        var noteIndex;
        var absoluteIndex = 0;
        var sequenceStart;
        var count;
        var column;
        var group;
        var envelope;
        var position;
        var db;
        var reference;
        var backwardIndex;

        for (sequenceIndex = 0; sequenceIndex < counts.length; sequenceIndex++) {
            count = counts[sequenceIndex];
            column = columns[sequenceIndex];
            group = groups[sequenceIndex];
            envelope = envelopes[sequenceIndex];
            reference = 0;
            sequenceStart = absoluteIndex;

            for (noteIndex = 0; noteIndex < count; noteIndex++) {
                if (envelope === 1 || envelope === 2 || envelope === 5) {
                    position = positions[absoluteIndex];
                    if (noteIndex === 0) {
                        db = getValue(baseIntensities, group, transposition, column, position);
                        reference = db;
                    } else {
                        db = reference - position;
                        reference = db;
                    }
                    output[absoluteIndex] = db;
                } else {
                    backwardIndex = sequenceStart + count - noteIndex - 1;
                    position = positions[backwardIndex];
                    if (noteIndex === 0) {
                        db = getValue(baseIntensities, group, transposition, column, position);
                        reference = db;
                    } else {
                        db = reference - position;
                        reference = db;
                    }
                    output[backwardIndex] = db;
                }
                absoluteIndex += 1;
            }
        }
        return output;
    }

    function dbEnvelopePart4(db, envelope, maximumDuration, duration) {
        var relation;
        var difference;
        var dbStart;
        var dbEnd;

        if (envelope === 2) {
            return [-40, db];
        }
        if (envelope === 3 || envelope === 5) {
            return [db, -40];
        }
        if (envelope === 1) {
            dbStart = db;
            relation = duration / maximumDuration;
            difference = dbStart + 35;
            dbEnd = dbStart - (relation * difference);
            dbEnd = (dbEnd <= -35) ? -40 : dbEnd;
            return [dbStart, dbEnd];
        }
        dbEnd = db;
        relation = duration / maximumDuration;
        difference = dbEnd + 35;
        dbStart = dbEnd - (relation * difference);
        dbStart = (dbStart <= -35) ? -40 : dbStart;
        return [dbStart, dbEnd];
    }

    function applyCorrections(values, pairs) {
        var output = clone(values);
        var i;
        for (i = 0; i < pairs.length; i += 2) {
            output[pairs[i]] = pairs[i + 1];
        }
        return output;
    }

    function dbEnvelopesPart5(dbValues, counts, types, linkedEnvelopes, chordEnvelopes, durations) {
        var output = [];
        var maxima = maximaByGroups(durations, counts);
        var sequenceIndex;
        var noteIndex;
        var absoluteIndex = 0;
        var linkedEnvelopeIndex = 0;
        var chordEnvelopeIndex = 0;
        var count;
        var maximumDuration;
        var type;
        var db;
        var duration;
        var envelope;
        var relation;
        var difference;
        var dbStart;
        var dbEnd;
        var crescendoLinked;
        var dbPrevious;
        var dbNext;
        var envelopeNext;

        for (sequenceIndex = 0; sequenceIndex < counts.length; sequenceIndex++) {
            count = counts[sequenceIndex];
            maximumDuration = maxima[sequenceIndex];
            type = types[sequenceIndex];
            crescendoLinked = 0;

            for (noteIndex = 0; noteIndex < count; noteIndex++) {
                db = dbValues[absoluteIndex];
                duration = durations[absoluteIndex];

                if (type === 3) {
                    dbStart = db;
                    dbEnd = -40;
                } else if (type === 2) {
                    envelope = chordEnvelopes[chordEnvelopeIndex];
                    if (envelope === 2 || envelope === 6) {
                        dbStart = -40;
                        dbEnd = db;
                    } else if (envelope === 3 || envelope === 5) {
                        dbStart = db;
                        dbEnd = -40;
                    } else if (envelope === 1) {
                        dbStart = db;
                        relation = duration / maximumDuration;
                        difference = dbStart + 35;
                        dbEnd = dbStart - (relation * difference);
                        dbEnd = (dbEnd <= -35) ? -40 : dbEnd;
                    } else {
                        dbEnd = db;
                        relation = duration / maximumDuration;
                        difference = dbEnd + 35;
                        dbStart = dbEnd - (relation * difference);
                        dbStart = (dbStart <= -35) ? -40 : dbStart;
                    }
                } else {
                    envelope = linkedEnvelopes[linkedEnvelopeIndex];
                    if (envelope === 1) {
                        if (crescendoLinked === 0) {
                            dbStart = -40;
                            dbEnd = db;
                        } else {
                            dbPrevious = output[output.length - 1][1];
                            dbStart = dbPrevious;
                            dbEnd = db;
                            crescendoLinked = 0;
                        }
                    } else {
                        if (noteIndex !== count - 1) {
                            dbNext = dbValues[absoluteIndex + 1];
                            envelopeNext = linkedEnvelopes[linkedEnvelopeIndex + 1];
                        } else {
                            dbNext = 0;
                            envelopeNext = 2;
                        }

                        if ((noteIndex === count - 1) ||
                                (envelopeNext === 2 && dbNext > db) ||
                                (envelopeNext === 1 && dbNext < db) ||
                                (envelopeNext === 1 && db < -21)) {
                            dbStart = db;
                            dbEnd = -40;
                        } else if (envelopeNext === 1) {
                            dbStart = db;
                            dbEnd = -25;
                            crescendoLinked = 1;
                        } else {
                            dbStart = db;
                            dbEnd = dbNext;
                            crescendoLinked = 1;
                        }
                    }
                }

                output.push([dbStart, dbEnd]);
                absoluteIndex += 1;
                if (type === 1) {
                    linkedEnvelopeIndex += 1;
                }
            }
            if (type === 2) {
                chordEnvelopeIndex += 1;
            }
        }
        return output;
    }

    I.dbEnvelopePart1 = dbEnvelopePart1;
    I.dbEnvelopePart2 = dbEnvelopePart2;
    I.dbTablePart4 = dbTablePart4;
    I.dbEnvelopePart4 = dbEnvelopePart4;
    I.applyCorrections = applyCorrections;
    I.dbEnvelopesPart5 = dbEnvelopesPart5;
}(Studie2EventsInternals));
if (typeof module !== "undefined" && module.exports) { module.exports = Studie2EventsInternals; }
