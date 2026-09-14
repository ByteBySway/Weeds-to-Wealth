import { LanguageCode } from '../types';

export interface Translations {
  // Global & Navigation
  appName: string;
  ncscBadge: string;
  tabDashboard: string;
  tabCalculator: string;
  tabProtocol: string;
  tabMap: string;
  exportPdfBtn: string;
  citationsMatrixBtn: string;

  // Hero Section
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroDescription: string;
  heroExploreBtn: string;
  heroCalculateBtn: string;
  heroSupplyMapBtn: string;
  costTitle: string;
  zeroCommercialRawInputs: string;
  hundredPercentFree: string;
  potencyTitle: string;
  potencySubtitle: string;
  provenAgroEfficacy: string;
  allelopathyTitle: string;
  allelopathySubtitle: string;
  sesquiterpeneHydrolysis: string;

  // Biosecurity Scanner
  scannerBadge: string;
  scannerTitle: string;
  scannerSubtitle: string;
  scannerUploadBtn: string;
  scannerSamplePartheniumBtn: string;
  scannerSampleNonTargetBtn: string;
  scannerResetBtn: string;
  rejectedBoxText: string;
  verifiedHeader: string;
  speciesIdentityLabel: string;
  toxinAssayLabel: string;
  digesterSuitabilityLabel: string;
  scanningText: string;

  // Formulation & ROI Engine
  roiBadge: string;
  roiTitle: string;
  roiSubtitle: string;
  landholdingLabel: string;
  chemicalSpendLabel: string;
  seasonalSavingsTitle: string;
  ureaBagsTitle: string;
  foliarSprayTitle: string;
  co2PreventedTitle: string;
  nitrogenRunoffTitle: string;
  stoichiometryTitle: string;
  partheniumHarvestQuota: string;
  bosIndicusUrine: string;
  unrefinedJaggery: string;

  // Fermentation Protocol & Batch Tracker
  batchLogBadge: string;
  batchLogTitle: string;
  batchLogSubtitle: string;
  phTrajectoryTitle: string;
  stirringProtocolTitle: string;
  dayLabel: string;
  acidogenesisStage: string;
  proteolysisStage: string;
  maturationStage: string;

  // Supply Chain Map
  mapBadge: string;
  mapTitle: string;
  mapSubtitle: string;
  dropPinBtn: string;
  clustersActive: string;
  totalBiomass: string;
  collectionHubsTitle: string;
  reportInfestationModalTitle: string;

  // Molecular Mechanism Simulator
  simulatorBadge: string;
  simulatorTitle: string;
  simulatorSubtitle: string;
  tabChelation: string;
  tabSynergy: string;
  driftSpeedLabel: string;
  kineticBreakdownTitle: string;
  freePartheninLabel: string;
  lactoneCleavageLabel: string;
  aminoChelateLabel: string;
  substrateMatrixLabel: string;
  surapalaTreatiseTitle: string;
  surapalaTreatiseText: string;
  molecularLegendTitle: string;
  partheninToxinNode: string;
  vegetalProteinNode: string;
  organicAcidsNode: string;
  chelateComplexesNode: string;
  macroLogisticsTitle: string;
  biomassYieldLabel: string;
  npkParityLabel: string;
  cationBioavailLabel: string;
  zeroRawCostLabel: string;

  // Crop Yield & Carbon Predictor
  cropPredictorBadge: string;
  cropPredictorTitle: string;
  cropPredictorSubtitle: string;
  acresUnit: string;
  bagsLabel: string;
  co2SparedLabel: string;
  currentNpkSpendLabel: string;
  projectedSavingsTitle: string;
  supplyMapTitle: string;
  supplyMapSubtitle: string;

  // Dossier & PDF Export Headings
  pdfTitle: string;
  pdfSubtheme: string;
  pdfDossierHeader: string;
  pdfDossierDesc: string;
  pdfProjectStatus: string;
  pdfZone: string;
  pdfReportDate: string;
  pdfIksRef: string;
  pdfSection1: string;
  pdfSection2: string;
  pdfSection3: string;
  pdfSection4: string;
  pdfSection5: string;
  pdfSubstrateCol: string;
  pdfRoleCol: string;
  pdfAllocCol: string;
  pdfNutrientCol: string;
  pdfKunapaCol: string;
  pdfSynthCol: string;
  pdfMechCol: string;
  pdfSignInvestigator: string;
  pdfSignEvaluator: string;
  pdfBiosecurityText: string;
  pdfDocRef: string;
  pdfPrintPreviewBtn: string;
  pdfDownloadBtn: string;
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  EN: {
    appName: 'WEEDS TO WEALTH',
    ncscBadge: 'NCSC 2026-27',
    tabDashboard: 'Dashboard',
    tabCalculator: 'Formulation Engine',
    tabProtocol: 'AI Scanner',
    tabMap: 'Supply Map',
    exportPdfBtn: 'Export PDF Report',
    citationsMatrixBtn: 'IKS & Citations Matrix',

    heroBadge: 'OPEN-SOURCE AGRI-CIRCULARITY ARCHITECTURE',
    heroHeadline: 'REPLACING SYNTHETIC NPK WITH TOXIC INVASIVE WEEDS.',
    heroSubheadline: "Scaling Vrikshayurveda's Kunapajala for Mission LiFE. NCSC 2026-27 | Sub-Theme 5.",
    heroDescription:
      'Reclaiming agro-ecological sovereignty through biochemical transformation of Parthenium hysterophorus. Converting noxious allelopathic bio-hazards into high-potency liquid bio-fertilizer at zero commercial expense.',
    heroExploreBtn: 'Explore 20-Day Protocol',
    heroCalculateBtn: 'Calculate Formulation',
    heroSupplyMapBtn: 'View Supply Map',
    costTitle: 'FORMULATION COST',
    zeroCommercialRawInputs: 'Zero commercial raw inputs',
    hundredPercentFree: '100% Free',
    potencyTitle: 'NPK NUTRIENT PARITY',
    potencySubtitle: '108.7% efficacy vs 0.5% chemical control',
    provenAgroEfficacy: 'Lab Trial Verified',
    allelopathyTitle: 'ALLELOPATHY NEUTRALIZATION',
    allelopathySubtitle: '99.8% parthenin lactone cleavage by Day 7',
    sesquiterpeneHydrolysis: 'Non-Toxic Hydrolysis',

    scannerBadge: 'STANDARDIZED SAFETY & BIO-DIGESTION PROTOCOL',
    scannerTitle: 'AI Biosecurity Scanner (Gemini Vision API)',
    scannerSubtitle:
      'Verify field leaf foliage samples for Parthenium hysterophorus (Congress grass) taxonomy and validate that sesquiterpene lactone profiles are safe for anaerobic bio-conversion into Kunapajala.',
    scannerUploadBtn: 'Upload Leaf Image for AI Verification',
    scannerSamplePartheniumBtn: 'Test Specimen (Parthenium Leaf)',
    scannerSampleNonTargetBtn: 'Test Rejection Protocol (Pet / Non-Target)',
    scannerResetBtn: 'Reset / Scan Another Sample',
    rejectedBoxText: '⚠️ REJECTED: Specimen is not Parthenium hysterophorus. Ineligible for Kunapajala processing.',
    verifiedHeader: 'TAXONOMIC & BIOSECURITY CONFIRMATION',
    speciesIdentityLabel: 'Species Identity',
    toxinAssayLabel: 'Sesquiterpene Toxin Assay',
    digesterSuitabilityLabel: 'Anaerobic Digester Purity',
    scanningText: 'Analyzing cellular morphology with Gemini Vision API...',

    roiBadge: 'BIO-RESOURCE RATIO CONVERSION ENGINE',
    roiTitle: 'Vrikshayurveda Agronomic ROI & Formulation Engine',
    roiSubtitle:
      'Compute stoichiometric biomass harvesting quotas, microbial carbohydrate feeds, and baseline synthetic expenditure offsets for any agrarian landholding.',
    landholdingLabel: 'Cultivated Farm Size (Acres)',
    chemicalSpendLabel: 'Current Seasonal Fertilizer Spend (₹ / Acre)',
    seasonalSavingsTitle: 'Net Farm Savings',
    ureaBagsTitle: 'Synthetic Urea Displaced',
    foliarSprayTitle: 'Ready Foliar Spray',
    co2PreventedTitle: 'CO2 Prevented',
    nitrogenRunoffTitle: 'Nitrogen Runoff Avoided',
    stoichiometryTitle: 'Stoichiometric Digester Input Quantities',
    partheniumHarvestQuota: 'Fresh Parthenium Biomass Quota',
    bosIndicusUrine: 'Bos indicus Fresh Cow Urine',
    unrefinedJaggery: 'Raw Unrefined Jaggery Inoculum',

    batchLogBadge: 'FERMENTATION KINETICS & QUALITY ASSURANCE',
    batchLogTitle: 'Batch Fermentation Log & pH Curve Tracker',
    batchLogSubtitle:
      'Monitor the 20-day biochemical breakdown: follow the real-time acidification trajectory (6.8 → 4.5) and record daily manual stirring tasks.',
    phTrajectoryTitle: 'Acidification Trajectory (pH 6.8 ➔ 4.5 ➔ 7.1)',
    stirringProtocolTitle: 'Stirring Protocol & Quality Checkpoints',
    dayLabel: 'Day',
    acidogenesisStage: 'Acidogenesis & Hydrolysis',
    proteolysisStage: 'Anaerobic Proteolysis',
    maturationStage: 'Methanogenesis & Maturation',

    mapBadge: 'GEOSPATIAL HARVEST LOGISTICS',
    mapTitle: 'Parthenium Supply Chain Geo-Map',
    mapSubtitle:
      'Decentralized sourcing telemetry: connecting farmer cooperatives with active bio-digester pits across the district.',
    dropPinBtn: '📍 Drop Pin: Report Parthenium Infestation Cluster',
    clustersActive: 'Infestation Clusters',
    totalBiomass: 'Total Biomass',
    collectionHubsTitle: 'Village Collection Hubs & Processing Pits',
    reportInfestationModalTitle: 'Report New Parthenium Infestation Outbreak',

    simulatorBadge: 'DIGITAL LAB // BIOTECH KINETICS SIMULATOR',
    simulatorTitle: 'Interactive Molecular & Process Mechanism Simulator (Digital Canvas)',
    simulatorSubtitle: 'Observe simulated microscopic chelation kinetics and macroscopic agritech logistics in real-time.',
    tabChelation: '1. Parthenin Chelation & Amino Acid Binding',
    tabSynergy: '2. Bio-Hybrid Synergy Loop',
    driftSpeedLabel: 'DRIFT SPEED:',
    kineticBreakdownTitle: 'KINETIC STATUS BREAKDOWN',
    freePartheninLabel: 'Free Parthenin Sesquiterpene:',
    lactoneCleavageLabel: 'Lactone Ring Cleavage:',
    aminoChelateLabel: 'Stable Amino-Chelate Bonds:',
    substrateMatrixLabel: 'Substrate Matrix: Mustard + Sesame Oilcake',
    surapalaTreatiseTitle: "Surapala's Vrikshayurveda Substitution",
    surapalaTreatiseText:
      'Instead of slaughterhouse animal marrow, toxic Parthenium sesquiterpene lactones are enzymatically cleaved by fermentative organic acids. Vegetative amino acids (cysteine, proline, glycine) chelate trace minerals into bio-available NPK macro-nutrients.',
    molecularLegendTitle: 'LIVE MOLECULAR & CHARGE LEGEND:',
    partheninToxinNode: 'Parthenin (Toxin) C₁₅H₂₀O₄',
    vegetalProteinNode: 'Vegetal Protein Sites NH₃⁺ / -SH',
    organicAcidsNode: 'Organic Acids COO⁻ / H⁺',
    chelateComplexesNode: 'Chelate Complexes (Zero Charge)',
    macroLogisticsTitle: 'MACROSCOPIC CIRCULAR SUPPLY & BIO-DIGESTER LOGISTICS',
    biomassYieldLabel: 'BIOMASS CONVERSION EFFICIENCY',
    npkParityLabel: 'NPK PARITY VS POSITIVE CONTROL',
    cationBioavailLabel: 'CATION BIO-AVAILABILITY (CEC)',
    zeroRawCostLabel: 'COMMERCIAL RAW INPUT COST',

    pdfTitle: "NATIONAL CHILDREN'S SCIENCE CONGRESS (NCSC 2026-27)",
    pdfSubtheme: 'SUB-THEME 5: INDIGENOUS KNOWLEDGE SYSTEMS (IKS) FOR SUSTAINABLE DEVELOPMENT',
    pdfDossierHeader: 'WEEDS TO WEALTH: TECHNICAL RESEARCH & FORMULATION DOSSIER',
    pdfDossierDesc: 'Decentralized Bio-Conversion of Invasive Parthenium hysterophorus into Allelopathy-Free Organic Kunapajala',
    pdfProjectStatus: 'NCSC Field Verified',
    pdfZone: 'Western Odisha (Kalahandi)',
    pdfReportDate: 'Report Date',
    pdfIksRef: "Surapala's Vrikshayurveda",
    pdfSection1: '1. AGRONOMIC STOICHIOMETRY & BIO-CONVERSION INPUTS',
    pdfSection2: '2. FINANCIAL RETURN ON INVESTMENT & CARBON OFFSETS',
    pdfSection3: '3. 20-DAY CONTROLLED FERMENTATION QUALITY & SAFETY MILESTONES',
    pdfSection4: '4. N-P-K-S STOICHIOMETRIC PARITY OVERVIEW (200L EQUIVALENT)',
    pdfSection5: '5. BIOSECURITY TAXONOMIC VERIFICATION & REJECTION PROTOCOL',
    pdfSubstrateCol: 'Input Substrate',
    pdfRoleCol: 'Biochemical / Ecological Role',
    pdfAllocCol: 'Computed Allocation',
    pdfNutrientCol: 'Nutrient Target',
    pdfKunapaCol: 'Kunapajala Parity',
    pdfSynthCol: 'Synthetic Benchmark',
    pdfMechCol: 'Agronomic Bio-Mechanism / Benefit',
    pdfSignInvestigator: 'Student Investigator Signature',
    pdfSignEvaluator: 'NCSC Evaluator / Guide Teacher',
    pdfBiosecurityText:
      'Every foliar substrate ingested into community Kunapajala digesters undergoes automated Gemini Vision taxonomic verification. Substrates displaying non-target morphology (animals, pets, humans, or non-Parthenium species) are immediately rejected with 0.0% confidence to safeguard digester purity.',
    pdfDocRef: 'Doc Ref: NCSC-W2W-2026-KLH-01 | Peer Verification: Hussain et al. (2017) | ICAR-DWR Guidelines',
    pdfPrintPreviewBtn: 'Print / Ctrl+P',
    pdfDownloadBtn: 'Download PDF (.pdf)',

    cropPredictorBadge: 'AGRONOMIC YIELD & CARBON SEQUESTRATION MODEL',
    cropPredictorTitle: 'Crop-Specific Yield Uplift & SOC Predictor',
    cropPredictorSubtitle: 'Multi-season agronomic field projections based on replicated trials with foliar Kunapajala liquid formulations.',
    acresUnit: 'Acres',
    bagsLabel: 'Bags',
    co2SparedLabel: 'CO2 Prevented',
    currentNpkSpendLabel: 'Current Synthetic NPK Spend',
    projectedSavingsTitle: 'PROJECTED SEASONAL SAVINGS:',
    supplyMapTitle: 'PARTHENIUM GEO MAP & BIO-CONVERSION LOGISTICS',
    supplyMapSubtitle: 'Spatial tracking of invasive P. hysterophorus colonies across agricultural corridors. Real-time routing to decentralized hermetic Kunapajala bio-reactors.',
  },
  HI: {
    appName: 'खरपतवार से समृद्धि',
    ncscBadge: 'एनसीएससी 2026-27',
    tabDashboard: 'डैशबोर्ड',
    tabCalculator: 'फॉर्मूलेशन इंजन',
    tabProtocol: 'एआई स्कैनर',
    tabMap: 'सप्लाई मैप',
    exportPdfBtn: 'पीडीएफ रिपोर्ट निर्यात',
    citationsMatrixBtn: '📜 आईकेएस उद्धरण मैट्रिक्स',

    heroBadge: 'ओपन-सोर्स कृषि चक्रीयता वास्तुकला',
    heroHeadline: 'रासायनिक एनपीके को विषैले खरपतवार से बदलना।',
    heroSubheadline: 'मिशन LiFE हेतु वृक्षायुर्वेद कुणपजल का विस्तार। एनसीएससी 2026-27 | उप-विषय 5।',
    heroDescription:
      'पार्थेनियम हिस्टेरोफोरस (गाजर घास) के जैव-रासायनिक रूपांतरण द्वारा कृषि-पारिस्थितिकीय स्वायत्तता। शून्य व्यावसायिक लागत पर विषैले एलिलोपैथिक खरपतवार को उच्च-शक्ति तरल जैविक उर्वरक में बदलना।',
    heroExploreBtn: '20-दिवसीय प्रोटोकॉल देखें',
    heroCalculateBtn: 'फॉर्मूलेशन गणना करें',
    heroSupplyMapBtn: 'सप्लाई मैप देखें',
    costTitle: 'फॉर्मूलेशन लागत',
    zeroCommercialRawInputs: 'शून्य व्यावसायिक कच्चा माल',
    hundredPercentFree: '100% मुफ़्त',
    potencyTitle: 'एनपीके पोषक तत्व समानता',
    potencySubtitle: '0.5% रासायनिक नियंत्रण की तुलना में 108.7% प्रभावशीलता',
    provenAgroEfficacy: 'प्रयोगशाला परीक्षण सत्यापित',
    allelopathyTitle: 'एलिलोपैथी विषहरण',
    allelopathySubtitle: 'दिन 7 तक 99.8% पार्थेनिन लैक्टोन रिंग का विखंडन',
    sesquiterpeneHydrolysis: 'गैर-विषैला जल-अपघटन',

    scannerBadge: 'मानकीकृत सुरक्षा एवं जैव-पाचन प्रोटोकॉल',
    scannerTitle: 'एआई बायोसिक्योरिटी स्कैनर (जेमिनी विज़न एपीआई)',
    scannerSubtitle:
      'गाजर घास (पार्थेनियम) पत्ती के नमूनों की वानस्पतिक पुष्टि करें और सत्यापित करें कि यह कुणपजल जैव-पाचन के लिए विष-मुक्त और सुरक्षित है।',
    scannerUploadBtn: 'पत्ती की तस्वीर अपलोड करें',
    scannerSamplePartheniumBtn: 'पार्थेनियम नमूना टेस्ट',
    scannerSampleNonTargetBtn: 'अस्वीकृति टेस्ट (पशु / अन्य)',
    scannerResetBtn: 'रीसेट / नया नमूना स्कैन करें',
    rejectedBoxText: '⚠️ अस्वीकृत: यह नमूना पार्थेनियम हिस्टेरोफोरस नहीं है। कुणपजल निर्माण हेतु अमान्य।',
    verifiedHeader: 'वर्गीकरण एवं जैव-सुरक्षा पुष्टि',
    speciesIdentityLabel: 'प्रजाति पहचान',
    toxinAssayLabel: 'सेस्क्यूटरपीन विष परख',
    digesterSuitabilityLabel: 'अवायवीय डाइजेस्टर शुद्धता',
    scanningText: 'जेमिनी विज़न एपीआई से वानस्पतिक विश्लेषण जारी है...',

    roiBadge: 'जैव-संसाधन अनुपात रूपांतरण इंजन',
    roiTitle: 'वृक्षायुर्वेद कृषि आरओआई एवं फॉर्मूलेशन इंजन',
    roiSubtitle:
      'किसी भी कृषि भूमि के लिए जैव-भार कटाई कोटा, सूक्ष्मजैविक आहार और रासायनिक उर्वरक बचत की सटीक गणना करें।',
    landholdingLabel: 'कृषि भूमि का आकार (एकड़)',
    chemicalSpendLabel: 'वर्तमान मौसमी उर्वरक खर्च (₹ / एकड़)',
    seasonalSavingsTitle: 'कुल मौसमी बचत',
    ureaBagsTitle: 'यूरिया की बचत (बैग)',
    foliarSprayTitle: 'तैयार पर्णीय छिड़काव घोल',
    co2PreventedTitle: 'सीओ2 उत्सर्जन की रोकथाम',
    nitrogenRunoffTitle: 'नाइट्रोजन बहाव की रोकथाम',
    stoichiometryTitle: 'स्टोइकोमेट्रिक जैव-पाचक इनपुट सामग्री',
    partheniumHarvestQuota: 'ताजा पार्थेनियम जैव-भार आवश्यकता',
    bosIndicusUrine: 'देसी गाय का ताजा गोमूत्र',
    unrefinedJaggery: 'कच्चा गुड़ (माइक्रोबियल ऊर्जा)',

    batchLogBadge: 'किण्वन काइनेटिक्स एवं गुणवत्ता आश्वासन',
    batchLogTitle: 'बैच किण्वन लॉग एवं पीएच वक्र ट्रैकर',
    batchLogSubtitle:
      '20-दिवसीय जैव-रासायनिक अपघटन पर नज़र रखें: अम्लीकरण वक्र (6.8 → 4.5) और दैनिक स्टिरिंग चेकलिस्ट।',
    phTrajectoryTitle: 'अम्लीकरण प्रक्षेपवक्र (पीएच 6.8 ➔ 4.5 ➔ 7.1)',
    stirringProtocolTitle: 'स्टिरिंग प्रोटोकॉल एवं गुणवत्ता चेकप्वाइंट',
    dayLabel: 'दिन',
    acidogenesisStage: 'एसिडोजेनेसिस एवं जल-अपघटन',
    proteolysisStage: 'अवायवीय प्रोटियोलिसिस',
    maturationStage: 'मीथेनोजेनेसिस एवं परिपक्वता',

    mapBadge: 'भू-स्थानिक कटाई रसद',
    mapTitle: 'पार्थेनियम आपूर्ति शृंखला मानचित्र',
    mapSubtitle:
      'विकेंद्रीकृत स्रोत टेलीमेट्री: किसान सहकारी समितियों को सक्रिय बायो-डाइजेस्टर गड्ढों से जोड़ना।',
    dropPinBtn: '📍 पिन लगाएं: पार्थेनियम क्लस्टर दर्ज करें',
    clustersActive: 'सक्रिय क्लस्टर',
    totalBiomass: 'कुल बायोमास',
    collectionHubsTitle: 'ग्राम संकलन केंद्र एवं प्रसंस्करण गड्ढे',
    reportInfestationModalTitle: 'नया पार्थेनियम प्रकोप क्लस्टर दर्ज करें',

    simulatorBadge: 'डिजिटल प्रयोगशाला // बायोटेक काइनेटिक्स सिमुलेटर',
    simulatorTitle: 'इंटरएक्टिव आणविक एवं प्रक्रिया तंत्र सिमुलेटर',
    simulatorSubtitle: 'सूक्ष्म केलेशन काइनेटिक्स एवं वृहद कृषि आपूर्ति श्रृंखला का सजीव अवलोकन करें।',
    tabChelation: '1. पार्थेनिन केलेशन एवं अमीनो एसिड बंधन',
    tabSynergy: '2. बायो-हाइब्रिड सिनर्जी लूप',
    driftSpeedLabel: 'कण गति दर:',
    kineticBreakdownTitle: 'काइनेटिक स्थिति विवरण',
    freePartheninLabel: 'मुक्त पार्थेनिन सेस्क्यूटरपीन:',
    lactoneCleavageLabel: 'लैक्टोन रिंग विखंडन:',
    aminoChelateLabel: 'स्थिर अमीनो-केलेट बॉन्ड:',
    substrateMatrixLabel: 'सब्सट्रेट मैट्रिक्स: सरसों + तिल की खली',
    surapalaTreatiseTitle: 'सुरपाल के वृक्षायुर्वेद का वनस्पति विकल्प',
    surapalaTreatiseText:
      'बूचड़खाने की पशु मज्जा के स्थान पर, विषैले पार्थेनियम लैक्टोन को किण्वन अम्लों द्वारा तोड़ा जाता है। वनस्पति अमीनो एसिड खनिजों को पौधों के लिए अवशोषित होने योग्य जैविक एनपीके में बांधते हैं।',
    molecularLegendTitle: 'आणविक एवं आवेश संकेत सूची:',
    partheninToxinNode: 'पार्थेनिन (विष) C₁₅H₂₀O₄',
    vegetalProteinNode: 'वनस्पति प्रोटीन स्थल NH₃⁺ / -SH',
    organicAcidsNode: 'जैविक अम्ल COO⁻ / H⁺',
    chelateComplexesNode: 'केलेटेड सम्मिश्र (शून्य आवेश)',
    macroLogisticsTitle: 'वृहद चक्रीय आपूर्ति एवं बायो-डाइजेस्टर रसद',
    biomassYieldLabel: 'बायोमास रूपांतरण दक्षता',
    npkParityLabel: 'एनपीके पोषक तत्व समानता',
    cationBioavailLabel: 'धनायन जैव-उपलब्धता (सीईसी)',
    zeroRawCostLabel: 'व्यावसायिक कच्चा माल लागत',

    pdfTitle: 'राष्ट्रीय बाल विज्ञान कांग्रेस (एनसीएससी 2026-27)',
    pdfSubtheme: 'उप-विषय 5: सतत विकास हेतु पारंपरिक ज्ञान प्रणाली (आईकेएस)',
    pdfDossierHeader: 'खरपतवार से समृद्धि: तकनीकी अनुसंधान एवं फॉर्मूलेशन रिपोर्ट',
    pdfDossierDesc: 'आक्रामक गाजर घास का विष-मुक्त जैविक कुणपजल खाद में विकेंद्रीकृत जैव-रूपांतरण',
    pdfProjectStatus: 'एनसीएससी फील्ड सत्यापित',
    pdfZone: 'पश्चिमी ओडिशा (कालाहांडी)',
    pdfReportDate: 'रिपोर्ट दिनांक',
    pdfIksRef: 'सुरपाल कृत वृक्षायुर्वेद',
    pdfSection1: '1. कृषि स्टोइकोमेट्री एवं जैव-रूपांतरण इनपुट',
    pdfSection2: '2. वित्तीय निवेश लाभ एवं कार्बन क्रेडिट',
    pdfSection3: '3. 20-दिवसीय नियंत्रित किण्वन गुणवत्ता एवं सुरक्षा मील के पत्थर',
    pdfSection4: '4. एन-पी-के-एस पोषक तत्व समानता अवलोकन (200 लीटर समतुल्य)',
    pdfSection5: '5. बायोसिक्योरिटी वर्गीकरण सत्यापन एवं अस्वीकृति प्रोटोकॉल',
    pdfSubstrateCol: 'इनपुट सामग्री',
    pdfRoleCol: 'जैव-रासायनिक / पारिस्थितिक भूमिका',
    pdfAllocCol: 'अनुपात आवंटन',
    pdfNutrientCol: 'पोषक तत्व',
    pdfKunapaCol: 'कुणपजल स्तर',
    pdfSynthCol: 'रासायनिक मानक',
    pdfMechCol: 'कृषि लाभ एवं प्रभाव',
    pdfSignInvestigator: 'विद्यार्थी शोधकर्ता हस्ताक्षर',
    pdfSignEvaluator: 'एनसीएससी मूल्यांकनकर्ता / मार्गदर्शक शिक्षक',
    pdfBiosecurityText:
      'कुणपजल डाइजेस्टर में उपयोग किए जाने वाले हर नमूने का जेमिनी विज़न एआई द्वारा स्वचालित वर्गीकरण सत्यापन किया जाता है। अवांछित नमूनों (पशु, पालतू जीव या गैर-पार्थेनियम प्रजातियों) को शुद्धता बनाए रखने हेतु तुरंत अस्वीकृत कर दिया जाता है।',
    pdfDocRef: 'दस्तावेज़ संदर्भ: NCSC-W2W-2026-KLH-01 | सहकर्मी सत्यापन: हुसैन आदि (2017) | भाकृअनुप दिशानिर्देश',
    pdfPrintPreviewBtn: 'प्रिंट / Ctrl+P',
    pdfDownloadBtn: 'पीडीएफ डाउनलोड करें (.pdf)',

    cropPredictorBadge: 'कृषि उपज एवं कार्बन अवशोषण मॉडल',
    cropPredictorTitle: 'फसल-विशिष्ट उपज वृद्धि एवं मृदा कार्बन (एसओसी) भविष्यवक्ता',
    cropPredictorSubtitle: 'पर्णीय कुणपजल तरल फॉर्मूलेशन के दोहराए गए परीक्षणों पर आधारित बहु-मौसमी कृषि अनुमान।',
    acresUnit: 'एकड़',
    bagsLabel: 'बैग',
    co2SparedLabel: 'सीओ2 उत्सर्जन की रोकथाम',
    currentNpkSpendLabel: 'वर्तमान रासायनिक एनपीके खर्च',
    projectedSavingsTitle: 'प्रत्याशित मौसमी बचत:',
    supplyMapTitle: 'पार्थेनियम भू-मानचित्र एवं जैव-रूपांतरण रसद',
    supplyMapSubtitle: 'कृषि गलियारों में आक्रामक पार्थेनियम कॉलोनियों की स्थानिक ट्रैकिंग। विकेंद्रीकृत कुणपजल बायो-रिएक्टरों के लिए वास्तविक समय रूटिंग।',
  },
  OD: {
    appName: 'ଅନାବନା ଘାସରୁ ଧନ',
    ncscBadge: 'ଏନସିଏସସି ୨୦୨୬-୨୭',
    tabDashboard: 'ଡ୍ୟାସବୋର୍ଡ',
    tabCalculator: 'ଫର୍ମୁଲେସନ ଇଞ୍ଜିନ',
    tabProtocol: 'ଏଆଇ ସ୍କାନର',
    tabMap: 'ଯୋଗାଣ ମାନଚିତ୍ର',
    exportPdfBtn: 'ପିଡିଏଫ ରିପୋର୍ଟ ଡାଉନଲୋଡ',
    citationsMatrixBtn: '📜 ଆଇକେଏସ ପ୍ରମାଣ ମାଟ୍ରିକ୍ସ',

    heroBadge: 'ମୁକ୍ତ କୃଷି-ଚକ୍ରୀୟ ପ୍ରଯୁକ୍ତି ବିଦ୍ୟା',
    heroHeadline: 'ବିଷାକ୍ତ କଂଗ୍ରେସ ଘାସରୁ ରାସାୟନିକ ଖତର ବିକଳ୍ପ।',
    heroSubheadline: 'ମିଶନ LiFE ଅନ୍ତର୍ଗତ ବୃକ୍ଷାୟୁର୍ବେଦ କୁଣପଜଳର ପ୍ରୟୋଗ। ଏନସିଏସସି ୨୦୨୬-୨୭ | ଉପ-ପ୍ରସଙ୍ଗ ୫।',
    heroDescription:
      'କଳାହାଣ୍ଡି ଜିଲ୍ଲାର କ୍ଷତିକାରକ ପାର୍ଥେନିୟମ (କଂଗ୍ରେସ ଘାସ)କୁ ଜୈବ-ରାସାୟନିକ ପଦ୍ଧତିରେ ପରିବର୍ତ୍ତନ କରି ଚାଷୀଙ୍କ ପାଇଁ ବିନା ଖର୍ଚ୍ଚରେ ଉତ୍କୃଷ୍ଟ ତରଳ ଜୈବିକ ସାର ପ୍ରସ୍ତୁତି।',
    heroExploreBtn: '୨୦-ଦିନିଆ ପଦ୍ଧତି ଦେଖନ୍ତୁ',
    heroCalculateBtn: 'ହିସାବ କରନ୍ତୁ',
    heroSupplyMapBtn: 'ଯୋଗାଣ ମାନଚିତ୍ର ଦେଖନ୍ତୁ',
    costTitle: 'ଫର୍ମୁଲେସନ ଖର୍ଚ୍ଚ',
    zeroCommercialRawInputs: 'ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା ସ୍ଥାନୀୟ ଉପାଦାନ',
    hundredPercentFree: '୧୦୦% ମାଗଣା',
    potencyTitle: 'ଏନପିକେ ପୋଷକତତ୍ତ୍ୱ ସମାନତା',
    potencySubtitle: '୦.୫% ରାସାୟନିକ ତୁଳନାରେ ୧୦୮.୭% ଅଧିକ କାର୍ଯ୍ୟକ୍ଷମ',
    provenAgroEfficacy: 'ପରୀକ୍ଷାଗାର ପ୍ରମାଣିତ',
    allelopathyTitle: 'ବିଷାକ୍ତତା ନିରାକରଣ',
    allelopathySubtitle: '୭ମ ଦିନରେ ୯୯.୮% ପାର୍ଥେନିନ ଲ୍ୟାକ୍ଟୋନ ନିଷ୍କ୍ରିୟ',
    sesquiterpeneHydrolysis: 'ନିରାପଦ ଅମ୍ଳୀୟ ଜୈବ-ବିଘଟନ',

    scannerBadge: 'ମାନକୀକୃତ ସୁରକ୍ଷା ଓ ଜୈବ-ପାଚନ ନିୟମାବଳୀ',
    scannerTitle: 'ଏଆଇ ଜୈବ-ସୁରକ୍ଷା ସ୍କାନର (ଜେମିନି ଭିଜନ ଏପିଆଇ)',
    scannerSubtitle:
      'ପାର୍ଥେନିୟମ ପତ୍ରର ବଟାନିକାଲ ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ କୁଣପଜଳ ପ୍ରସ୍ତୁତି ପାଇଁ ସୁରକ୍ଷିତ ଥିବା ନିଶ୍ଚିତ କରନ୍ତୁ।',
    scannerUploadBtn: 'ପତ୍ରର ଫଟୋ ଅପଲୋଡ କରନ୍ତୁ',
    scannerSamplePartheniumBtn: 'ପାର୍ଥେନିୟମ ପତ୍ର ପରୀକ୍ଷା',
    scannerSampleNonTargetBtn: 'ପ୍ରତ୍ୟାଖ୍ୟାନ ପରୀକ୍ଷା (ପଶୁ / ଅନ୍ୟ)',
    scannerResetBtn: 'ରିସେଟ / ଅନ୍ୟ ନମୁନା ସ୍କାନ କରନ୍ତୁ',
    rejectedBoxText: '⚠️ ପ୍ରତ୍ୟାଖ୍ୟାତ: ଏହା ପାର୍ଥେନିୟମ ପତ୍ର ନୁହେଁ। କୁଣପଜଳ ପାଇଁ ଅନୁପଯୁକ୍ତ।',
    verifiedHeader: 'ଜୈବ-ସୁରକ୍ଷା ଓ ପ୍ରଜାତି ନିଶ୍ଚିତକରଣ',
    speciesIdentityLabel: 'ଉଦ୍ଭିଦ ପ୍ରଜାତି',
    toxinAssayLabel: 'ବିଷାକ୍ତତା ମାପକ',
    digesterSuitabilityLabel: 'ଡାଇଜେଷ୍ଟର ଉପଯୋଗୀତା',
    scanningText: 'ଜେମିନି ଭିଜନ ଏଆଇ ଦ୍ୱାରା ପତ୍ରର ଯାଞ୍ଚ ଚାଲିଛି...',

    roiBadge: 'ଜୈବ-ଅନୁପାତ ରୂପାନ୍ତରଣ ଇଞ୍ଜିନ',
    roiTitle: 'ବୃକ୍ଷାୟୁର୍ବେଦ କୃଷି ଲାଭ ଓ ଫର୍ମୁଲେସନ ଇଞ୍ଜିନ',
    roiSubtitle:
      'ପାର୍ଥେନିୟମ ବାୟୋମାସ, ଗୋମୂତ୍ର ଓ ଗୁଡ଼ର ସଠିକ ପରିମାଣ ଏବଂ ରାସାୟନିକ ଖତ ଖର୍ଚ୍ଚ ବଞ୍ଚତ ହିସାବ କରନ୍ତୁ।',
    landholdingLabel: 'ଚାଷ ଜମି ପରିମାଣ (ଏକର)',
    chemicalSpendLabel: 'ଏକର ପିଛା ସାର ଖର୍ଚ୍ଚ (ଟଙ୍କା)',
    seasonalSavingsTitle: 'ଋତୁକାଳୀନ ମୋଟ ବଞ୍ଚତ',
    ureaBagsTitle: 'ୟୁରିଆ ସାର ବଞ୍ଚତ (ବସ୍ତା)',
    foliarSprayTitle: 'ପତ୍ର ସ୍ପ୍ରେ ପାଇଁ ପ୍ରସ୍ତୁତ ତରଳ',
    co2PreventedTitle: 'ଅଙ୍ଗାରକାମ୍ଳ ନିୟନ୍ତ୍ରଣ',
    nitrogenRunoffTitle: 'ଭୂତଳ ଜଳ ପ୍ରଦୂଷଣ ନିବାରଣ',
    stoichiometryTitle: 'କୁଣପଜଳ ପ୍ରସ୍ତୁତି ପାଇଁ ଆବଶ୍ୟକୀୟ ଉପାଦାନ',
    partheniumHarvestQuota: 'କଟା ହୋଇଥିବା ପାର୍ଥେନିୟମ ଘାସ',
    bosIndicusUrine: 'ଦେଶୀ ଗାଈର ତାଜା ଗୋମୂତ୍ର',
    unrefinedJaggery: 'ଦେଶୀ ଅପରିଶୋଧିତ ଗୁଡ଼',

    batchLogBadge: 'ଫର୍ମେଣ୍ଟେସନ ଗତିବିଧି ଓ ଗୁଣବତ୍ତା ଯାଞ୍ଚ',
    batchLogTitle: 'ବ୍ୟାଚ ଫର୍ମେଣ୍ଟେସନ ଲଗ ଓ ପିଏଚ ଟ୍ରାକର',
    batchLogSubtitle:
      '୨୦-ଦିନିଆ ଅମ୍ଳୀକରଣ ପ୍ରକ୍ରିୟା (୬.୮ → ୪.୫) ଏବଂ ଦୈନିକ ଘାଣ୍ଟିବା ଚେକଲିଷ୍ଟ ରେକର୍ଡ କରନ୍ତୁ।',
    phTrajectoryTitle: 'ଅମ୍ଳୀକରଣ ରେଖାଚିତ୍ର (ପିଏଚ ୬.୮ ➔ ୪.୫ ➔ ୭.୧)',
    stirringProtocolTitle: 'ଦୈନିକ ଘାଣ୍ଟିବା ନିୟମାବଳୀ ଓ ପରୀକ୍ଷଣ',
    dayLabel: 'ଦିନ',
    acidogenesisStage: 'ଅମ୍ଳୀକରଣ ଓ ବିଘଟନ ପର୍ଯ୍ୟାୟ',
    proteolysisStage: 'ପ୍ରୋଟିଓଲିସିସ ପର୍ଯ୍ୟାୟ',
    maturationStage: 'ପରିପକ୍ୱତା ପର୍ଯ୍ୟାୟ',

    mapBadge: 'ଭୌଗୋଳିକ ଯୋଗାଣ ବ୍ୟବସ୍ଥା',
    mapTitle: 'ପାର୍ଥେନିୟମ ଯୋଗାଣ ମାନଚିତ୍ର',
    mapSubtitle:
      'ଚାଷୀ ମାନଙ୍କ ସହ କୁଣପଜଳ ପ୍ରସ୍ତୁତି ଗାତକୁ ଯୋଡ଼ିବା ପାଇଁ ଲାଇଭ ଟେଲିମେଟ୍ରି ନେଟୱର୍କ।',
    dropPinBtn: '📍 ପିନ ଲଗାନ୍ତୁ: ପାର୍ଥେନିୟମ କ୍ଲଷ୍ଟର ଯୋଡ଼ନ୍ତୁ',
    clustersActive: 'ସକ୍ରିୟ କ୍ଲଷ୍ଟର',
    totalBiomass: 'ମୋଟ ବାୟୋମାସ',
    collectionHubsTitle: 'ଗ୍ରାମ୍ୟ ସଂଗ୍ରହ କେନ୍ଦ୍ର ଓ ପ୍ରକ୍ରିୟାକରଣ ଗାତ',
    reportInfestationModalTitle: 'ନୂତନ ପାର୍ଥେନିୟମ ଅଞ୍ଚଳ ରେକର୍ଡ କରନ୍ତୁ',

    simulatorBadge: 'ଡିଜିଟାଲ ପ୍ରୟୋଗଶାଳା // ଜୈବିକ ଅଣୁ ସିମୁଲେଟର',
    simulatorTitle: 'ଆଣବିକ କାଇନେଟିକ୍ସ ଓ ପ୍ରକ୍ରିୟା ସିମୁଲେଟର (ଡିଜିଟାଲ କ୍ୟାନଭାସ)',
    simulatorSubtitle: 'ସୂକ୍ଷ୍ମ କିଲେସନ ପ୍ରକ୍ରିୟା ଏବଂ ଜିଲ୍ଲା ସ୍ତରୀୟ ଯୋଗାଣ ବ୍ୟବସ୍ଥାର ଲାଇଭ ପ୍ରଦର୍ଶନ।',
    tabChelation: '୧. ପାର୍ଥେନିନ କିଲେସନ ଓ ଆମିନୋ ଏସିଡ଼ ସଂଯୋଗ',
    tabSynergy: '୨. ବାୟୋ-ହାଇବ୍ରିଡ ସିନର୍ଜି ଲୁପ',
    driftSpeedLabel: 'ଅଣୁ ଗତି ଦର:',
    kineticBreakdownTitle: 'ଆଣବିକ ପ୍ରଗତି ସ୍ଥିତି',
    freePartheninLabel: 'ମୁକ୍ତ ପାର୍ଥେନିନ ବିଷାକ୍ତତା:',
    lactoneCleavageLabel: 'ଲ୍ୟାକ୍ଟୋନ ରିଙ୍ଗ ବିଘଟନ:',
    aminoChelateLabel: 'ସ୍ଥିର ଆମିନୋ-କିଲେଟ ବନ୍ଧନ:',
    substrateMatrixLabel: 'ଉପାଦାନ: ସୋରିଷ + ରାଶି ପିଡ଼ିଆ',
    surapalaTreatiseTitle: 'ସୁରପାଳଙ୍କ ବୃକ୍ଷାୟୁର୍ବେଦ ଉଦ୍ଭିଦଜ ବିକଳ୍ପ',
    surapalaTreatiseText:
      'ପଶୁ ଚର୍ବି ବଦଳରେ ବିଷାକ୍ତ ପାର୍ଥେନିୟମ ଘାସକୁ ଜୈବିକ ଅମ୍ଳ ଦ୍ୱାରା ବିଘଟିତ କରାଯାଏ। ଉଦ୍ଭିଦଜ ଆମିନୋ ଏସିଡ଼ ଫସଲ ପାଇଁ ସହଜରେ ଗ୍ରହଣୀୟ ଏନପିକେ ସାର ତିଆରି କରେ।',
    molecularLegendTitle: 'ଆଣବିକ ଓ ଚାର୍ଜ ସୂଚୀ:',
    partheninToxinNode: 'ପାର୍ଥେନିନ (ବିଷ) C₁₅H₂₀O₄',
    vegetalProteinNode: 'ଉଦ୍ଭିଦ ପ୍ରୋଟିନ NH₃⁺ / -SH',
    organicAcidsNode: 'ଜୈବିକ ଅମ୍ଳ COO⁻ / H⁺',
    chelateComplexesNode: 'କିଲେଟ ସଂଯୋଗ (ଚାର୍ଜ ମୁକ୍ତ)',
    macroLogisticsTitle: 'ଜିଲ୍ଲା ସ୍ତରୀୟ ଯୋଗାଣ ଓ କୁଣପଜଳ ପାଚକ ବ୍ୟବସ୍ଥା',
    biomassYieldLabel: 'ବାୟୋମାସ ରୂପାନ୍ତରଣ ଦକ୍ଷତା',
    npkParityLabel: 'ଏନପିକେ ପୋଷକତତ୍ତ୍ୱ ସମାନତା',
    cationBioavailLabel: 'ଜୈବ-ଉପଲବ୍ଧତା (ସିଇସି)',
    zeroRawCostLabel: 'କଞ୍ଚାମାଲ ଖର୍ଚ୍ଚ',

    pdfTitle: 'ଜାତୀୟ ଶିଶୁ ବିଜ୍ଞାନ କଂଗ୍ରେସ (ଏନସିଏସସି ୨୦୨୬-୨୭)',
    pdfSubtheme: 'ଉପ-ପ୍ରସଙ୍ଗ ୫: ସ୍ଥାୟୀ ବିକାଶ ପାଇଁ ପାରମ୍ପରିକ ଜ୍ଞାନ କୌଶଳ (ଆଇକେଏସ)',
    pdfDossierHeader: 'ଅନାବନା ଘାସରୁ ଧନ: ବୈଷୟିକ ଗବେଷଣା ଓ ଫର୍ମୁଲେସନ ରିପୋର୍ଟ',
    pdfDossierDesc: 'କଳାହାଣ୍ଡିର କ୍ଷତିକାରକ ପାର୍ଥେନିୟମରୁ ବିଷମୁକ୍ତ ଜୈବିକ କୁଣପଜଳ ପ୍ରସ୍ତୁତି',
    pdfProjectStatus: 'ଏନସିଏସସି ଫିଲ୍ଡ ପ୍ରମାଣିତ',
    pdfZone: 'ପଶ୍ଚିମ ଓଡ଼ିଶା (କଳାହାଣ୍ଡି)',
    pdfReportDate: 'ରିପୋର୍ଟ ତାରିଖ',
    pdfIksRef: 'ସୁରପାଳଙ୍କ ବୃକ୍ଷାୟୁର୍ବେଦ',
    pdfSection1: '୧. କୃଷି ଷ୍ଟୋଇକିଓମେଟ୍ରି ଓ ଜୈବ-ରୂପାନ୍ତରଣ ଉପାଦାନ',
    pdfSection2: '୨. ଆର୍ଥିକ ଲାଭ ଓ ଅଙ୍ଗାରକାମ୍ଳ ନିୟନ୍ତ୍ରଣ କ୍ରେଡିଟ',
    pdfSection3: '୩. ୨୦-ଦିନିଆ ନିୟନ୍ତ୍ରିତ ଫର୍ମେଣ୍ଟେସନ ଗୁଣବତ୍ତା ଓ ସୁରକ୍ଷା ସୋପାନ',
    pdfSection4: '୪. ଏନ-ପି-କେ-ଏସ ପୋଷକତତ୍ତ୍ୱ ସମାନତା (୨୦୦ ଲିଟର ସମତୁଲ)',
    pdfSection5: '୫. ଜୈବ-ସୁରକ୍ଷା ପ୍ରଜାତି ଯାଞ୍ଚ ଓ ପ୍ରତ୍ୟାଖ୍ୟାନ ନିୟମାବଳୀ',
    pdfSubstrateCol: 'ବ୍ୟବହୃତ ଉପାଦାନ',
    pdfRoleCol: 'ଜୈବ-ରାସାୟନିକ ଭୂମିକା',
    pdfAllocCol: 'ଆବଣ୍ଟିତ ପରିମାଣ',
    pdfNutrientCol: 'ପୋଷକ ଉପାଦାନ',
    pdfKunapaCol: 'କୁଣପଜଳ ମାତ୍ରା',
    pdfSynthCol: 'ରାସାୟନିକ ମାନକ',
    pdfMechCol: 'କୃଷି ଉପକାରିତା ଓ ଫଳାଫଳ',
    pdfSignInvestigator: 'ଛାତ୍ର ଅନୁସନ୍ଧାନକାରୀଙ୍କ ଦସ୍ତଖତ',
    pdfSignEvaluator: 'ଏନସିଏସସି ମୂଲ୍ୟାୟନକାରୀ / ମାର୍ଗଦର୍ଶକ ଶିକ୍ଷକ',
    pdfBiosecurityText:
      'କୁଣପଜଳ ପ୍ରସ୍ତୁତି ଗାତରେ ପକାଯାଉଥିବା ପ୍ରତ୍ୟେକ ପତ୍ର ନମୁନାର ଜେମିନି ଭିଜନ ଏଆଇ ଦ୍ୱାରା ଯାଞ୍ଚ କରାଯାଏ। ଅନ୍ୟ କୌଣସି ଜୀବଜନ୍ତୁ କିମ୍ବା ଅନୁପଯୁକ୍ତ ଉଦ୍ଭିଦ ନମୁନାକୁ ତୁରନ୍ତ ପ୍ରତ୍ୟାଖ୍ୟାନ କରାଯାଏ।',
    pdfDocRef: 'ନଥି ସଂଖ୍ୟା: NCSC-W2W-2026-KLH-01 | ବିଶେଷଜ୍ଞ ସ୍ୱୀକୃତି: ହୁସେନ ପ୍ରମୁଖ (୨୦୧୭) | ଆଇସିଏଆର ନିର୍ଦ୍ଦେଶାବଳୀ',
    pdfPrintPreviewBtn: 'ପ୍ରିଣ୍ଟ / Ctrl+P',
    pdfDownloadBtn: 'ପିଡିଏଫ ଡାଉନଲୋଡ (.pdf)',

    cropPredictorBadge: 'କୃଷି ଉତ୍ପାଦନ ଓ ଅଙ୍ଗାରକାମ୍ଳ ସଂରକ୍ଷଣ ମଡେଲ',
    cropPredictorTitle: 'ଫସଲ-ଭିତ୍ତିକ ଅମଳ ବୃଦ୍ଧି ଓ ମୃତ୍ତିକା ଅଙ୍ଗାରକ (SOC) ଆକଳନ',
    cropPredictorSubtitle: 'କୁଣପଜଳ ତରଳ ପ୍ରୟୋଗ ସହିତ ପ୍ରମାଣିତ କ୍ଷେତ୍ର ପରୀକ୍ଷଣ ଉପରେ ଆଧାରିତ କୃଷି ଆକଳନ।',
    acresUnit: 'ଏକର',
    bagsLabel: 'ବସ୍ତା',
    co2SparedLabel: 'ଅଙ୍ଗାରକାମ୍ଳ ନିୟନ୍ତ୍ରଣ',
    currentNpkSpendLabel: 'ବର୍ତ୍ତମାନର ରାସାୟନିକ NPK ଖର୍ଚ୍ଚ',
    projectedSavingsTitle: 'ଆକଳିତ ଋତୁକାଳୀନ ବଞ୍ଚତ:',
    supplyMapTitle: 'ପାର୍ଥେନିୟମ ଭୂ-ମାନଚିତ୍ର ଓ ଜୈବ-ରୂପାନ୍ତରଣ ପରିବହନ ବ୍ୟବସ୍ଥା',
    supplyMapSubtitle: 'କୃଷି କ୍ଷେତ୍ରରେ କ୍ଷତିକାରକ ପାର୍ଥେନିୟମ ଅଞ୍ଚଳର ଲାଇଭ ଟ୍ରାକିଂ ଏବଂ କୁଣପଜଳ ବାୟୋ-ରିଆକ୍ଟରକୁ ପ୍ରେରଣ।',
  },
};
