export type ActiveTab = 'dashboard' | 'calculator' | 'protocol' | 'map';

export type LanguageCode = 'EN' | 'HI' | 'OD';

export type ScanStatus = 'VERIFIED_PARTHENIUM' | 'REJECTED_INVALID';

export interface LabTrialCohort {
  name: string;
  isPrimary?: boolean;
  shootLength: string;
  rootLength: string;
  spadChlorophyll: string;
  meanDryBiomass: string;
}

export interface FormulationCalculations {
  acres: number;
  spendPerAcre: number;
  partheniumKg: number;
  urineLiters: number;
  jaggeryKg: number;
  savings: number;
  ureaBagsEliminated: number;
  syntheticRunoffAvoidedKg: number;
  co2PreventedKg: number;
}

export interface GeminiScanResult {
  status: ScanStatus;
  confidence: number;
  toxin_level: string;
  notes: string;
  verified?: boolean;
  speciesName?: string;
  commonName?: string;
  rejectionReason?: string;
  toxinProfile?: {
    partheninLevel: string;
    hydrolysisSafety: string;
    toxicAlkaloidDegradation: string;
  };
  biochemicalFindings?: string;
  anaerobicSuitability?: string;
  rawSummary?: string;
  source?: string;
}

export interface InfestationPin {
  id: number;
  lat: string;
  lng: string;
  label: string;
  severity: 'Critical' | 'Severe' | 'Moderate' | 'Low' | 'Harvested';
  biomassTons: number;
  reportedDate: string;
  harvestVolunteerGroup: string;
}

export interface FermentationPhase {
  phaseNumber: number;
  dayRange: string;
  title: string;
  scientificMechanism: string;
  type: 'warning' | 'neutral' | 'secure';
  boxTitle: string;
  boxContent: string;
  targetPh: string;
  targetTemp: string;
  microbialAgents: string[];
}

export interface DailyStirringLog {
  day: number;
  targetPh: number;
  actualPh?: number;
  stirred: boolean;
  phase: string;
  instructions: string;
}
