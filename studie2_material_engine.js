/* Max wrapper for studie2_material_core.js */
autowatch = 1;
inlets = 1;
outlets = 5;

include("studie2_material_core.js");

function bang() {
    generate();
}

function generate() {
    var material = Studie2Material.generate();
    var i;

    outlet(0, material.frequencies);
    outlet(1, material.durationsCm);
    outlet(2, material.intensitiesDb);

    outlet(3, ["frequencies"].concat(material.frequencies));
    outlet(3, ["durations_cm"].concat(material.durationsCm));
    outlet(3, ["intensities_db"].concat(material.intensitiesDb));
    outlet(3, "material_done");

    for (i = 0; i < material.frequencies.length; i++) {
        outlet(4, "freq", i, material.frequencies[i]);
    }
    for (i = 0; i < material.durationsCm.length; i++) {
        outlet(4, "duration", i, material.durationsCm[i]);
    }
    for (i = 0; i < material.intensitiesDb.length; i++) {
        outlet(4, "intensity", i, material.intensitiesDb[i]);
    }
}
