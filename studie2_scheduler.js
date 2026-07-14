/*
    studie2_scheduler.js
    Lightweight event scheduler and voice allocator for poly~ StudieII_Voice.

    Inlet 0: event stream from studie2_event_engine.js
    Inlet 1: play, stop, timescale <float>, voices <int>

    Outlet 0: target/note messages for poly~
    Outlet 1: current-event status
    Outlet 2: progress 0..1 and transport status
*/
autowatch = 1;
inlets = 2;
outlets = 3;

var events = [];
var totalDurationSec = 0;
var timeScale = 1.0;
var voiceCount = 16;
var voiceFreeAt = [];
var nextIndex = 0;
var startWallMs = 0;
var running = false;
var task = new Task(tick, this);

initializeVoices();

function bang() {
    if (inlet === 1) {
        play();
    }
}

function anything() {
    var args = arrayfromargs(arguments);
    var name = messagename;

    if (inlet === 0) {
        handleEventStream(name, args);
    } else {
        handleControl(name, args);
    }
}

function handleEventStream(name, args) {
    if (name === "clear") {
        stop();
        events = [];
        totalDurationSec = 0;
        outlet(2, "loaded", 0);
    } else if (name === "event") {
        events.push({
            id: Number(args[0]),
            part: Number(args[1]),
            set: Number(args[2]),
            sequence: Number(args[3]),
            note: Number(args[4]),
            type: Number(args[5]),
            startSec: Number(args[6]),
            durationSec: Number(args[7]),
            frequencies: [Number(args[8]), Number(args[9]), Number(args[10]), Number(args[11]), Number(args[12])],
            dbStart: Number(args[13]),
            dbEnd: Number(args[14]),
            pan: Number(args[15])
        });
    } else if (name === "events_done") {
        totalDurationSec = Number(args[0]);
        events.sort(function (a, b) {
            if (a.startSec !== b.startSec) {
                return a.startSec - b.startSec;
            }
            return a.id - b.id;
        });
        outlet(2, "loaded", events.length, totalDurationSec, args[2]);
    }
}

function handleControl(name, args) {
    if (name === "play") {
        play();
    } else if (name === "stop") {
        stop();
    } else if (name === "timescale") {
        setTimeScale(args[0]);
    } else if (name === "voices") {
        setVoiceCount(args[0]);
    }
}

function msg_float(value) {
    if (inlet === 1) {
        setTimeScale(value);
    }
}

function msg_int(value) {
    if (inlet === 1) {
        setTimeScale(value);
    }
}

function setTimeScale(value) {
    var parsed = Number(value);
    if (!isFinite(parsed) || parsed <= 0) {
        parsed = 1;
    }
    timeScale = parsed;
    outlet(2, "timescale", timeScale);
}

function setVoiceCount(value) {
    var parsed = Math.max(1, Math.floor(Number(value)));
    voiceCount = parsed;
    initializeVoices();
    outlet(2, "voices", voiceCount);
}

function initializeVoices() {
    var i;
    voiceFreeAt = [];
    for (i = 0; i < voiceCount; i++) {
        voiceFreeAt.push(0);
    }
}

function play() {
    if (!events.length) {
        outlet(2, "error", "No events loaded");
        return;
    }
    stopVoices();
    initializeVoices();
    nextIndex = 0;
    startWallMs = Date.now();
    running = true;
    outlet(2, "playing", 1);
    task.schedule(0);
}

function stop() {
    task.cancel();
    if (running) {
        stopVoices();
    }
    running = false;
    nextIndex = 0;
    outlet(2, "playing", 0);
    outlet(2, "progress", 0);
}

function stopVoices() {
    outlet(0, "target", 0);
    outlet(0, "list", "stop");
}

function elapsedRealSec() {
    return (Date.now() - startWallMs) / 1000;
}

function chooseVoice(startReal, endReal) {
    var i;
    var selected = -1;
    var earliestIndex = 0;
    var earliestTime = voiceFreeAt[0];

    for (i = 0; i < voiceFreeAt.length; i++) {
        if (voiceFreeAt[i] <= startReal + 0.001) {
            selected = i;
            break;
        }
        if (voiceFreeAt[i] < earliestTime) {
            earliestTime = voiceFreeAt[i];
            earliestIndex = i;
        }
    }

    if (selected < 0) {
        selected = earliestIndex;
        outlet(2, "voice_steal", selected + 1);
    }
    voiceFreeAt[selected] = endReal + 0.03;
    return selected + 1;
}

function dispatch(event) {
    var startReal = event.startSec * timeScale;
    var durationRealSec = event.durationSec * timeScale;
    var durationMs = Math.max(2, durationRealSec * 1000);
    var voice = chooseVoice(startReal, startReal + durationRealSec);

    outlet(0, "target", voice);
    /* Prefix with selector list so poly~ forwards the word note to the targeted voice
       instead of invoking its own MIDI-style voice allocator. */
    outlet(0, "list", "note",
        event.frequencies[0], event.frequencies[1], event.frequencies[2], event.frequencies[3], event.frequencies[4],
        durationMs, event.dbStart, event.dbEnd, event.pan, event.id);

    outlet(1, "event", event.id, event.part, event.set, event.sequence, event.note,
        event.startSec, event.durationSec, event.frequencies[0], event.frequencies[4], event.dbStart, event.dbEnd);
}

function tick() {
    var elapsed;
    var nextStart;
    var delayMs;
    var progress;

    if (!running) {
        return;
    }

    elapsed = elapsedRealSec();

    while (nextIndex < events.length && (events[nextIndex].startSec * timeScale) <= elapsed + 0.002) {
        dispatch(events[nextIndex]);
        nextIndex += 1;
    }

    progress = totalDurationSec > 0 ? elapsed / (totalDurationSec * timeScale) : 0;
    if (progress > 1) {
        progress = 1;
    }
    outlet(2, "progress", progress);

    if (nextIndex >= events.length) {
        if (elapsed >= (totalDurationSec * timeScale) + 0.1) {
            running = false;
            outlet(2, "playing", 0);
            outlet(2, "progress", 1);
            return;
        }
        task.schedule(20);
        return;
    }

    nextStart = events[nextIndex].startSec * timeScale;
    delayMs = Math.max(0, (nextStart - elapsed) * 1000);
    task.schedule(Math.min(delayMs, 100));
}
