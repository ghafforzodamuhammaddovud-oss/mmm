import React from 'react';
import { IrrigationResults, formatNumber } from '../utils/irrigationMath';

interface ResultsCardProps {
  region: string;
  totalAreaHa: number;
  efficiencyEta: number;
  electricityTariff: number;
  waterTariff: number;
  results: IrrigationResults;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({
  region,
  totalAreaHa,
  efficiencyEta,
  electricityTariff,
  waterTariff,
  results,
}) => {
  const maxContributionNet = Math.max(
    1,
    ...results.cropContributions.map((c) => Math.abs(c.netProfitSom))
  );

  const displayAreaHa = totalAreaHa > 0 ? totalAreaHa : 0;

  return (
    <section
      aria-labelledby="part-3-heading"
      className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold text-emerald-700 tracking-wide">
              Қисми 3
            </p>
            <h2
              id="part-3-heading"
              className="text-lg font-bold text-slate-900 mt-0.5"
            >
              Натиҷаҳои ҳисоб
            </h2>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>{region.trim() || 'Ноҳия'}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{formatNumber(displayAreaHa, 2)} га</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">H = {results.headMeters} м</span>
          </div>
        </div>

        {/* Hero KPI — ФОИДАИ ХОЛИСИ УМУМӢ */}
        <div className="mt-5 p-5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Фоидаи холиси умумӣ
            </p>
            <div className="mt-1.5 flex items-baseline gap-2.5 flex-wrap">
              <span
                data-testid="net-profit-value"
                className={`font-mono tabular-nums text-3xl sm:text-4xl font-extrabold tracking-tight ${
                  results.totalNetProfitThousandSom >= 0
                    ? 'text-emerald-700'
                    : 'text-red-600'
                }`}
              >
                {formatNumber(results.totalNetProfitThousandSom, 2)}
              </span>
              <span className="text-base font-semibold text-emerald-800">
                ҳазор сомонӣ
              </span>
            </div>
            <p className="mt-1 text-xs text-emerald-900/75 font-mono tabular-nums">
              Даромади умумӣ: {formatNumber(results.totalGrossProfitSom, 2)} сом − Хароҷоти об:{' '}
              {formatNumber(results.totalWaterCostSom, 2)} сом
            </p>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-emerald-200/80 pt-3 sm:pt-0 sm:pl-5 shrink-0">
            <p className="text-xs font-medium text-emerald-800">
              Самаранокӣ аз 1 м³ об
            </p>
            <p
              data-testid="water-efficiency-value"
              className="mt-1 font-mono tabular-nums text-2xl font-bold text-sky-800"
            >
              {formatNumber(results.waterEfficiencySomPerM3, 2)}{' '}
              <span className="text-sm font-semibold text-sky-700">сом/м³</span>
            </p>
          </div>
        </div>

        {/* 6-metric grid (single elevation, hairline divided) */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 border border-slate-200 rounded-xl overflow-hidden bg-slate-200 gap-px">
          <div className="bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Баландии напор (H)</p>
            <p
              data-testid="head-meters-value"
              className="mt-1 font-mono tabular-nums text-xl font-bold text-slate-900"
            >
              {results.headMeters} <span className="text-sm font-medium text-slate-500">м</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">Аз рӯи зинаи насосӣ</p>
          </div>

          <div className="bg-white p-4">
            <p className="text-xs font-medium text-slate-500">КПД агрегат (η)</p>
            <p className="mt-1 font-mono tabular-nums text-xl font-bold text-slate-900">
              {formatNumber(efficiencyEta, 2)}
            </p>
            <p className="mt-1 text-xs text-slate-400 font-mono tabular-nums">
              Энергия: {formatNumber(results.energyPerM3Kwh, 3)} кВт·ч/м³
            </p>
          </div>

          <div className="bg-white p-4">
            <p className="text-xs font-medium text-slate-500">
              Арзиши 1 м³ об (кумулятивӣ)
            </p>
            <p
              data-testid="unit-water-cost-value"
              className="mt-1 font-mono tabular-nums text-xl font-bold text-sky-700"
            >
              {formatNumber(results.totalWaterCostPerM3Som, 3)}{' '}
              <span className="text-sm font-medium text-sky-600">сом/м³</span>
            </p>
            <p className="mt-1 text-xs text-slate-400 font-mono tabular-nums">
              Барқ {formatNumber(results.energyCostPerM3Som, 3)} + Об {formatNumber(waterTariff, 3)}
            </p>
          </div>

          <div className="bg-white p-4">
            <p className="text-xs font-medium text-slate-500">
              Меъёри миёнаи обёрии зироат
            </p>
            <p
              data-testid="avg-water-norm-value"
              className="mt-1 font-mono tabular-nums text-xl font-bold text-slate-900"
            >
              {formatNumber(results.avgWaterNormM3PerHa, 2)}{' '}
              <span className="text-sm font-medium text-slate-500">м³/га</span>
            </p>
            <p className="mt-1 text-xs text-slate-400 font-mono tabular-nums">
              Ҳаҷми умумӣ: {formatNumber(results.totalWaterVolumeM3, 0)} м³
            </p>
          </div>

          <div className="bg-white p-4">
            <p className="text-xs font-medium text-slate-500">
              Хароҷоти умумии об ба майдон
            </p>
            <p
              data-testid="total-water-cost-value"
              className="mt-1 font-mono tabular-nums text-xl font-bold text-slate-900"
            >
              {formatNumber(results.totalWaterCostSom, 2)}{' '}
              <span className="text-sm font-medium text-slate-500">сомонӣ</span>
            </p>
            <p className="mt-1 text-xs text-slate-400 font-mono tabular-nums">
              Тарифи барқ: {formatNumber(electricityTariff, 4)} сом/кВт·ч
            </p>
          </div>

          <div className="bg-white p-4">
            <p className="text-xs font-medium text-slate-500">
              Даромади миёнаи холис аз 1 га
            </p>
            <p
              data-testid="avg-income-value"
              className="mt-1 font-mono tabular-nums text-xl font-bold text-emerald-700"
            >
              {formatNumber(results.avgNetIncomePerHaSom, 2)}{' '}
              <span className="text-sm font-medium text-emerald-600">сом/га</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">Вазнӣ аз рӯи ҳиссаи кишт</p>
          </div>
        </div>
      </div>

      {/* Саҳми зироатҳо дар фоидаи холис */}
      {results.cropContributions.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <span className="font-semibold text-slate-700">
              Тақсимоти фоидаи холис ва масрафи об аз рӯи зироатҳо
            </span>
            <span>Барои майдони {formatNumber(displayAreaHa, 2)} га</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {results.cropContributions.map((item) => {
              const barPct = Math.max(
                4,
                Math.min(100, (Math.abs(item.netProfitSom) / maxContributionNet) * 100)
              );
              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-semibold text-slate-800 truncate">
                      {item.name}{' '}
                      <span className="font-normal text-slate-500 font-mono tabular-nums">
                        ({formatNumber(item.sharePercent, 0)}% · {formatNumber(item.waterVolumeM3, 0)} м³)
                      </span>
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-emerald-700 shrink-0">
                      {formatNumber(item.netProfitSom / 1000, 2)} ҳаз. сом
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${
                        item.netProfitSom >= 0 ? 'bg-emerald-600' : 'bg-red-500'
                      }`}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
