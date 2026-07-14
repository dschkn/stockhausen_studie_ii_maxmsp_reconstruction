/* Internal parameter, duration and start-time procedures for Studie II. */
var Studie2EventsInternals = (typeof Studie2EventsInternals !== "undefined") ? Studie2EventsInternals : {};
(function (I) {
    "use strict";
    function clone(values) {
        return values.slice(0);
    }

    function append3(a, b, c) {
        return a.concat(b).concat(c);
    }

    function sameArray(a, b) {
        var i;
        if (!a || !b || a.length !== b.length) {
            return false;
        }
        for (i = 0; i < a.length; i++) {
            if (Number(a[i]) !== Number(b[i])) {
                return false;
            }
        }
        return true;
    }

    function parameterIndex(group, column, position) {
        return ((group - 1) * 5) + (column * (position - 1));
    }

    function getValue(base, group, transposition, column, position) {
        var transposedGroup = group + transposition - 1;
        return base[parameterIndex(transposedGroup, column, position)];
    }

    function getFrequencies(base, group, transposition, column, position) {
        var transposedGroup = group + transposition - 1;
        var index = parameterIndex(transposedGroup, column, position);
        return [
            base[index],
            base[index + column],
            base[index + (2 * column)],
            base[index + (3 * column)],
            base[index + (4 * column)]
        ];
    }

    function makeParameterMethod1(base, counts, groups, transposition, columns, pos1, pos2, pos3, frequencies) {
        var positions = append3(pos1, pos2, pos3);
        var output = [];
        var sequenceIndex;
        var noteIndex;
        var absoluteNote = 0;
        var count;
        var group;
        var column;
        var position;

        for (sequenceIndex = 0; sequenceIndex < counts.length; sequenceIndex++) {
            count = counts[sequenceIndex];
            group = groups[sequenceIndex];
            column = columns[sequenceIndex];
            for (noteIndex = 0; noteIndex < count; noteIndex++) {
                position = positions[absoluteNote];
                if (frequencies) {
                    output.push(getFrequencies(base, group, transposition, column, position));
                } else {
                    output.push(getValue(base, group, transposition, column, position));
                }
                absoluteNote += 1;
            }
        }
        return output;
    }

    function makeParameterMethod2(base, counts, transpositions, columns, pos1, pos2, pos3, frequencies) {
        var positions = append3(pos1, pos2, pos3);
        var output = [];
        var sequenceIndex;
        var noteIndex;
        var absoluteNote = 0;
        var count;
        var column;
        var transposition;
        var position;
        var group;

        for (sequenceIndex = 0; sequenceIndex < counts.length; sequenceIndex++) {
            count = counts[sequenceIndex];
            column = columns[sequenceIndex];
            transposition = transpositions[sequenceIndex];
            for (noteIndex = 0; noteIndex < count; noteIndex++) {
                position = positions[absoluteNote];
                group = position;
                if (frequencies) {
                    output.push(getFrequencies(base, group, transposition, column, position));
                } else {
                    output.push(getValue(base, group, transposition, column, position));
                }
                absoluteNote += 1;
            }
        }
        return output;
    }

    function makeFrequenciesPart5(base, counts, transpositions, columns, pos1, pos2, pos3, replacementsA, replacementsB) {
        var positions = append3(pos1, pos2, pos3);
        var output = [];
        var setIndex;
        var sequenceInSet;
        var sequenceIndex;
        var noteIndex;
        var absoluteNote = 0;
        var count;
        var column;
        var transposition;
        var position;
        var group;
        var replacementA;
        var replacementB;

        for (setIndex = 0; setIndex < 5; setIndex++) {
            replacementA = replacementsA[setIndex];
            replacementB = replacementsB[setIndex];
            for (sequenceInSet = 0; sequenceInSet < 5; sequenceInSet++) {
                sequenceIndex = (setIndex * 5) + sequenceInSet;
                count = counts[sequenceIndex];
                column = (setIndex === 4 && sequenceInSet === 4) ? 3 : columns[sequenceIndex];
                transposition = transpositions[sequenceIndex];
                for (noteIndex = 0; noteIndex < count; noteIndex++) {
                    position = positions[absoluteNote];
                    if ((sequenceInSet + 1) === replacementA || (sequenceInSet + 1) === replacementB) {
                        group = 2;
                    } else {
                        group = position;
                    }
                    output.push(getFrequencies(base, group, transposition, column, position));
                    absoluteNote += 1;
                }
            }
        }
        return output;
    }

    function startsBySequences(baseDurations, counts, groups, transposition, columns, pos1, pos2, pos3, startAbsolute) {
        var positions = append3(pos1, pos2, pos3);
        var output = [startAbsolute];
        var sequenceIndex;
        var noteIndex;
        var absoluteNote = 0;
        var durationSum;
        var duration;
        var count;
        var group;
        var column;
        var position;

        for (sequenceIndex = 0; sequenceIndex < counts.length; sequenceIndex++) {
            count = counts[sequenceIndex];
            group = groups[sequenceIndex];
            column = columns[sequenceIndex];
            durationSum = 0;
            for (noteIndex = 0; noteIndex < count; noteIndex++) {
                position = positions[absoluteNote];
                duration = getValue(baseDurations, group, transposition, column, position);
                durationSum += duration;
                absoluteNote += 1;
            }
            startAbsolute += durationSum;
            output.push(startAbsolute);
        }
        return output;
    }

    function startsPart3(baseDurations, counts, groups, transposition, columns, pos1, pos2, pos3, startAbsolute) {
        var positions = append3(pos1, pos2, pos3);
        var output = [startAbsolute];
        var sequenceIndex;
        var noteIndex;
        var absoluteNote = 0;
        var duration;
        var count;
        var group;
        var column;
        var position;

        for (sequenceIndex = 0; sequenceIndex < counts.length; sequenceIndex++) {
            count = counts[sequenceIndex];
            group = groups[sequenceIndex];
            column = columns[sequenceIndex];
            for (noteIndex = 0; noteIndex < count; noteIndex++) {
                position = positions[absoluteNote];
                duration = getValue(baseDurations, group, transposition, column, position);
                startAbsolute += duration;
                output.push(startAbsolute);
                absoluteNote += 1;
            }
        }
        return output;
    }

    function maximaByGroups(values, counts) {
        var output = [];
        var absoluteIndex = 0;
        var sequenceIndex;
        var noteIndex;
        var count;
        var maximum;

        for (sequenceIndex = 0; sequenceIndex < counts.length; sequenceIndex++) {
            count = counts[sequenceIndex];
            maximum = values[absoluteIndex];
            for (noteIndex = 0; noteIndex < count; noteIndex++) {
                if (values[absoluteIndex] > maximum) {
                    maximum = values[absoluteIndex];
                }
                absoluteIndex += 1;
            }
            output.push(maximum);
        }
        return output;
    }

    function durationsPart2(normalDurations, counts, envelopes) {
        var output = new Array(normalDurations.length);
        var sequenceIndex;
        var noteIndex;
        var absoluteIndex = 0;
        var sequenceStart;
        var count;
        var envelope;
        var accumulated;
        var backwardIndex;
        var normal;

        for (sequenceIndex = 0; sequenceIndex < counts.length; sequenceIndex++) {
            count = counts[sequenceIndex];
            envelope = envelopes[sequenceIndex];
            accumulated = 0;
            sequenceStart = absoluteIndex;
            for (noteIndex = 0; noteIndex < count; noteIndex++) {
                if (envelope === 1 || envelope === 2) {
                    normal = normalDurations[absoluteIndex];
                    accumulated += normal;
                    output[absoluteIndex] = accumulated;
                } else {
                    backwardIndex = sequenceStart + count - noteIndex - 1;
                    normal = normalDurations[backwardIndex];
                    accumulated += normal;
                    output[backwardIndex] = accumulated;
                }
                absoluteIndex += 1;
            }
        }
        return output;
    }

    function durationsPart4(normalDurations, counts, envelopes) {
        var output = new Array(normalDurations.length);
        var sequenceIndex;
        var noteIndex;
        var absoluteIndex = 0;
        var sequenceStart;
        var count;
        var envelope;
        var accumulated;
        var backwardIndex;
        var normal;

        for (sequenceIndex = 0; sequenceIndex < counts.length; sequenceIndex++) {
            count = counts[sequenceIndex];
            envelope = envelopes[sequenceIndex];
            accumulated = 0;
            sequenceStart = absoluteIndex;
            for (noteIndex = 0; noteIndex < count; noteIndex++) {
                if (envelope === 1 || envelope === 2 || envelope === 5) {
                    normal = normalDurations[absoluteIndex];
                    accumulated += normal;
                    output[absoluteIndex] = accumulated;
                } else {
                    backwardIndex = sequenceStart + count - noteIndex - 1;
                    normal = normalDurations[backwardIndex];
                    accumulated += normal;
                    output[backwardIndex] = accumulated;
                }
                absoluteIndex += 1;
            }
        }
        return output;
    }

    function durationsPart5(normalDurations, types, counts, chordEnvelopes) {
        var output = new Array(normalDurations.length);
        var sequenceIndex;
        var noteIndex;
        var absoluteIndex = 0;
        var sequenceStart;
        var envelopeIndex = 0;
        var count;
        var type;
        var envelope;
        var accumulated;
        var backwardIndex;
        var normal;

        for (sequenceIndex = 0; sequenceIndex < counts.length; sequenceIndex++) {
            count = counts[sequenceIndex];
            type = types[sequenceIndex];
            accumulated = 0;
            sequenceStart = absoluteIndex;
            if (type === 2) {
                envelope = chordEnvelopes[envelopeIndex];
            }
            for (noteIndex = 0; noteIndex < count; noteIndex++) {
                if (type === 2) {
                    if (envelope === 1 || envelope === 2 || envelope === 5) {
                        normal = normalDurations[absoluteIndex];
                        accumulated += normal;
                        output[absoluteIndex] = accumulated;
                    } else {
                        backwardIndex = sequenceStart + count - noteIndex - 1;
                        normal = normalDurations[backwardIndex];
                        accumulated += normal;
                        output[backwardIndex] = accumulated;
                    }
                } else {
                    output[absoluteIndex] = normalDurations[absoluteIndex];
                }
                absoluteIndex += 1;
            }
            if (type === 2) {
                envelopeIndex += 1;
            }
        }
        return output;
    }

    function startsPart5(startDifferences, counts, types, durations, chordEnvelopes, startAbsolute) {
        var output = new Array(startDifferences.length + 1);
        var maxima = maximaByGroups(durations, counts);
        var sequenceIndex;
        var noteIndex;
        var absoluteIndex = 0;
        var envelopeIndex = 0;
        var count;
        var type;
        var sequenceStart;
        var durationShift;
        var maximumDuration;
        var difference;
        var envelope;
        var startValue;

        output[0] = startAbsolute;

        for (sequenceIndex = 0; sequenceIndex < counts.length; sequenceIndex++) {
            count = counts[sequenceIndex];
            type = types[sequenceIndex];
            sequenceStart = startAbsolute;
            durationShift = 0;
            maximumDuration = maxima[sequenceIndex];
            if (type === 2) {
                envelope = chordEnvelopes[envelopeIndex];
            }

            for (noteIndex = 0; noteIndex < count; noteIndex++) {
                difference = startDifferences[absoluteIndex];
                startAbsolute += difference;

                if (type === 1 && noteIndex < count - 1) {
                    durationShift += durations[absoluteIndex];
                    output[absoluteIndex + 1] = sequenceStart + durationShift;
                } else if (type === 2) {
                    if ((envelope === 1 || envelope === 2 || envelope === 5) && noteIndex < count - 1) {
                        startValue = sequenceStart;
                    } else {
                        startValue = sequenceStart + (maximumDuration - durations[absoluteIndex]);
                    }
                    output[absoluteIndex] = startValue;
                    output[absoluteIndex + 1] = startAbsolute;
                } else {
                    output[absoluteIndex + 1] = startAbsolute;
                }
                absoluteIndex += 1;
            }

            if (type === 2) {
                envelopeIndex += 1;
            }
        }
        return output;
    }

    I.clone = clone;
    I.append3 = append3;
    I.sameArray = sameArray;
    I.parameterIndex = parameterIndex;
    I.getValue = getValue;
    I.getFrequencies = getFrequencies;
    I.makeParameterMethod1 = makeParameterMethod1;
    I.makeParameterMethod2 = makeParameterMethod2;
    I.makeFrequenciesPart5 = makeFrequenciesPart5;
    I.startsBySequences = startsBySequences;
    I.startsPart3 = startsPart3;
    I.maximaByGroups = maximaByGroups;
    I.durationsPart2 = durationsPart2;
    I.durationsPart4 = durationsPart4;
    I.durationsPart5 = durationsPart5;
    I.startsPart5 = startsPart5;
}(Studie2EventsInternals));
if (typeof module !== "undefined" && module.exports) { module.exports = Studie2EventsInternals; }
