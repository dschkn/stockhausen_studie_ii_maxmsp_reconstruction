# Stockhausen Studie II — Max/MSP Reconstruction

An algorithmic reconstruction and generative extension of Karlheinz Stockhausen’s *Studie II* for Max/MSP.

*Studie II* was created in 1954 at the NWDR Studio for Electronic Music in Cologne, which later became part of WDR. During this period, Stockhausen was developing the principles of integral serialism and investigating how an electronic composition could be constructed from a unified numerical system.

Using the series `3 5 1 4 2`, he organized frequencies, durations, intensities, temporal relationships, and large-scale form. Based on available research literature and technical data, this project reconstructs these procedures in Max/MSP. In addition to the original series, the system can use any permutation of the numbers `1–5`, such as `1 5 4 2 3`, to produce new strict serial variations.

## Running the Project

1. Clone the repository and open `StudieII_Generator.maxpat`.
2. Enable DSP using the `ezdac~` button.
3. Click the `stockhausen` message to load the original series, or use the button next to `zl.scramble 1 2 3 4 5` to generate a random permutation.
4. Make sure that the table has been populated with 380 events and that the score-like visualization has appeared.
5. Click `play`.

The `timescale` field controls playback speed: `1.` corresponds to the calculated duration of the model, while larger values slow the piece down.

The output level is intentionally limited, although five sine oscillators combined with overlapping events can still provide a remarkably persuasive demonstration of acoustic physics.

## Modes

* **Original / historical corrections** — the original series `3 5 1 4 2` together with the fifth-section corrections derived from the reconstruction.
* **Random permutation / strict serial variation** — a new five-number series with recalculated `R1–R5` and `U1–U5`, without the element-specific corrections associated with the original score.

Historical corrections are disabled automatically when a random permutation is selected. Returning to `stockhausen` enables them again.

## Architecture

### Max/MSP

* `StudieII_Generator.maxpat` — main interface, event management, transport, visualization, and audio signal path;
* `StudieII_SquareDisplay.maxpat` — a separate panel displaying the squares `R1–R5` and `U1–U5`;
* `StudieII_Voice.maxpat` — a single voice containing five `cycle~` oscillators, summing, envelope control, click protection, and panning;
* `poly~ StudieII_Voice 16` — sixteen parallel voices;
* `jit.cellblock` — displays the numerical squares and the table of 380 events;
* `jit.lcd` — renders a score-like image of the generated rectangles;
* `zl.scramble 1 2 3 4 5` — generates a random permutation of the source series.

### JavaScript Modules

* `studie2_series_core.js` — constructs `R1–R5` and `U1–U5`;
* `studie2_series_engine.js` — connects the numerical squares to Max;
* `studie2_material_core.js` — generates 81 frequencies, 61 durations, and 61 intensity values;
* `studie2_material_engine.js` — connects the material banks to Max;
* `studie2_events_parameters.js` — event indices, parameters, durations, and onset times;
* `studie2_events_envelopes.js` — amplitude profiles for the five sections;
* `studie2_events_emit.js` — assembles the musical events;
* `studie2_events_core.js` — generates the complete form;
* `studie2_event_engine.js` — sends events to the table and scheduler;
* `studie2_scheduler.js` — handles transport and distributes events among the voices;
* `studie2_score_view.js` — visualizes the score rectangles;
* `studie2_voice_control.js` — generates control messages for a single voice, while the oscillators remain visible as Max objects.

The logic is deliberately not packed into a single opaque `everything.js`. The principal stages of the generative process can be opened, inspected, and tested independently, because the project concerns programmable composition rather than the worship of a black box.

## Sources and Limitations

The method is based primarily on Joachim Heintz’s Csound reconstruction and the available research materials. Further details and the limits of the reconstruction’s accuracy are documented in `SOURCES_AND_LIMITS.md`.

The digital model does not claim to reproduce literally the WDR studio oscillators, magnetic tape, editing transients, acoustic reverberation chamber, or manually shaped amplitude envelopes used in 1954.

## Tests

```bash
node tests/test_generator.js
node tests/test_all_permutations.js
python tests/validate_maxpat.py
```

The tests verify the original series, the generative example, all 120 possible permutations, the complete set of 380 events, and the structure of the Max patches.

## Possible Max Console Messages

If Max cannot locate `StudieII_Voice.maxpat`, `StudieII_SquareDisplay.maxpat`, or one of the `.js` files, the repository contents have probably been distributed across different folders. Keep the project files together, or add the project directory to the Max Search Path.

If `rev3~` cannot be instantiated, the dry signal can temporarily be connected directly to `ezdac~`, bypassing the reverb.
