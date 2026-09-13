export type ActiveTab = 'dashboard' | 'calculator' | 'protocol' | 'map';

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
}

export interface GeminiScanResult {
  verified: boolean;
  speciesName: string;
  commonName: string;
  confidence: number;
  rejectionReason?: string;
  toxinProfile: {
    partheninLevel: string;
    hydrolysisSafety: string;
    toxicAlkaloidDegradation: string;
  };
  biochemicalFindings: string;
  anaerobicSuitability: string;
  rawSummary?: string;
  source?: string;
}

export interface InfestationPin {
  id: number;
  lat: string;
  lng: string;
  label: string;
  severity: 'Critical' | 'Severe' | 'Moderate' | 'Harvested';
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
