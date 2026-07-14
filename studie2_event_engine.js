/*
    Max wrapper for studie2_events_core.js.
    Inlet 0: series messages from studie2_series_engine.js
    Inlet 1: material messages from studie2_material_engine.js
    Inlet 2: bang / generate <0|1> (historical corrections off/on)
*/
autowatch = 1;
inlets = 3;
outlets = 4;

include("studie2_events_core.js");

var seriesData = {
    seed: [3, 5, 1, 4, 2],
    squares: {}
};
var material = {
    frequencies: [],
    durationsCm: [],
    intensitiesDb: []
};
var seriesReady = false;
var materialReady = false;
var historicalCorrections = 1;
var lastResult = null;

function bang() {
    if (inlet === 2) {
        generateEvents();
    }
}

function msg_int(value) {
    if (inlet === 2) {
        historicalCorrections = value ? 1 : 0;
        outlet(2, "corrections", historicalCorrections);
    }
}

function generate(value) {
    if (inlet === 2 && arguments.length > 0) {
        historicalCorrections = Number(value) ? 1 : 0;
    }
    generateEvents();
}

function anything() {
    var args = arrayfromargs(arguments);
    var name = messagename;

    if (inlet === 0) {
        handleSeries(name, args);
    } else if (inlet === 1) {
        handleMaterial(name, args);
    } else if (inlet === 2) {
        if (name === "historical") {
            historicalCorrections = 1;
            generateEvents();
        } else if (name === "strict") {
            historicalCorrections = 0;
            generateEvents();
        }
    }
}

function handleSeries(name, args) {
    if (name === "square") {
        seriesData.squares[String(args[0])] = args.slice(1);
    } else if (name === "seed") {
        seriesData.seed = args.slice(0);
    } else if (name === "series_done") {
        seriesReady = true;
        outlet(2, "series_ready", 1);
        maybeAutoGenerate();
    }
}

function handleMaterial(name, args) {
    if (name === "frequencies") {
        material.frequencies = args.slice(0);
    } else if (name === "durations_cm") {
        material.durationsCm = args.slice(0);
    } else if (name === "intensities_db") {
        material.intensitiesDb = args.slice(0);
    } else if (name === "material_done") {
        materialReady = true;
        outlet(2, "material_ready", 1);
        maybeAutoGenerate();
    }
}

function maybeAutoGenerate() {
    if (seriesReady && materialReady) {
        generateEvents();
    }
}

function generateEvents() {
    var result;
    var i;
    var event;
    var list;

    if (!seriesReady || !materialReady) {
        outlet(2, "error", "Series and material must be generated first");
        post("Studie II: series and material must be generated first.\n");
        return;
    }

    try {
        result = Studie2Events.generate(seriesData, material, {
            historicalCorrections: historicalCorrections === 1
        });
    } catch (error) {
        outlet(2, "error", error.message);
        post("Studie II event generation error: " + error.message + "\n");
        return;
    }

    lastResult = result;
    outlet(0, "clear");
    outlet(1, "clear");
    outlet(3, "clear", "all");
    outlet(3, "rows", result.events.length);

    for (i = 0; i < result.events.length; i++) {
        event = result.events[i];
        list = [
            "event",
            event.id,
            event.part,
            event.set,
            event.sequence,
            event.note,
            event.type,
            event.startSec,
            event.durationSec,
            event.frequencies[0],
            event.frequencies[1],
            event.frequencies[2],
            event.frequencies[3],
            event.frequencies[4],
            event.dbStart,
            event.dbEnd,
            event.pan
        ];
        outlet(0, list);
        outlet(1, list.slice(1));
        writePreviewRow(i, event);
    }

    outlet(0, "events_done", result.totalDurationSec, result.eventCount, result.mode);
    outlet(2, "events", result.eventCount);
    outlet(2, "duration", result.totalDurationSec);
    outlet(2, "mode", result.mode);
    outlet(2, "status", "Event generation complete");
}

function writePreviewRow(row, event) {
    outlet(3, "set", 0, row, event.id);
    outlet(3, "set", 1, row, event.part);
    outlet(3, "set", 2, row, event.set);
    outlet(3, "set", 3, row, event.sequence);
    outlet(3, "set", 4, row, event.note);
    outlet(3, "set", 5, row, Number(event.startSec.toFixed(3)));
    outlet(3, "set", 6, row, Number(event.durationSec.toFixed(3)));
    outlet(3, "set", 7, row, Number(event.frequencies[0].toFixed(1)));
    outlet(3, "set", 8, row, Number(event.frequencies[4].toFixed(1)));
    outlet(3, "set", 9, row, Number(event.dbStart.toFixed(1)));
    outlet(3, "set", 10, row, Number(event.dbEnd.toFixed(1)));
}
