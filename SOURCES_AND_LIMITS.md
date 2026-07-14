# Sources and implementation limits

## Principal algorithmic source

Joachim Heintz, **Re-Generating Stockhausen's “Studie II” in Csound: A Study About Algorithmic Composition**, Linux Audio Conference, 2010.

The implementation follows the Csound regeneration distributed in the CsoundQt examples, including:

- interval transposition for `R1`;
- the hop/distance procedures for `R2–R5`;
- inversion by `6 - value` for `U1–U5`;
- 81 frequencies and 61 durations from `5^(1/25)`;
- five distinct formal procedures;
- 380 events and five sinusoidal components per event;
- the published envelope templates and part-five score corrections.

Repository source used during reconstruction:

`CsoundQt/CsoundQt/src/Examples/CsoundQt/M Music/Stockhausen Studie II.csd`

## Other supplied research sources

- Sean Williams, **Interpretation and Performance Practice in Realising Stockhausen’s Studie II**, 2016.
- Joachim Heintz, **Wie programmierbar ist ein Kompositionsprozess? Zu Stockhausens Studie II und Cages Williams Mix**.
- Hubert Wißkirchen, **Karlheinz Stockhausen: Studie II — Vereinfachte und farbige Strukturdarstellung**, 2005.
- Karlheinz Stockhausen, **Studie II**, score, Universal Edition.

## Limits

The score and Heintz reconstruction include decisions that are not reducible to a newly chosen seed. In particular, envelope sequences and numerous details of part five are retained as a formal template. The historical dB correction table is disabled in strict variation mode because applying event-by-event corrections from `3 5 1 4 2` to a different seed would preserve mistakes and preferences rather than preserve rules.

The sound generator uses ideal digital sine waves and a generic digital reverb. It does not claim to reproduce the exact WDR oscillator inaccuracies, tape-splice transients, acoustic chamber response, manual fader performance or tape noise.
