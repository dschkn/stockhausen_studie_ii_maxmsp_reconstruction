/* Public Studie II event generator assembled from readable internal modules. */
if (typeof include === "function") {
    include("studie2_events_parameters.js");
    include("studie2_events_envelopes.js");
    include("studie2_events_emit.js");
}
var Studie2EventsInternals = (typeof Studie2EventsInternals !== "undefined") ? Studie2EventsInternals : ((typeof module !== "undefined" && module.exports) ? require("./studie2_events_emit.js") : {});
var Studie2Events = (function (I) {
    "use strict";
    var TAPE_SPEED = 76.2;
    var ORIGINAL_SEED = [3, 5, 1, 4, 2];
    var clone = I.clone;
    var sameArray = I.sameArray;
    var makeParameterMethod1 = I.makeParameterMethod1;
    var makeParameterMethod2 = I.makeParameterMethod2;
    var makeFrequenciesPart5 = I.makeFrequenciesPart5;
    var startsBySequences = I.startsBySequences;
    var startsPart3 = I.startsPart3;
    var durationsPart2 = I.durationsPart2;
    var durationsPart4 = I.durationsPart4;
    var durationsPart5 = I.durationsPart5;
    var startsPart5 = I.startsPart5;
    var dbTablePart4 = I.dbTablePart4;
    var applyCorrections = I.applyCorrections;
    var dbEnvelopesPart5 = I.dbEnvelopesPart5;
    var pushPart1 = I.pushPart1;
    var pushPart2 = I.pushPart2;
    var pushPart3 = I.pushPart3;
    var pushPart4 = I.pushPart4;
    var pushPart5 = I.pushPart5;
    var pushCoda = I.pushCoda;
    var assignIds = I.assignIds;
    function generate(seriesData, material, options) {
        var opts = options || {};
        var seed = seriesData.seed;
        var s = seriesData.squares;
        var frequenciesBase = material.frequencies;
        var durationsBase = material.durationsCm;
        var intensitiesBase = material.intensitiesDb;
        var historicalCorrections = (typeof opts.historicalCorrections === "boolean") ? opts.historicalCorrections : sameArray(seed, ORIGINAL_SEED);
        var events = [];

        var env1 = [
            2,1,1,2,2,1,2,2,2,1,2,2,2,1,2,
            2,1,1,2,2,2,1,2,1,2,2,1,2,1,2,
            1,2,1,2,2,1,2,2,2,2,1,2,2,2,1,
            2,2,2,2,1,2,2,1,2,2,1,2,2,1,2,
            1,2,2,2,1,2,1,2,2,2,1,2,1,2,2
        ];
        var env2 = [
            1,2,4,3,5,
            1,4,3,5,2,
            1,4,5,2,3,
            4,3,1,5,2,
            3,1,4,5,2
        ];
        var env4 = [
            2,5,4,3,1,
            2,1,5,4,3,
            2,3,1,4,5,
            2,5,1,3,4,
            2,3,5,1,4
        ];
        var eventTypes5 = [
            3,1,2,1,2,
            2,3,2,1,1,
            2,3,1,2,1,
            2,2,3,1,1,
            2,2,1,1,3
        ];
        var env5Type1 = [
            2,
            1,2,2,1,2,
            2,2,1,2,
            2,
            1,2,1,
            1,2,
            1,2,2,1,
            2,1,2,
            2,2,2,2,2,
            1,2
        ];
        var env5Type2 = [5,6,3,2,1,4,2,3,2,3];
        var replacementsA = [1,4,2,5,3];
        var replacementsB = [2,2,5,3,5];
        var dbCorrections5 = [
            0,-22,1,-18,2,-17,3,-15,
            6,-18,
            7,-26,8,-27,9,-30,10,-29,11,-28,
            12,-21,13,-18,
            19,-30,
            21,-22,22,-29,23,-18,
            25,-4,
            31,-12,32,-13,33,-17,34,-4,
            36,-21,38,-10,
            39,-30,40,-29,41,-27,
            46,-23,
            47,-15,
            48,-24,50,-13,
            53,-21,54,-9,55,-21,56,-13,
            59,-7,
            61,-14,62,-11,63,-7,64,-5,
            66,-11,67,-13,68,-18,69,-21,
            70,-29,71,-23,
            73,-19
        ];

        var start1 = 0;
        var counts1 = s.R5;
        var freqs1 = makeParameterMethod1(frequenciesBase, counts1, s.R1, 3, s.R2, s.R1, s.R2, s.R3, true);
        var durs1 = makeParameterMethod1(durationsBase, counts1, s.R3, 1, s.R4, s.R3, s.R4, s.R5, false);
        var db1 = makeParameterMethod1(intensitiesBase, counts1, s.R2, 5, s.R3, s.R2, s.R3, s.R4, false);
        var starts1 = startsBySequences(durationsBase, counts1, s.R4, 1, s.U5, s.R4, s.R5, s.R1, start1);
        pushPart1(events, starts1, counts1, freqs1, durs1, db1, env1);

        var start2 = starts1[starts1.length - 1];
        var counts2 = s.R1;
        var freqs2 = makeParameterMethod1(frequenciesBase, counts2, s.R2, 5, s.R3, s.R4, s.R5, s.R1, true);
        var durs2Normal = makeParameterMethod1(durationsBase, counts2, s.R4, 3, s.R5, s.R1, s.R2, s.R3, false);
        var durs2 = durationsPart2(durs2Normal, counts2, env2);
        var db2 = makeParameterMethod1(intensitiesBase, counts2, s.R3, 2, s.R4, s.R5, s.R1, s.R2, false);
        var starts2 = startsBySequences(durationsBase, counts2, s.R5, 3, s.U1, s.R2, s.R3, s.R4, start2);
        pushPart2(events, starts2, counts2, freqs2, durs2, db2, env2);

        var start3 = starts2[starts2.length - 1];
        var counts3 = s.R2;
        var freqs3 = makeParameterMethod2(frequenciesBase, counts3, s.R3, s.R4, s.R2, s.R3, s.R4, true);
        var durs3 = makeParameterMethod1(durationsBase, counts3, s.R5, 4, s.R1, s.R4, s.R5, s.R1, false);
        var db3 = makeParameterMethod2(intensitiesBase, counts3, s.R4, s.R5, s.R4, s.R5, s.R1, false);
        var starts3 = startsPart3(durationsBase, counts3, s.R1, 4, s.U2, s.R5, s.R1, s.R2, start3);
        pushPart3(events, starts3, counts3, freqs3, durs3, db3);

        var start4 = starts3[starts3.length - 1];
        var counts4 = s.R3;
        var freqs4 = makeParameterMethod2(frequenciesBase, counts4, s.R4, s.R5, s.R5, s.R1, s.R2, true);
        var durs4Normal = makeParameterMethod1(durationsBase, counts4, s.R1, 2, s.R2, s.R2, s.R3, s.R4, false);
        var durs4 = durationsPart4(durs4Normal, counts4, env4);
        var db4 = dbTablePart4(intensitiesBase, counts4, s.R5, 1, s.R1, s.R1, s.R2, s.R3, env4);
        var starts4 = startsBySequences(durationsBase, counts4, s.R2, 2, s.U3, s.R3, s.R4, s.R5, start4);
        pushPart4(events, starts4, counts4, freqs4, durs4, db4, env4);

        var start5 = starts4[starts4.length - 1];
        var counts5 = s.R4;
        var freqs5 = makeFrequenciesPart5(frequenciesBase, counts5, s.R5, s.R1, s.R3, s.R4, s.R5, replacementsA, replacementsB);
        var durs5Normal = makeParameterMethod2(durationsBase, counts5, s.R2, s.R3, s.R5, s.R1, s.R2, false);
        var durs5 = durationsPart5(durs5Normal, eventTypes5, counts5, env5Type2);
        var starts5Differences = makeParameterMethod2(durationsBase, counts5, s.R3, s.U4, s.R1, s.R2, s.R3, false);
        var starts5 = startsPart5(starts5Differences, counts5, eventTypes5, durs5, env5Type2, start5);
        var db5Base = makeParameterMethod2(intensitiesBase, counts5, s.R1, s.R2, s.R4, s.R5, s.R1, false);
        var db5Corrected = historicalCorrections ? applyCorrections(db5Base, dbCorrections5) : db5Base;
        var dbPairs5 = dbEnvelopesPart5(db5Corrected, counts5, eventTypes5, env5Type1, env5Type2, durs5);
        pushPart5(events, starts5, counts5, eventTypes5, freqs5, durs5, dbPairs5);

        var startCoda = starts5[starts5.length - 1];
        var endCm = pushCoda(events, startCoda, seed, durationsBase, frequenciesBase, intensitiesBase);
        var sortedEvents = assignIds(events);

        return {
            seed: clone(seed),
            mode: historicalCorrections ? "historical-score-corrections" : "strict-serial-variation",
            events: sortedEvents,
            eventCount: sortedEvents.length,
            partEventCounts: [75, 75, 75, 75, 75, 5],
            totalDurationCm: endCm,
            totalDurationSec: endCm / TAPE_SPEED,
            assumptions: [
                "Envelope lists for parts 1, 2, 4 and 5 are score-derived templates.",
                "Part 5 event-type and frequency-replacement patterns are retained from Stockhausen's score.",
                historicalCorrections ? "Part 5 score-specific dB corrections are enabled." : "Part 5 score-specific dB corrections are disabled."
            ]
        };
    }

    return {
        ORIGINAL_SEED: clone(ORIGINAL_SEED),
        TAPE_SPEED: TAPE_SPEED,
        generate: generate,
        helpers: {
            parameterIndex: I.parameterIndex,
            getValue: I.getValue,
            getFrequencies: I.getFrequencies,
            makeParameterMethod1: I.makeParameterMethod1,
            makeParameterMethod2: I.makeParameterMethod2,
            maximaByGroups: I.maximaByGroups
        }
    };
}(Studie2EventsInternals));
if (typeof module !== "undefined" && module.exports) { module.exports = Studie2Events; }
