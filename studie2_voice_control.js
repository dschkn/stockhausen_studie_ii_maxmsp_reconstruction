/*
    studie2_voice_control.js
    Per-voice control helper for StudieII_Voice.maxpat.

    Input messages:
      note f1 f2 f3 f4 f5 durationMs dbStart dbEnd pan eventId
      stop

    Outlets 0..4: oscillator frequencies
    Outlet 5: main amplitude line~ messages
    Outlet 6: short click-guard line~ messages
    Outlet 7: pan position 0..1

    The synthesis itself stays visibly in Max/MSP: five cycle~ objects,
    two line~ objects, summing, panning and output are all in the patch.
*/
autowatch = 1;
inlets = 1;
outlets = 8;

var guardTask = new Task(closeGuard, this);

function dbToAmp(db) {
    return Math.pow(10, Number(db) / 20);
}

function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
}

function note() {
    var args = arrayfromargs(arguments);
    var durationMs;
    var startAmp;
    var endAmp;
    var pan;
    var i;

    if (args.length < 10) {
        post("StudieII_Voice: expected 10 note arguments, got " + args.length + "\n");
        return;
    }

    guardTask.cancel();

    durationMs = Math.max(2, Number(args[5]));
    startAmp = dbToAmp(args[6]);
    endAmp = dbToAmp(args[7]);
    pan = clamp(Number(args[8]), 0, 1);

    /* Set all five cycle~ frequencies. */
    for (i = 0; i < 5; i++) {
        outlet(i, Number(args[i]));
    }

    outlet(7, pan);

    /* Main linear amplitude trajectory in amplitude units. */
    outlet(5, startAmp);
    outlet(5, endAmp, durationMs);

    /* Five-millisecond edge guard. It does not replace the composed envelope. */
    outlet(6, 0.0);
    outlet(6, 1.0, Math.min(5, durationMs * 0.25));
    guardTask.schedule(Math.max(1, durationMs - 5));
}

function closeGuard() {
    outlet(6, 0.0, 5.0);
}

function stop() {
    guardTask.cancel();
    outlet(5, 0.0, 10.0);
    outlet(6, 0.0, 10.0);
}
