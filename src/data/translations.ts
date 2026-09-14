import { LanguageCode } from '../types';

export interface Translations {
  appName: string;
  ncscBadge: string;
  tabDashboard: string;
  tabCalculator: string;
  tabProtocol: string;
  tabMap: string;
  exportPdfBtn: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  btnExplore: string;
  btnCalculate: string;
  btnSupplyMap: string;
  scannerBadge: string;
  scannerTitle: string;
  scannerSubtitle: string;
  scannerUploadBtn: string;
  scannerSamplePartheniumBtn: string;
  scannerSampleNonTargetBtn: string;
  scannerResetBtn: string;
  rejectedBoxText: string;
  verifiedHeader: string;
  roiBadge: string;
  roiTitle: string;
  roiSubtitle: string;
  co2PreventedTitle: string;
  batchLogBadge: string;
  batchLogTitle: string;
  batchLogSubtitle: string;
  mapBadge: string;
  mapTitle: string;
  mapSubtitle: string;
  dropPinBtn: string;
  clustersActive: string;
  totalBiomass: string;
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
    heroBadge: 'NCSC 2026-27 | SUB-THEME 5: INDIGENOUS KNOWLEDGE SYSTEMS (IKS)',
    heroTitle: 'From Toxic Weed to Wealth: Vrikshayurveda Kunapajala Bio-Conversion',
    heroSubtitle:
      'A decentralized open-science framework converting invasive Parthenium hysterophorus into fortified, allelopathy-neutralized liquid organic fertilizer.',
    btnExplore: 'Explore 20-Day Protocol',
    btnCalculate: 'Calculate Formulation',
    btnSupplyMap: 'View Supply Map',
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
    roiBadge: 'BIO-RESOURCE RATIO CONVERSION ENGINE',
    roiTitle: 'Vrikshayurveda Agronomic ROI & Formulation Engine',
    roiSubtitle:
      'Compute stoichiometric biomass harvesting quotas, microbial carbohydrate feeds, and baseline synthetic expenditure offsets for any agrarian landholding.',
    co2PreventedTitle: 'CO2 Prevented',
    batchLogBadge: 'FERMENTATION KINETICS & QUALITY ASSURANCE',
    batchLogTitle: 'Batch Fermentation Log & pH Curve Tracker',
    batchLogSubtitle:
      'Monitor the 20-day biochemical breakdown: follow the real-time acidification trajectory (6.8 → 4.5) and record daily manual stirring tasks.',
    mapBadge: 'GEOSPATIAL HARVEST LOGISTICS',
    mapTitle: 'Parthenium Supply Chain Geo-Map',
    mapSubtitle:
      'Decentralized sourcing telemetry: connecting farmer cooperatives with active bio-digester pits across the district.',
    dropPinBtn: '📍 Drop Pin: Report Parthenium Infestation Cluster',
    clustersActive: 'Infestation Clusters',
    totalBiomass: 'Total Biomass',
  },
  HI: {
    appName: 'खरपतवार से समृद्धि',
    ncscBadge: 'एनसीएससी 2026-27',
    tabDashboard: 'डैशबोर्ड',
    tabCalculator: 'फॉर्मूलेशन इंजन',
    tabProtocol: 'एआई स्कैनर',
    tabMap: 'सप्लाई मैप',
    exportPdfBtn: 'पीडीएफ रिपोर्ट निर्यात',
    heroBadge: 'एनसीएससी 2026-27 | उप-विषय 5: पारंपरिक ज्ञान प्रणाली (आईकेएस)',
    heroTitle: 'विषैले खरपतवार से समृद्धि: वृक्षायुर्वेद कुणपजल जैव-रूपांतरण',
    heroSubtitle:
      'आक्रामक गाजर घास (पार्थेनियम) को विष-मुक्त, पोषक तत्वों से भरपूर तरल जैविक कुणपजल खाद में बदलने का वैज्ञानिक ढांचा।',
    btnExplore: '20-दिवसीय प्रोटोकॉल देखें',
    btnCalculate: 'फॉर्मूलेशन गणना करें',
    btnSupplyMap: 'सप्लाई मैप देखें',
    scannerBadge: 'मानकीकृत सुरक्षा एवं जैव-पाचन प्रोटोकॉल',
    scannerTitle: 'एआई बायोसिक्योरिटी स्कैनर (जेमिनी विज़न एपीआई)',
    scannerSubtitle:
      'पार्थेनियम हिस्टेरोफोरस पत्ती की वानस्पतिक पुष्टि करें और सत्यापित करें कि यह कुणपजल जैव-पाचन के लिए सुरक्षित है।',
    scannerUploadBtn: 'पत्ती की तस्वीर अपलोड करें',
    scannerSamplePartheniumBtn: 'पार्थेनियम नमूना टेस्ट',
    scannerSampleNonTargetBtn: 'अस्वीकृति टेस्ट (पशु / अन्य)',
    scannerResetBtn: 'रीसेट / नया नमूना स्कैन करें',
    rejectedBoxText: '⚠️ REJECTED: Specimen is not Parthenium hysterophorus. Ineligible for Kunapajala processing.',
    verifiedHeader: 'वर्गीकरण एवं जैव-सुरक्षा पुष्टि',
    roiBadge: 'जैव-संसाधन अनुपात रूपांतरण इंजन',
    roiTitle: 'वृक्षायुर्वेद कृषि आरओआई एवं फॉर्मूलेशन इंजन',
    roiSubtitle:
      'जैव-भार कटाई कोटा, सूक्ष्मजैविक आहार और रासायनिक उर्वरक बचत की सटीक गणना करें।',
    co2PreventedTitle: 'सीओ2 उत्सर्जन की रोकथाम',
    batchLogBadge: 'किण्वन काइनेटिक्स एवं गुणवत्ता आश्वासन',
    batchLogTitle: 'बैच किण्वन लॉग एवं पीएच वक्र ट्रैकर',
    batchLogSubtitle:
      '20-दिवसीय जैव-रासायनिक अपघटन पर नज़र रखें: अम्लीकरण वक्र (6.8 → 4.5) और दैनिक स्टिरिंग चेकलिस्ट।',
    mapBadge: 'भू-स्थानिक कटाई रसद',
    mapTitle: 'पार्थेनियम आपूर्ति शृंखला मानचित्र',
    mapSubtitle:
      'विकेंद्रीकृत स्रोत टेलीमेट्री: किसान सहकारी समितियों को सक्रिय बायो-डाइजेस्टर गड्ढों से जोड़ना।',
    dropPinBtn: '📍 पिन लगाएं: पार्थेनियम क्लस्टर दर्ज करें',
    clustersActive: 'सक्रिय क्लस्टर',
    totalBiomass: 'कुल बायोमास',
  },
  OD: {
    appName: 'ଅନାବନା ଘାସରୁ ଧନ',
    ncscBadge: 'ଏନସିଏସସି ୨୦୨୬-୨୭',
    tabDashboard: 'ଡ୍ୟାସବୋର୍ଡ',
    tabCalculator: 'ଫର୍ମୁଲେସନ ଇଞ୍ଜିନ',
    tabProtocol: 'ଏଆଇ ସ୍କାନର',
    tabMap: 'ଯୋଗାଣ ମାନଚିତ୍ର',
    exportPdfBtn: 'ପିଡିଏଫ ରିପୋର୍ଟ ଡାଉନଲୋଡ',
    heroBadge: 'ଏନସିଏସସି ୨୦୨୬-୨୭ | ଉପ-ପ୍ରସଙ୍ଗ ୫: ପାରମ୍ପରିକ ଜ୍ଞାନ କୌଶଳ (ଆଇକେଏସ)',
    heroTitle: 'ବିଷାକ୍ତ କଂଗ୍ରେସ ଘାସରୁ ସମୃଦ୍ଧି: ବୃକ୍ଷାୟୁର୍ବେଦ କୁଣପଜଳ ଜୈବ-ରୂପାନ୍ତରଣ',
    heroSubtitle:
      'କଳାହାଣ୍ଡି ଜିଲ୍ଲାର କ୍ଷତିକାରକ ପାର୍ଥେନିୟମ ଘାସକୁ ଜୈବିକ କୁଣପଜଳ ସାରରେ ପରିଣତ କରିବାର ନୂତନ ଜ୍ଞାନକୌଶଳ।',
    btnExplore: '୨୦-ଦିନିଆ ପଦ୍ଧତି ଦେଖନ୍ତୁ',
    btnCalculate: 'ହିସାବ କରନ୍ତୁ',
    btnSupplyMap: 'ଯୋଗାଣ ମାନଚିତ୍ର ଦେଖନ୍ତୁ',
    scannerBadge: 'ମାନକୀକୃତ ସୁରକ୍ଷା ଓ ଜୈବ-ପାଚନ ନିୟମାବଳୀ',
    scannerTitle: 'ଏଆଇ ଜୈବ-ସୁରକ୍ଷା ସ୍କାନର (ଜେମିନି ଭିଜନ ଏପିଆଇ)',
    scannerSubtitle:
      'ପାର୍ଥେନିୟମ ପତ୍ରର ବଟାନିକାଲ ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ କୁଣପଜଳ ପ୍ରସ୍ତୁତି ପାଇଁ ସୁରକ୍ଷିତ ଥିବା ନିଶ୍ଚିତ କରନ୍ତୁ।',
    scannerUploadBtn: 'ପତ୍ରର ଫଟୋ ଅପଲୋଡ କରନ୍ତୁ',
    scannerSamplePartheniumBtn: 'ପାର୍ଥେନିୟମ ପତ୍ର ପରୀକ୍ଷା',
    scannerSampleNonTargetBtn: 'ପ୍ରତ୍ୟାଖ୍ୟାନ ପରୀକ୍ଷା (ପଶୁ / ଅନ୍ୟ)',
    scannerResetBtn: 'ରିସେଟ / ଅନ୍ୟ ନମୁନା ସ୍କାନ କରନ୍ତୁ',
    rejectedBoxText: '⚠️ REJECTED: Specimen is not Parthenium hysterophorus. Ineligible for Kunapajala processing.',
    verifiedHeader: 'ଜୈବ-ସୁରକ୍ଷା ଓ ପ୍ରଜାତି ନିଶ୍ଚିତକରଣ',
    roiBadge: 'ଜୈବ-ଅନୁପାତ ରୂପାନ୍ତରଣ ଇଞ୍ଜିନ',
    roiTitle: 'ବୃକ୍ଷାୟୁର୍ବେଦ କୃଷି ଲାଭ ଓ ଫର୍ମୁଲେସନ ଇଞ୍ଜିନ',
    roiSubtitle:
      'ପାର୍ଥେନିୟମ ବାୟୋମାସ, ଗୋମୂତ୍ର ଓ ଗୁଡ଼ର ସଠିକ ପରିମାଣ ଏବଂ ରାସାୟନିକ ଖତ ଖର୍ଚ୍ଚ ବଞ୍ଚତ ହିସାବ କରନ୍ତୁ।',
    co2PreventedTitle: 'ଅଙ୍ଗାରକାମ୍ଳ ନିୟନ୍ତ୍ରଣ',
    batchLogBadge: 'ଫର୍ମେଣ୍ଟେସନ ଗତିବିଧି ଓ ଗୁଣବତ୍ତା ଯାଞ୍ଚ',
    batchLogTitle: 'ବ୍ୟାଚ ଫର୍ମେଣ୍ଟେସନ ଲଗ ଓ ପିଏଚ ଟ୍ରାକର',
    batchLogSubtitle:
      '୨୦-ଦିନିଆ ଅମ୍ଳୀକରଣ ପ୍ରକ୍ରିୟା (୬.୮ → ୪.୫) ଏବଂ ଦୈନିକ ଘାଣ୍ଟିବା ଚେକଲିଷ୍ଟ ରେକର୍ଡ କରନ୍ତୁ।',
    mapBadge: 'ଭୌଗୋଳିକ ଯୋଗାଣ ବ୍ୟବସ୍ଥା',
    mapTitle: 'ପାର୍ଥେନିୟମ ଯୋଗାଣ ମାନଚିତ୍ର',
    mapSubtitle:
      'ଚାଷୀ ମାନଙ୍କ ସହ କୁଣପଜଳ ପ୍ରସ୍ତୁତି ଗାତକୁ ଯୋଡ଼ିବା ପାଇଁ ଲାଇଭ ଟେଲିମେଟ୍ରି ନେଟୱର୍କ।',
    dropPinBtn: '📍 ପିନ ଲଗାନ୍ତୁ: ପାର୍ଥେନିୟମ କ୍ଲଷ୍ଟର ଯୋଡ଼ନ୍ତୁ',
    clustersActive: 'ସକ୍ରିୟ କ୍ଲଷ୍ଟର',
    totalBiomass: 'ମୋଟ ବାୟୋମାସ',
  },
};
