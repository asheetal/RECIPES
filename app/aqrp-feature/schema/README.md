# AQRP master schema repository

Convention (v237):

- step1_in.schema      input accepted by step 1 (the uploaded JSON corpus)
- stepN_(N+1).schema   output of step N = exact contract step N+1 reads
- step32_out.schema    the final deliverable returned by step 32
- _shared/*.schema     sub-schemas referenced by $ref from boundary files

Every schema is registered by $id ("aqrp://..."). The step boundary is the
only cross-step contract; there is exactly one per adjacent pair. A broken
boundary throws from pipeline.cjs; aqrp_step_run re-throws; OPD surfaces it.

Semantic checks JSON Schema cannot express (RDF DOI membership, coder
record-set coverage, chosen in options) stay in pipeline.cjs AFTER schema
validation. additionalProperties:true is used only where pass-through is
expected by design; strict boundaries set it to false.

## Boundary → schema → producer (source of truth)

| Boundary  | Schema file             | Producer (pipeline.cjs)                                                     | Required keys at this boundary                                 |
|-----------|-------------------------|-----------------------------------------------------------------------------|----------------------------------------------------------------|
| corpus→1  | step1_in.schema         | (input)                                                                     | any JSON value                                                 |
| 1→2       | step1_2.schema          | step1()                                                                     | status, json_type, bytes                                       |
| 2→3       | step2_3.schema          | step2()                                                                     | status, topics[2–5], P01                                       |
| 3→4       | step3_4.schema          | step3()                                                                     | status, coding_brief, notes, rdf_records[R3,R3a]               |
| 4→5       | step4_5.schema          | step4() (fold of panel_result)                                              | status, code_matrix, disagreements                             |
| 5→6       | step5_6.schema          | searchStep(5)                                                               | status, P02                                                    |
| 6→7       | step6_7.schema          | surgeonStep(6)                                                              | status, salience_ranking, memos, rdf_records[R6], P02          |
| 7→8       | step7_8.schema          | searchStep(7)                                                               | status, P03                                                    |
| 8→9       | step8_9.schema          | surgeonStep(8)                                                              | status, rq, rdf_records[R8], P03                               |
| 9→10      | step9_10.schema         | searchStep(9, extraFields:[lit_map])                                        | status, P04, lit_map                                           |
| 10→11     | step10_11.schema        | surgeonStep(10)                                                             | status, candidate_lenses, rdf_records[R10], P04                |
| 11→12     | step11_12.schema        | searchStep(11)                                                              | status, P05                                                    |
| 12→13     | step12_13.schema        | surgeonStep(12)                                                             | status, chosen_framing, framing_comparison, rdf_records[R12], P05 |
| 13→14     | step13_14.schema        | step13()                                                                    | status, merge_candidates                                       |
| 14→15     | step14_15.schema        | searchStep(14)                                                              | status, P06                                                    |
| 15→16     | step15_16.schema        | surgeonStep(15)                                                             | status, codebook, rdf_records[R15], P06                        |
| 16→17     | step16_17.schema        | panelStepGeneric(16)                                                        | status, panel_result, within_case_matrix, within_case_disagreements |
| 17→18     | step17_18.schema        | panelStepGeneric(17)                                                        | status, panel_result, cross_case_matrix, cross_case_disagreements   |
| 18→19     | step18_19.schema        | searchStep(18)                                                              | status, P07                                                    |
| 19→20     | step19_20.schema        | surgeonStep(19)                                                             | status, themes_k, rdf_records[R19], P07                        |
| 20→21     | step20_21.schema        | searchStep(20)                                                              | status, P08                                                    |
| 21→22     | step21_22.schema        | surgeonStep(21)                                                             | status, novelty_map, rdf_records[R21], P08                     |
| 22→23     | step22_23.schema        | panelStepGeneric(22)                                                        | status, panel_result, negative_case_matrix, negative_case_disagreements |
| 23→24     | step23_24.schema        | searchStep(23)                                                              | status, P09                                                    |
| 24→25     | step24_25.schema        | surgeonStep(24)                                                             | status, dimensions, rdf_records[R24], P09                      |
| 25→26     | step25_26.schema        | searchStep(25)                                                              | status, P10                                                    |
| 26→27     | step26_27.schema        | surgeonStep(26)                                                             | status, model_draft, rdf_records[R26], P10                     |
| 27→28     | step27_28.schema        | searchStep(27)                                                              | status, P11                                                    |
| 28→29     | step28_29.schema        | surgeonStep(28)                                                             | status, diagram_script_params, rdf_records[R28], P11           |
| 29→30     | step29_30.schema        | searchStep(29)                                                              | status, P12                                                    |
| 30→31     | step30_31.schema        | surgeonStep(30)                                                             | status, sufficiency, rdf_records[R30], P12                     |
| 31→32     | step31_32.schema        | searchStep(31)                                                              | status, P13                                                    |
| 32→out    | step32_out.schema       | step32()                                                                    | status, aqrp_report_title, aqrp_report_body_tex, aqrp_appendices_tex, aqrp_report_bib, aqrp_report_audit, rdf_records |

Every boundary is a `{stepN_(N+1).schema}` file; `additionalProperties:true` means step N passes non-consumed fields of step N-1 forward verbatim. Semantic checks (RDF DOI membership, coder coverage, chosen ∈ options) live in pipeline.cjs *after* schema validation. A violation of either surface throws from `aqrp_step_run` and the surgeon routes the error through OPD.
