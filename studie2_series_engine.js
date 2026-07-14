/* Max wrapper for studie2_series_core.js */
autowatch = 1;
inlets = 1;
outlets = 12;

include("studie2_series_core.js");

var currentSeed = [3, 5, 1, 4, 2];

function bang() {
    generate(currentSeed);
}

function list() {
    var input = arrayfromargs(arguments);
    generate(input);
}

function stockhausen() {
    generate([3, 5, 1, 4, 2]);
}

function random() {
    generate(Studie2Series.randomSeed());
}

function generate(values) {
    var result;
    var i;
    var name;
    var square;
    var row;
    var column;

    try {
        result = Studie2Series.generate(values);
    } catch (error) {
        outlet(11, "error", error.message);
        post("Studie II series error: " + error.message + "\n");
        return;
    }

    currentSeed = result.seed.slice(0);

    for (i = 0; i < result.names.length; i++) {
        name = result.names[i];
        square = result.squares[name];
        outlet(i, "clear", "all");
        for (row = 0; row < 5; row++) {
            for (column = 0; column < 5; column++) {
                outlet(i, "set", column, row, square[(row * 5) + column]);
            }
        }
        outlet(10, ["square", name].concat(square));
    }

    outlet(10, ["seed"].concat(result.seed));
    outlet(10, "series_done");
    outlet(11, ["seed"].concat(result.seed));
    outlet(11, "status", "Ten number squares generated");
}
