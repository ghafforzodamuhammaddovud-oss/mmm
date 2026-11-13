import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_CROPS,
  DEFAULT_GENERAL_INPUTS,
  calculateIrrigationMetrics,
  formatNumber,
  getPumpHeadMeters,
} from './irrigationMath';

test('getPumpHeadMeters maps stages 1..5 accurately', () => {
  assert.equal(getPumpHeadMeters(1), 20);
  assert.equal(getPumpHeadMeters(2), 30);
  assert.equal(getPumpHeadMeters(3), 40);
  assert.equal(getPumpHeadMeters(4), 50);
  assert.equal(getPumpHeadMeters(5), 60);
});

test('calculateIrrigationMetrics computes exact default Vose values', () => {
  const res = calculateIrrigationMetrics(DEFAULT_GENERAL_INPUTS, DEFAULT_CROPS);

  assert.equal(res.headMeters, 60);
  assert.equal(res.shareSumPercent, 100);
  assert.equal(res.isShareSumValid, true);
  assert.equal(res.validationIssues.length, 0);

  // Energy per m3 = (60 * 9.81) / (0.65 * 3600) = 588.6 / 2340 = 0.2515384615...
  assert.ok(Math.abs(res.energyPerM3Kwh - 588.6 / 2340) < 1e-9);

  // Unit water cost = energy * 0.1436 + 0.05 = 0.0861209230769...
  const expectedUnitCost = (588.6 / 2340) * 0.1436 + 0.05;
  assert.ok(Math.abs(res.totalWaterCostPerM3Som - expectedUnitCost) < 1e-9);

  // Avg water norm = 0.3*7500 + 0.3*4500 + 0.2*9500 + 0.2*6000 = 6700
  assert.equal(res.avgWaterNormM3PerHa, 6700);

  // Avg net income per ha = 0.3*11590 + 0.3*35214 + 0.2*10840 + 0.2*43452 = 24899.6
  assert.ok(Math.abs(res.avgNetIncomePerHaSom - 24899.6) < 1e-6);

  // Total water cost = 50 * 6700 * expectedUnitCost = 28850.50923...
  const expectedWaterCost = 50 * 6700 * expectedUnitCost;
  assert.ok(Math.abs(res.totalWaterCostSom - expectedWaterCost) < 1e-6);

  // Total net profit (thousand somoni) = (24899.6 * 50 - expectedWaterCost) / 1000
  const expectedNetThousand = (24899.6 * 50 - expectedWaterCost) / 1000;
  assert.ok(Math.abs(res.totalNetProfitThousandSom - expectedNetThousand) < 1e-6);
  assert.equal(formatNumber(res.totalNetProfitThousandSom, 2), '1 216.13');

  // Efficiency = 24899.6 / 6700 = 3.716358...
  assert.ok(Math.abs(res.waterEfficiencySomPerM3 - 24899.6 / 6700) < 1e-6);
});

test('changing pump stage lowers head and water cost', () => {
  const stage2 = calculateIrrigationMetrics(
    { ...DEFAULT_GENERAL_INPUTS, pumpStage: 2 },
    DEFAULT_CROPS
  );
  const stage5 = calculateIrrigationMetrics(DEFAULT_GENERAL_INPUTS, DEFAULT_CROPS);

  assert.equal(stage2.headMeters, 30);
  assert.ok(stage2.totalWaterCostPerM3Som < stage5.totalWaterCostPerM3Som);
  assert.ok(stage2.totalWaterCostSom < stage5.totalWaterCostSom);
  assert.ok(stage2.totalNetProfitThousandSom > stage5.totalNetProfitThousandSom);
});

test('validation catches share sum mismatch and negative inputs', () => {
  const modifiedCrops = DEFAULT_CROPS.map((crop, idx) =>
    idx === 0 ? { ...crop, sharePercent: 45 } : crop
  );

  const res = calculateIrrigationMetrics(
    {
      ...DEFAULT_GENERAL_INPUTS,
      totalAreaHa: -10,
      waterTariff: -0.02,
      efficiencyEta: 1.2,
    },
    modifiedCrops
  );

  assert.equal(res.shareSumPercent, 115);
  assert.equal(res.isShareSumValid, false);
  assert.ok(res.validationIssues.some((i) => i.field === 'shareSum'));
  assert.ok(res.validationIssues.some((i) => i.field === 'totalAreaHa'));
  assert.ok(res.validationIssues.some((i) => i.field === 'waterTariff'));
  assert.ok(res.validationIssues.some((i) => i.field === 'efficiencyEta'));
});

test('handles empty crops list gracefully without NaN or Infinity', () => {
  const res = calculateIrrigationMetrics(DEFAULT_GENERAL_INPUTS, []);

  assert.equal(res.avgWaterNormM3PerHa, 0);
  assert.equal(res.waterEfficiencySomPerM3, 0);
  assert.equal(res.totalWaterCostSom, 0);
  assert.equal(res.totalNetProfitThousandSom, 0);
  assert.equal(res.isShareSumValid, false);
  assert.ok(Number.isFinite(res.totalWaterCostPerM3Som));
});
