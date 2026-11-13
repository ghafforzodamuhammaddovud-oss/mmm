import React from 'react';
import { Droplets, Gauge, MapPin, Zap } from 'lucide-react';
import { GeneralInputs, PUMP_STAGE_HEAD_MAP } from '../utils/irrigationMath';

interface InputsCardProps {
  inputs: GeneralInputs;
  headMeters: number;
  onChange: <K extends keyof GeneralInputs>(field: K, value: GeneralInputs[K]) => void;
}

const STAGES: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

export const InputsCard: React.FC<InputsCardProps> = ({ inputs, headMeters, onChange }) => {
  return (
    <section
      aria-labelledby="part-1-heading"
      className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold text-sky-700 tracking-wide">
              Қисми 1
            </p>
            <h2
              id="part-1-heading"
              className="text-lg font-bold text-slate-900 mt-0.5"
            >
              Вориди маълумот
            </h2>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-slate-500 block">Напор (H)</span>
            <span className="font-mono tabular-nums text-base font-bold text-sky-700">
              {headMeters} м
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {/* Минтақа / Ноҳия */}
          <div>
            <label
              htmlFor="input-region"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5"
            >
              <MapPin className="w-4 h-4 text-sky-600 shrink-0" aria-hidden="true" />
              <span>Минтақаи обёрӣ / Ноҳия</span>
            </label>
            <input
              id="input-region"
              type="text"
              value={inputs.region}
              onChange={(e) => onChange('region', e.target.value)}
              placeholder="Масалан: Восеъ"
              className="w-full px-3.5 py-2.5 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-600/15 transition-colors"
            />
          </div>

          {/* Зинаи стансияи насосӣ (1 то 5) */}
          <fieldset>
            <div className="flex items-center justify-between mb-1.5">
              <legend className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <Gauge className="w-4 h-4 text-sky-600 shrink-0" aria-hidden="true" />
                <span>Зинаи стансияи насосӣ</span>
              </legend>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                Зинаи {inputs.pumpStage} · {PUMP_STAGE_HEAD_MAP[inputs.pumpStage]} м
              </span>
            </div>

            <div
              role="group"
              aria-label="Интихоби зинаи стансияи насосӣ"
              className="grid grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-lg"
            >
              {STAGES.map((stage) => {
                const isActive = inputs.pumpStage === stage;
                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => onChange('pumpStage', stage)}
                    aria-pressed={isActive}
                    className={`py-2.5 px-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-sky-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    {stage} ({PUMP_STAGE_HEAD_MAP[stage]}м)
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Майдони умумии замин (гектар) ва КПД агрегат */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
            <div className="flex flex-col justify-between">
              <label
                htmlFor="input-area"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Майдони умумии замин (га)
              </label>
              <input
                id="input-area"
                type="number"
                step="0.01"
                min="0"
                value={Number.isNaN(inputs.totalAreaHa) ? '' : inputs.totalAreaHa}
                onChange={(e) =>
                  onChange('totalAreaHa', e.target.value === '' ? 0 : parseFloat(e.target.value))
                }
                className={`w-full px-3.5 py-2.5 text-sm font-mono tabular-nums font-medium rounded-lg border transition-colors focus:outline-none focus:bg-white focus:ring-2 ${
                  inputs.totalAreaHa <= 0
                    ? 'border-red-400 bg-red-50/50 text-red-900 focus:border-red-600 focus:ring-red-600/15'
                    : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-sky-600 focus:ring-sky-600/15'
                }`}
              />
            </div>

            {/* КПД агрегат (η) */}
            <div className="flex flex-col justify-between">
              <label
                htmlFor="input-eta"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                КПД агрегат (η)
              </label>
              <input
                id="input-eta"
                type="number"
                step="0.01"
                min="0.01"
                max="1"
                value={Number.isNaN(inputs.efficiencyEta) ? '' : inputs.efficiencyEta}
                onChange={(e) =>
                  onChange(
                    'efficiencyEta',
                    e.target.value === '' ? 0 : parseFloat(e.target.value)
                  )
                }
                className={`w-full px-3.5 py-2.5 text-sm font-mono tabular-nums font-medium rounded-lg border transition-colors focus:outline-none focus:bg-white focus:ring-2 ${
                  inputs.efficiencyEta <= 0 || inputs.efficiencyEta > 1
                    ? 'border-red-400 bg-red-50/50 text-red-900 focus:border-red-600 focus:ring-red-600/15'
                    : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-sky-600 focus:ring-sky-600/15'
                }`}
              />
            </div>
          </div>

          {/* Тарифи барқ ва об */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
            <div className="flex flex-col justify-between">
              <label
                htmlFor="input-electricity-tariff"
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-sky-600 shrink-0" aria-hidden="true" />
                <span>Тарифи барқ (сом/кВт·ч)</span>
              </label>
              <input
                id="input-electricity-tariff"
                type="number"
                step="0.0001"
                min="0"
                value={
                  Number.isNaN(inputs.electricityTariff) ? '' : inputs.electricityTariff
                }
                onChange={(e) =>
                  onChange(
                    'electricityTariff',
                    e.target.value === '' ? 0 : parseFloat(e.target.value)
                  )
                }
                className={`w-full px-3.5 py-2.5 text-sm font-mono tabular-nums font-medium rounded-lg border transition-colors focus:outline-none focus:bg-white focus:ring-2 ${
                  inputs.electricityTariff < 0
                    ? 'border-red-400 bg-red-50/50 text-red-900 focus:border-red-600 focus:ring-red-600/15'
                    : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-sky-600 focus:ring-sky-600/15'
                }`}
              />
            </div>

            <div className="flex flex-col justify-between">
              <label
                htmlFor="input-water-tariff"
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5"
              >
                <Droplets className="w-3.5 h-3.5 text-sky-600 shrink-0" aria-hidden="true" />
                <span>Тарифи об (сом/м³)</span>
              </label>
              <input
                id="input-water-tariff"
                type="number"
                step="0.001"
                min="0"
                value={Number.isNaN(inputs.waterTariff) ? '' : inputs.waterTariff}
                onChange={(e) =>
                  onChange('waterTariff', e.target.value === '' ? 0 : parseFloat(e.target.value))
                }
                className={`w-full px-3.5 py-2.5 text-sm font-mono tabular-nums font-medium rounded-lg border transition-colors focus:outline-none focus:bg-white focus:ring-2 ${
                  inputs.waterTariff < 0
                    ? 'border-red-400 bg-red-50/50 text-red-900 focus:border-red-600 focus:ring-red-600/15'
                    : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-sky-600 focus:ring-sky-600/15'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span>Минтақа: <strong className="text-slate-700">{inputs.region.trim() || '—'}</strong></span>
        <span aria-hidden="true">·</span>
        <span>Напор: <strong className="text-slate-700 font-mono tabular-nums">{headMeters} м</strong></span>
        <span aria-hidden="true">·</span>
        <span>КПД: <strong className="text-slate-700 font-mono tabular-nums">{inputs.efficiencyEta.toFixed(2)}</strong></span>
      </div>
    </section>
  );
};
