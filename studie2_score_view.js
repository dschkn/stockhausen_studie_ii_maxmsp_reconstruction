/*
    studie2_score_view.js
    Draws the generated 380-event structure as score-like rectangles in jit.lcd.

    Input: the same clear / event / events_done stream sent to the scheduler.
    Output: drawing commands for jit.lcd.
*/
autowatch = 1;
inlets = 1;
outlets = 1;

var events = [];
var width = 800;
var height = 220;
var margin = 8;

function dimensions(w, h) {
    width = Math.max(100, Number(w));
    height = Math.max(80, Number(h));
    draw();
}

function anything() {
    var args = arrayfromargs(arguments);
    var name = messagename;
    if (name === "clear") {
        events = [];
        clearCanvas();
    } else if (name === "event") {
        events.push({
            id: Number(args[0]),
            part: Number(args[1]),
            start: Number(args[6]),
            duration: Number(args[7]),
            low: Number(args[8]),
            high: Number(args[12]),
            dbStart: Number(args[13]),
            dbEnd: Number(args[14])
        });
    } else if (name === "events_done") {
        draw();
    }
}

function bang() {
    draw();
}

function clearCanvas() {
    outlet(0, "brgb", 246, 246, 242);
    outlet(0, "clear");
    outlet(0, "bang");
}

function logPosition(frequency, minimum, maximum) {
    var f = Math.max(minimum, Math.min(maximum, frequency));
    return (Math.log(f) - Math.log(minimum)) / (Math.log(maximum) - Math.log(minimum));
}

function partColor(part, alphaScale) {
    var colors = [
        [35, 58, 82],
        [93, 72, 120],
        [154, 72, 59],
        [61, 113, 92],
        [166, 119, 41],
        [45, 45, 45]
    ];
    var c = colors[Math.max(0, Math.min(colors.length - 1, part - 1))];
    var scale = 0.55 + (0.45 * alphaScale);
    return [Math.floor(c[0] * scale), Math.floor(c[1] * scale), Math.floor(c[2] * scale)];
}

function draw() {
    var i;
    var event;
    var total = 0;
    var x1, x2, yTop, yBottom;
    var loudness;
    var color;
    var minimumFrequency = 100;
    var maximumFrequency = 17200;

    outlet(0, "brgb", 246, 246, 242);
    outlet(0, "clear");

    if (!events.length) {
        outlet(0, "frgb", 80, 80, 80);
        outlet(0, "moveto", 12, 20);
        outlet(0, "write", "Generate events to draw the score");
        outlet(0, "bang");
        return;
    }

    for (i = 0; i < events.length; i++) {
        total = Math.max(total, events[i].start + events[i].duration);
    }

    /* Five part separators plus coda area. */
    outlet(0, "frgb", 205, 205, 200);
    for (i = 1; i < 6; i++) {
        x1 = Math.floor(margin + ((width - 2 * margin) * i / 6));
        outlet(0, "linesegment", x1, margin, x1, height - margin);
    }

    for (i = 0; i < events.length; i++) {
        event = events[i];
        x1 = margin + ((width - 2 * margin) * event.start / total);
        x2 = margin + ((width - 2 * margin) * (event.start + event.duration) / total);
        yTop = margin + ((height - 2 * margin) * (1 - logPosition(event.high, minimumFrequency, maximumFrequency)));
        yBottom = margin + ((height - 2 * margin) * (1 - logPosition(event.low, minimumFrequency, maximumFrequency)));
        if (x2 < x1 + 1) { x2 = x1 + 1; }
        if (yBottom < yTop + 2) { yBottom = yTop + 2; }
        loudness = 1 - (Math.min(40, Math.abs(Math.max(event.dbStart, event.dbEnd))) / 40);
        color = partColor(event.part, loudness);
        outlet(0, "frgb", color[0], color[1], color[2]);
        outlet(0, "paintrect", Math.floor(x1), Math.floor(yTop), Math.ceil(x2), Math.ceil(yBottom));
    }

    outlet(0, "frgb", 30, 30, 30);
    outlet(0, "framerect", margin, margin, width - margin, height - margin);
    outlet(0, "bang");
}
