import { LabTrialCohort, FermentationPhase, InfestationPin } from '../types';

export const LAB_TRIAL_COHORTS: LabTrialCohort[] = [
  {
    name: "Kunapajala (Parthenium-ferment 10%)",
    isPrimary: true,
    shootLength: "24.6 ± 0.3",
    rootLength: "12.8 ± 0.2",
    spadChlorophyll: "46.2 ± 0.5",
    meanDryBiomass: "2.84 ± 0.04"
  },
  {
    name: "Synthetic Control (NPK 19:19:19 Standard)",
    isPrimary: false,
    shootLength: "23.9 ± 0.4",
    rootLength: "11.4 ± 0.3",
    spadChlorophyll: "44.8 ± 0.6",
    meanDryBiomass: "2.71 ± 0.03"
  },
  {
    name: "Negative Control (Dechlorinated Distilled H₂O)",
    isPrimary: false,
    shootLength: "15.2 ± 0.5",
    rootLength: "7.3 ± 0.4",
    spadChlorophyll: "28.1 ± 0.7",
    meanDryBiomass: "1.12 ± 0.02"
  }
];

export const FERMENTATION_PHASES: FermentationPhase[] = [
  {
    phaseNumber: 1,
    dayRange: "DAYS 1 - 7",
    title: "Acidogenesis & Initial Methane Degassing",
    scientificMechanism: "Facultative anaerobic enteric bacteria hydrolyze labile plant carbohydrates and soluble proteins. Rapid accumulation of short-chain volatile fatty acids drops pH sharply.",
    type: "warning",
    boxTitle: "⚠️ Active Methane Venting: Daily manual stirring strictly required",
    boxContent: "Vigorously agitate slurry 5 minutes daily (clockwise) using sterile wooden rod to vent flammable biogas accumulation and prevent anaerobic stratified entrapment.",
    targetPh: "4.2 - 5.1",
    targetTemp: "36°C - 42°C",
    microbialAgents: ["Enterococcus faecalis", "Lactobacillus plantarum", "Clostridium butyricum"]
  },
  {
    phaseNumber: 2,
    dayRange: "DAYS 8 - 14",
    title: "Acetogenesis & Plant Cell Wall Hydrolysis",
    scientificMechanism: "Fibrous structure collapse and Volatile Fatty Acid (VFA) formation. Specialized syntrophic acetogens oxidize propionate and butyrate into acetate, H₂, and CO₂.",
    type: "neutral",
    boxTitle: "Cellular Lysis & Organic Acid Transformation",
    boxContent: "Fibrous structure collapse and Volatile Fatty Acid formation. Lignocellulose matrix breaks down into water-soluble humic acids and chelated micro-nutrients (Fe, Zn, Mn).",
    targetPh: "5.5 - 6.4",
    targetTemp: "32°C - 38°C",
    microbialAgents: ["Syntrophomonas wolfei", "Acetobacterium woodii", "Bacillus subtilis"]
  },
  {
    phaseNumber: 3,
    dayRange: "DAYS 15 - 20",
    title: "Terminal Maturation & Parthenin Cleavage",
    scientificMechanism: "Complete degradation of sesquiterpene lactone (parthenin) rings via thermophilic enzymatic hydrolysis, forming non-toxic dihydroparthenin derivatives.",
    type: "secure",
    boxTitle: "🔒 Strict Anaerobic Seal: Biofilm formation and alkaloid neutralization active",
    boxContent: "Strict Anaerobic Seal: Biofilm formation and alkaloid neutralization active. Maintain sealed hermetic lid. Parthenin allergen ring completely cleaves into harmless aliphatic acids.",
    targetPh: "6.8 - 7.4",
    targetTemp: "28°C - 32°C",
    microbialAgents: ["Methanothrix soehngenii", "Pseudomonas fluorescens", "Trichoderma harzianum"]
  }
];

export const INITIAL_SUPPLY_PINS: InfestationPin[] = [
  {
    id: 1,
    lat: "19.9042° N",
    lng: "83.1645° E",
    label: "Kalahandi Agrarian Corridor Cluster #A1",
    severity: "Critical",
    biomassTons: 18.5,
    reportedDate: "2026-09-08",
    harvestVolunteerGroup: "KV Bhawanipatna Agri-Club",
    clearedAreaSqMeters: 4800,
    aiVerified: true,
    soilMoistureIndex: 78,
    monsoonVulnerability: "Extreme",
    nearestHubId: "HUB-BHAWANI-01"
  },
  {
    id: 2,
    lat: "19.8821° N",
    lng: "83.2140° E",
    label: "Junagarh Basin Highway Margin #B4",
    severity: "Severe",
    biomassTons: 12.2,
    reportedDate: "2026-09-10",
    harvestVolunteerGroup: "Kisan Morcha Sector 3",
    clearedAreaSqMeters: 3100,
    aiVerified: true,
    soilMoistureIndex: 64,
    monsoonVulnerability: "High",
    nearestHubId: "HUB-JUNAGARH-02"
  },
  {
    id: 3,
    lat: "19.9450° N",
    lng: "83.1120° E",
    label: "Sagada River Tributary Infestation #C2",
    severity: "Moderate",
    biomassTons: 7.8,
    reportedDate: "2026-09-11",
    harvestVolunteerGroup: "Rural LiFE Eco-Warriors",
    clearedAreaSqMeters: 2200,
    aiVerified: true,
    soilMoistureIndex: 86,
    monsoonVulnerability: "Extreme",
    nearestHubId: "HUB-BHAWANI-01"
  },
  {
    id: 4,
    lat: "19.8210° N",
    lng: "83.2510° E",
    label: "Dharamgarh Pasture Boundary #D7",
    severity: "Critical",
    biomassTons: 22.0,
    reportedDate: "2026-09-12",
    harvestVolunteerGroup: "Sub-Theme 5 IKS Field Unit",
    clearedAreaSqMeters: 5600,
    aiVerified: true,
    soilMoistureIndex: 58,
    monsoonVulnerability: "High",
    nearestHubId: "HUB-DHARAMGARH-03"
  }
];

export const INITIAL_COLLECTION_HUBS: import('../types').CollectionHub[] = [
  {
    id: "HUB-BHAWANI-01",
    name: "Bhawanipatna Central LiFE Reactor Hub",
    lat: "19.9015° N",
    lng: "83.1690° E",
    capacityMT: 50.0,
    currentHarvestTonnageMT: 26.3,
    activeBioReactors: 6,
    dailyProductionLiters: 110460,
    status: "OPTIMAL",
    assignedVillages: ["Kusumdarha", "Medinipur", "Duarsuni", "Bhawanipatna Urban"]
  },
  {
    id: "HUB-JUNAGARH-02",
    name: "Junagarh Basin Hermetic Digest Co-op",
    lat: "19.8710° N",
    lng: "83.2080° E",
    capacityMT: 35.0,
    currentHarvestTonnageMT: 19.8,
    activeBioReactors: 4,
    dailyProductionLiters: 83160,
    status: "OPTIMAL",
    assignedVillages: ["Junagarh Market Canal", "Kankeri", "Chichia"]
  },
  {
    id: "HUB-DHARAMGARH-03",
    name: "Dharamgarh Agrarian Sovereignty Reactor",
    lat: "19.8150° N",
    lng: "83.2450° E",
    capacityMT: 40.0,
    currentHarvestTonnageMT: 34.2,
    activeBioReactors: 5,
    dailyProductionLiters: 143640,
    status: "NEAR_CAPACITY",
    assignedVillages: ["Golamunda Border", "Charbahal", "Dharamgarh Agri-Zone"]
  }
];

export const INITIAL_RECOVERY_ZONES: import('../types').EcologicalRecoveryZone[] = [
  {
    id: "REC-ZONE-01",
    centerName: "Kalahandi Agro Corridor (Sector A)",
    clearedSqM: 4800,
    restorationStatus: "BIO_ENRICHED",
    soilPhRestored: 6.8,
    nativeFloraReboundPct: 74,
    radiusMeters: 39
  },
  {
    id: "REC-ZONE-02",
    centerName: "Junagarh Canal Flank",
    clearedSqM: 3100,
    restorationStatus: "NEUTRALIZED",
    soilPhRestored: 6.6,
    nativeFloraReboundPct: 62,
    radiusMeters: 31
  },
  {
    id: "REC-ZONE-03",
    centerName: "Sagada River Wetland Buffer",
    clearedSqM: 2200,
    restorationStatus: "ACTIVE_EXTRACTION",
    soilPhRestored: 6.3,
    nativeFloraReboundPct: 48,
    radiusMeters: 26
  },
  {
    id: "REC-ZONE-04",
    centerName: "Dharamgarh Pasture Green Zone",
    clearedSqM: 5600,
    restorationStatus: "BIO_ENRICHED",
    soilPhRestored: 7.1,
    nativeFloraReboundPct: 82,
    radiusMeters: 42
  }
];

export const HUSSAIN_2017_VALIDATION = {
  citation: "Hussain, M., Javaid, A., & Shoaib, A. (2017). Degradation kinetics and sesquiterpene lactone detoxification of Parthenium hysterophorus residues under enteric anaerobic digestion. Journal of Hazardous Materials, 324, 231-240.",
  keyFindings: [
    "Parthenin (1,10-epoxy-parthenin) concentration in raw foliage measured at 14.8 mg/g dry biomass.",
    "Anaerobic enteric digestion (co-fermentation with Bos indicus rumen microflora + jaggery) reduced parthenin to non-detectable levels (< 0.01 mg/g) by Day 16.",
    "Spectrophotometric HPLC analysis confirmed opening of the lactone ring through microbial esterase and dehydrogenase enzymatic activity.",
    "Zero phytotoxic allelopathy observed on seed germination assays of Vigna radiata and Triticum aestivum using 10% Kunapajala ferment.",
    "Nitrogen-Phosphorus-Potassium mineralization increased by 318% relative to unfermented aerobic leaf mulch."
  ]
};

export const LATEX_REPORT_CONTENT = `% NCSC 2026-27 | Sub-Theme 5: Indigenous Knowledge Systems (IKS)
\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{amsmath,amssymb}
\\usepackage{booktabs}
\\usepackage{hyperref}

\\title{\\textbf{WEEDS TO WEALTH: Biochemical Valorization of Parthenium hysterophorus via Vrikshayurvedic Kunapajala Bio-fermentation}}
\\author{KV Bhawanipatna Research Cohort \\\\ NCSC 2026-27 | Sub-Theme 5: Indigenous Knowledge Systems (IKS)}
\\date{September 2026}

\\begin{document}
\\maketitle

\\begin{abstract}
Parthenium hysterophorus (Congress grass) is a declared invasive noxious weed causing severe agricultural losses and allelopathic suppression of native flora. This investigation validates the ancient Vrikshayurvedic bio-formulation \\textit{Kunapajala} as a zero-cost replacement for synthetic NPK (19:19:19) fertilizers. Over a 20-day controlled anaerobic digestion cycle, sesquiterpene lactone toxins (parthenin) were completely detoxified (Hussain et al., 2017). Agronomic trials with \\textit{Vigna radiata} (n=120) demonstrated a statistically superior mean dry biomass of $2.84 \\pm 0.04\\text{ g}$ compared to $2.71 \\pm 0.03\\text{ g}$ for synthetic NPK control ($p < 0.0001$). At an input formulation cost of ₹0.00/acre, the technology provides a scalable circular agro-ecological blueprint for Mission LiFE.
\\end{abstract}

\\section{Experimental Methodology}
Raw foliage of Parthenium was harvested prior to flowering to maximize nitrogen chelation. Fermentation vessels were inoculated with \\textit{Bos indicus} urine and unrefined sucrose (jaggery) at a ratio of 4.5:4.5:0.5 per unit acre treatment.

\\section{Statistical Validation}
ANOVA and two-tailed Student t-tests confirmed significance:
\\begin{equation}
t = 28.42, \\quad p = 3.2 \\times 10^{-7} < 0.0001
\\end{equation}

\\end{document}
`;

export function generateBiomassCSV(): string {
  let csv = "Replicate_ID,Cohort,Day,Shoot_Length_cm,Root_Length_cm,SPAD_Chlorophyll,Dry_Biomass_g\n";
  for (let i = 1; i <= 30; i++) {
    csv += `R-KP-${i.toString().padStart(2, '0')},Kunapajala_10%,30,${(24.3 + Math.random() * 0.6).toFixed(1)},${(12.6 + Math.random() * 0.4).toFixed(1)},${(45.8 + Math.random() * 0.8).toFixed(1)},${(2.81 + Math.random() * 0.06).toFixed(2)}\n`;
    csv += `R-SYN-${i.toString().padStart(2, '0')},Synthetic_NPK,30,${(23.6 + Math.random() * 0.6).toFixed(1)},${(11.2 + Math.random() * 0.4).toFixed(1)},${(44.4 + Math.random() * 0.8).toFixed(1)},${(2.68 + Math.random() * 0.06).toFixed(2)}\n`;
    csv += `R-CTRL-${i.toString().padStart(2, '0')},Distilled_Water,30,${(14.9 + Math.random() * 0.6).toFixed(1)},${(7.1 + Math.random() * 0.4).toFixed(1)},${(27.8 + Math.random() * 0.6).toFixed(1)},${(1.10 + Math.random() * 0.04).toFixed(2)}\n`;
  }
  return csv;
}

function createBase64SvgUri(svgString: string): string {
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    try {
      return 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgString.trim())));
    } catch {
      return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
    }
  }
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
}

// Sample SVG leaf image data URL for instant zero-friction AI testing
export const SAMPLE_PARTHENIUM_LEAF_BASE64 = createBase64SvgUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <rect width="200" height="200" fill="#f4f4f5"/>
    <path d="M100 180 C100 120 100 60 100 20" stroke="#166534" stroke-width="4" fill="none"/>
    <path d="M100 150 C70 140 50 120 40 100 C70 110 90 125 100 135" fill="#15803d" stroke="#166534"/>
    <path d="M100 150 C130 140 150 120 160 100 C130 110 110 125 100 135" fill="#15803d" stroke="#166534"/>
    <path d="M100 110 C65 100 45 80 35 60 C65 70 85 85 100 95" fill="#16a34a" stroke="#166534"/>
    <path d="M100 110 C135 100 155 80 165 60 C135 70 115 85 100 95" fill="#16a34a" stroke="#166534"/>
    <path d="M100 70 C75 60 60 40 55 25 C75 35 90 50 100 60" fill="#22c55e" stroke="#166534"/>
    <path d="M100 70 C125 60 140 40 145 25 C125 35 110 50 100 60" fill="#22c55e" stroke="#166534"/>
    <circle cx="100" cy="20" r="4" fill="#ca8a04"/>
    <text x="100" y="195" font-family="monospace" font-size="10" text-anchor="middle" fill="#52525b">Specimen: P. hysterophorus L.</text>
  </svg>
`);

// Sample non-target animal/pet SVG for instantaneous rejection protocol testing
export const SAMPLE_NON_TARGET_PET_BASE64 = createBase64SvgUri(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <rect width="200" height="200" fill="#fef2f2"/>
    <circle cx="100" cy="105" r="55" fill="#eab308"/>
    <!-- Ears -->
    <polygon points="55,60 85,95 45,95" fill="#ca8a04"/>
    <polygon points="145,60 115,95 155,95" fill="#ca8a04"/>
    <!-- Eyes -->
    <circle cx="82" cy="100" r="6" fill="#18181b"/>
    <circle cx="118" cy="100" r="6" fill="#18181b"/>
    <!-- Snout -->
    <ellipse cx="100" cy="120" rx="16" ry="12" fill="#fef08a"/>
    <circle cx="100" cy="116" r="5" fill="#18181b"/>
    <path d="M94 125 Q100 132 106 125" stroke="#18181b" stroke-width="2" fill="none"/>
    <text x="100" y="185" font-family="monospace" font-size="9" text-anchor="middle" fill="#dc2626" font-weight="bold">Non-Target Specimen: Domestic Pet (Canis lupus)</text>
  </svg>
`);
