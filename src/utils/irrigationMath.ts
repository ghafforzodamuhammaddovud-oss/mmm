export interface GeneralInputs {
  region: string;
  pumpStage: 1 | 2 | 3 | 4 | 5;
  totalAreaHa: number;
  electricityTariff: number;
  waterTariff: number;
  efficiencyEta: number;
}

export interface CropRow {
  id: string;
  name: string;
  sharePercent: number;
  waterNormM3PerHa: number;
  profitPerHa: number;
  sellingPricePerTon: number;
  yieldTonPerHa: number;
}

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface CropContribution {
  id: string;
  name: string;
  sharePercent: number;
  areaHa: number;
  waterVolumeM3: number;
  waterCostSom: number;
  grossProfitSom: number;
  netProfitSom: number;
}

export interface IrrigationResults {
  headMeters: number;
  energyPerM3Kwh: number;
  energyCostPerM3Som: number;
  totalWaterCostPerM3Som: number;
  avgWaterNormM3PerHa: number;
  totalWaterVolumeM3: number;
  totalWaterCostSom: number;
  avgNetIncomePerHaSom: number;
  totalGrossProfitSom: number;
  totalNetProfitThousandSom: number;
  waterEfficiencySomPerM3: number;
  shareSumPercent: number;
  isShareSumValid: boolean;
  validationIssues: ValidationIssue[];
  cropContributions: CropContribution[];
}

export const PUMP_STAGE_HEAD_MAP: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 20,
  2: 30,
  3: 40,
  4: 50,
  5: 60,
};

export const DEFAULT_GENERAL_INPUTS: GeneralInputs = {
  region: 'Восеъ',
  pumpStage: 5,
  totalAreaHa: 50.0,
  electricityTariff: 0.1436,
  waterTariff: 0.05,
  efficiencyEta: 0.65,
};

export const DEFAULT_CROPS: CropRow[] = [
  {
    id: 'cotton',
    name: 'Пахта',
    sharePercent: 30,
    waterNormM3PerHa: 7500,
    profitPerHa: 11590,
    sellingPricePerTon: 7000,
    yieldTonPerHa: 3.55,
  },
  {
    id: 'watermelon',
    name: 'Тарбуз',
    sharePercent: 30,
    waterNormM3PerHa: 4500,
    profitPerHa: 35214,
    sellingPricePerTon: 1200,
    yieldTonPerHa: 45,
  },
  {
    id: 'alfalfa',
    name: 'Беда',
    sharePercent: 20,
    waterNormM3PerHa: 9500,
    profitPerHa: 10840,
    sellingPricePerTon: 1800,
    yieldTonPerHa: 16.5,
  },
  {
    id: 'potato',
    name: 'Картошка',
    sharePercent: 20,
    waterNormM3PerHa: 6000,
    profitPerHa: 43452,
    sellingPricePerTon: 2500,
    yieldTonPerHa: 22,
  },
];

export function getPumpHeadMeters(stage: number): number {
  if (stage === 1 || stage === 2 || stage === 3 || stage === 4 || stage === 5) {
    return PUMP_STAGE_HEAD_MAP[stage];
  }
  const clamped = Math.min(5, Math.max(1, Math.round(stage || 1))) as 1 | 2 | 3 | 4 | 5;
  return PUMP_STAGE_HEAD_MAP[clamped];
}

function safeNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function validateInputs(inputs: GeneralInputs, crops: CropRow[]): {
  issues: ValidationIssue[];
  shareSumPercent: number;
  isShareSumValid: boolean;
} {
  const issues: ValidationIssue[] = [];

  if (!inputs.region.trim()) {
    issues.push({
      field: 'region',
      message: 'Номи минтақаи обёрӣ ё ноҳияро ворид кунед.',
    });
  }

  if (!Number.isFinite(inputs.totalAreaHa) || inputs.totalAreaHa <= 0) {
    issues.push({
      field: 'totalAreaHa',
      message: 'Майдони умумии замин бояд аз 0 зиёд бошад.',
    });
  }

  if (!Number.isFinite(inputs.electricityTariff) || inputs.electricityTariff < 0) {
    issues.push({
      field: 'electricityTariff',
      message: 'Тарифи қувваи барқ наметавонад манфӣ бошад.',
    });
  }

  if (!Number.isFinite(inputs.waterTariff) || inputs.waterTariff < 0) {
    issues.push({
      field: 'waterTariff',
      message: 'Тарифи об наметавонад манфӣ бошад.',
    });
  }

  if (!Number.isFinite(inputs.efficiencyEta) || inputs.efficiencyEta <= 0 || inputs.efficiencyEta > 1) {
    issues.push({
      field: 'efficiencyEta',
      message: 'КПД агрегат (η) бояд байни 0.01 ва 1.00 бошад.',
    });
  }

  if (crops.length === 0) {
    issues.push({
      field: 'crops',
      message: 'Ҳадди ақал як зироат бояд дар ҷадвал мавҷуд бошад.',
    });
  }

  let shareSumPercent = 0;
  for (const crop of crops) {
    const share = safeNumber(crop.sharePercent);
    shareSumPercent += share;

    const label = crop.name.trim() || 'Зироати беном';
    if (!crop.name.trim()) {
      issues.push({
        field: `crop-${crop.id}-name`,
        message: 'Номи зироат наметавонад холӣ бошад.',
      });
    }
    if (!Number.isFinite(crop.sharePercent) || crop.sharePercent < 0) {
      issues.push({
        field: `crop-${crop.id}-share`,
        message: `Ҳиссаи кишти «${label}» наметавонад манфӣ бошад.`,
      });
    }
    if (!Number.isFinite(crop.waterNormM3PerHa) || crop.waterNormM3PerHa < 0) {
      issues.push({
        field: `crop-${crop.id}-water`,
        message: `Меъёри оби «${label}» наметавонад манфӣ бошад.`,
      });
    }
    if (!Number.isFinite(crop.profitPerHa)) {
      issues.push({
        field: `crop-${crop.id}-profit`,
        message: `Фоида аз 1 га барои «${label}» нодуруст аст.`,
      });
    }
    if (!Number.isFinite(crop.sellingPricePerTon) || crop.sellingPricePerTon < 0) {
      issues.push({
        field: `crop-${crop.id}-price`,
        message: `Нархи фурӯши «${label}» наметавонад манфӣ бошад.`,
      });
    }
    if (!Number.isFinite(crop.yieldTonPerHa) || crop.yieldTonPerHa < 0) {
      issues.push({
        field: `crop-${crop.id}-yield`,
        message: `Ҳосилнокии «${label}» наметавонад манфӣ бошад.`,
      });
    }
  }

  const roundedShareSum = Math.round(shareSumPercent * 1000) / 1000;
  const isShareSumValid = crops.length > 0 && Math.abs(roundedShareSum - 100) <= 0.01;

  if (crops.length > 0 && !isShareSumValid) {
    issues.push({
      field: 'shareSum',
      message: `Ҷамъи ҳиссаҳои кишт бояд 100% бошад (ҳоло: ${roundedShareSum.toFixed(1).replace(/\.0$/, '')}%).`,
    });
  }

  return {
    issues,
    shareSumPercent: roundedShareSum,
    isShareSumValid,
  };
}

export function calculateIrrigationMetrics(
  inputs: GeneralInputs,
  crops: CropRow[]
): IrrigationResults {
  const { issues, shareSumPercent, isShareSumValid } = validateInputs(inputs, crops);

  const headMeters = getPumpHeadMeters(inputs.pumpStage);
  const safeEta = inputs.efficiencyEta > 0 && Number.isFinite(inputs.efficiencyEta)
    ? inputs.efficiencyEta
    : 0.65;
  const safeArea = inputs.totalAreaHa > 0 && Number.isFinite(inputs.totalAreaHa)
    ? inputs.totalAreaHa
    : 0;
  const safeElecTariff = Math.max(0, safeNumber(inputs.electricityTariff));
  const safeWaterTariff = Math.max(0, safeNumber(inputs.waterTariff));

  // Энергияи зарурӣ барои 1 м³ ≈ (H * 9.81) / (η * 3600) кВт·ч
  const energyPerM3Kwh = (headMeters * 9.81) / (safeEta * 3600);
  const energyCostPerM3Som = energyPerM3Kwh * safeElecTariff;
  const totalWaterCostPerM3Som = energyCostPerM3Som + safeWaterTariff;

  let avgWaterNormM3PerHa = 0;
  let avgNetIncomePerHaSom = 0;

  for (const crop of crops) {
    const shareRatio = Math.max(0, safeNumber(crop.sharePercent)) / 100;
    const waterNorm = Math.max(0, safeNumber(crop.waterNormM3PerHa));
    const profitPerHa = safeNumber(crop.profitPerHa);

    avgWaterNormM3PerHa += shareRatio * waterNorm;
    avgNetIncomePerHaSom += shareRatio * profitPerHa;
  }

  const totalWaterVolumeM3 = safeArea * avgWaterNormM3PerHa;
  const totalWaterCostSom = totalWaterVolumeM3 * totalWaterCostPerM3Som;
  const totalGrossProfitSom = avgNetIncomePerHaSom * safeArea;
  const totalNetProfitThousandSom = (totalGrossProfitSom - totalWaterCostSom) / 1000;
  const waterEfficiencySomPerM3 =
    avgWaterNormM3PerHa > 0 ? avgNetIncomePerHaSom / avgWaterNormM3PerHa : 0;

  const cropContributions: CropContribution[] = crops.map((crop) => {
    const shareRatio = Math.max(0, safeNumber(crop.sharePercent)) / 100;
    const areaHa = safeArea * shareRatio;
    const waterVolumeM3 = areaHa * Math.max(0, safeNumber(crop.waterNormM3PerHa));
    const waterCostSom = waterVolumeM3 * totalWaterCostPerM3Som;
    const grossProfitSom = areaHa * safeNumber(crop.profitPerHa);
    const netProfitSom = grossProfitSom - waterCostSom;

    return {
      id: crop.id,
      name: crop.name.trim() || 'Зироат',
      sharePercent: safeNumber(crop.sharePercent),
      areaHa,
      waterVolumeM3,
      waterCostSom,
      grossProfitSom,
      netProfitSom,
    };
  });

  return {
    headMeters,
    energyPerM3Kwh,
    energyCostPerM3Som,
    totalWaterCostPerM3Som,
    avgWaterNormM3PerHa,
    totalWaterVolumeM3,
    totalWaterCostSom,
    avgNetIncomePerHaSom,
    totalGrossProfitSom,
    totalNetProfitThousandSom,
    waterEfficiencySomPerM3,
    shareSumPercent,
    isShareSumValid,
    validationIssues: issues,
    cropContributions,
  };
}

export function formatNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '0';
  const fixed = value.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
}
