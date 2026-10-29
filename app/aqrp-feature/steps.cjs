'use strict';
// ============================================================
// AQRP step registry — SINGLE SOURCE OF TRUTH for FINAL_STEP.
// ============================================================
const FINAL_STEP = 32;
const IMPLEMENTED = {
  1:{name:'Load',type:'tool'}, 2:{name:'Topical search',type:'surgeon->tool'}, 3:{name:'Familiarization',type:'surgeon'}, 4:{name:'Open coding',type:'surgeon->coder'},
  5:{name:'Memo search',type:'surgeon->tool'}, 6:{name:'Memo',type:'surgeon'}, 7:{name:'RQ search',type:'surgeon->tool'}, 8:{name:'RQ formulation',type:'surgeon'},
  9:{name:'Lit scan',type:'surgeon->tool'}, 10:{name:'Lens proposal',type:'surgeon'}, 11:{name:'Lens search',type:'surgeon->tool'}, 12:{name:'Lens selection',type:'surgeon'},
  13:{name:'Code grouping',type:'tool'}, 14:{name:'Codebook search',type:'surgeon->tool'}, 15:{name:'Codebook adjudication',type:'surgeon'},
  16:{name:'Within-case',type:'surgeon->coder'}, 17:{name:'Across-case',type:'surgeon->coder'},
  18:{name:'Theme search',type:'surgeon->tool'}, 19:{name:'Themes',type:'surgeon'}, 20:{name:'Novelty search',type:'surgeon->tool'}, 21:{name:'Novelty check',type:'surgeon'},
  22:{name:'Negative cases',type:'surgeon->coder'}, 23:{name:'Aggregation search',type:'surgeon->tool'}, 24:{name:'Aggregate dimensions',type:'surgeon'},
  25:{name:'Model search',type:'surgeon->tool'}, 26:{name:'Grounded model',type:'surgeon'}, 27:{name:'Diagram search',type:'surgeon->tool'}, 28:{name:'Diagram generation',type:'surgeon'},
  29:{name:'Sufficiency search',type:'surgeon->tool'}, 30:{name:'Sufficiency',type:'surgeon'}, 31:{name:'Report search',type:'surgeon->tool'}, 32:{name:'Final packaging',type:'surgeon'},
};
module.exports = { FINAL_STEP, IMPLEMENTED };
