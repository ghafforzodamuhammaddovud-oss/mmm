import React from 'react';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { CropRow, formatNumber } from '../utils/irrigationMath';

interface CropTableCardProps {
  crops: CropRow[];
  shareSumPercent: number;
  isShareSumValid: boolean;
  onUpdateCrop: <K extends keyof CropRow>(id: string, field: K, value: CropRow[K]) => void;
  onAddCrop: () => void;
  onDeleteCrop: (id: string) => void;
}

export const CropTableCard: React.FC<CropTableCardProps> = ({
  crops,
  shareSumPercent,
  isShareSumValid,
  onUpdateCrop,
  onAddCrop,
  onDeleteCrop,
}) => {
  return (
    <section
      aria-labelledby="part-2-heading"
      className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <p className="text-xs font-semibold text-sky-700 tracking-wide">
            Қисми 2
          </p>
          <h2 id="part-2-heading" className="text-lg font-bold text-slate-900 mt-0.5">
            Структураи кишт ва нархномаи зироатҳо
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="text-sm text-slate-600 flex items-center gap-2">
            <span>Ҷамъи ҳиссаи кишт:</span>
            <span
              data-testid="share-sum-value"
              className={`font-mono tabular-nums font-bold ${
                isShareSumValid ? 'text-emerald-700' : 'text-red-600'
              }`}
            >
              {formatNumber(shareSumPercent, 1).replace(/\.0$/, '')}%
            </span>
            <span className="text-xs text-slate-400">(бояд 100%)</span>
          </div>

          <button
            type="button"
            onClick={onAddCrop}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          >
            <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Иловаи зироат</span>
          </button>
        </div>
      </div>

      {/* Red warning when sum !== 100% */}
      {!isShareSumValid && (
        <div
          role="alert"
          data-testid="share-sum-warning"
          className="mt-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-start gap-2.5 text-sm"
        >
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-semibold">Огоҳӣ: </span>
            <span>
              Ҷамъи ҳиссаи кишти зироатҳо бояд баробари <strong>100%</strong> бошад (ҳоло:{' '}
              <strong className="font-mono tabular-nums">
                {formatNumber(shareSumPercent, 1).replace(/\.0$/, '')}%
              </strong>
              ). Лутфан ҳиссаҳоро ислоҳ кунед.
            </span>
          </div>
        </div>
      )}

      {crops.length === 0 ? (
        <div className="mt-6 py-10 px-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <p className="text-sm font-medium text-slate-700">
            Дар ҷадвал ягон зироат нест.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Барои оғози ҳисоб зироати нав илова кунед ё маълумоти пешфарзро барқарор намоед.
          </p>
          <button
            type="button"
            onClick={onAddCrop}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Иловаи зироати аввал</span>
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <table className="w-full border-collapse text-left block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                <th scope="col" className="py-3 pr-3">
                  Зироат
                </th>
                <th scope="col" className="py-3 px-2 text-right">
                  Ҳиссаи кишт (%)
                </th>
                <th scope="col" className="py-3 px-2 text-right">
                  Меъёри об (м³/га)
                </th>
                <th scope="col" className="py-3 px-2 text-right">
                  Фоида аз 1 га (сом)
                </th>
                <th scope="col" className="py-3 px-2 text-right">
                  Нархи фурӯш (сом/т)
                </th>
                <th scope="col" className="py-3 px-2 text-right">
                  Ҳосилноки (т/га)
                </th>
                <th scope="col" className="py-3 pl-2 text-right w-14">
                  Амал
                </th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group divide-y divide-slate-200 md:divide-slate-100 text-sm">
              {crops.map((crop, index) => {
                const invalidShare = crop.sharePercent < 0;
                const invalidWater = crop.waterNormM3PerHa < 0;
                const invalidPrice = crop.sellingPricePerTon < 0;
                const invalidYield = crop.yieldTonPerHa < 0;

                return (
                  <tr
                    key={crop.id}
                    data-testid={`crop-row-${index}`}
                    className="grid grid-cols-2 gap-3 py-4 md:py-0 md:table-row md:hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="col-span-2 md:col-span-1 block md:table-cell md:py-2.5 md:pr-3">
                      <span className="block md:hidden text-xs font-semibold text-slate-500 mb-1">
                        Зироат
                      </span>
                      <input
                        type="text"
                        aria-label={`Номи зироати ${index + 1}`}
                        value={crop.name}
                        onChange={(e) => onUpdateCrop(crop.id, 'name', e.target.value)}
                        placeholder="Номи зироат"
                        className="w-full px-3 py-2 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-600/15"
                      />
                    </td>

                    <td className="block md:table-cell md:py-2.5 md:px-2">
                      <span className="block md:hidden text-xs font-medium text-slate-500 mb-1">
                        Ҳиссаи кишт (%)
                      </span>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        aria-label={`Ҳиссаи кишт (%) барои ${crop.name || `зироати ${index + 1}`}`}
                        value={Number.isNaN(crop.sharePercent) ? '' : crop.sharePercent}
                        onChange={(e) =>
                          onUpdateCrop(
                            crop.id,
                            'sharePercent',
                            e.target.value === '' ? 0 : parseFloat(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 text-right font-mono tabular-nums text-sm font-medium rounded-lg border focus:outline-none focus:bg-white focus:ring-2 ${
                          invalidShare
                            ? 'border-red-400 bg-red-50 text-red-900 focus:border-red-600 focus:ring-red-600/15'
                            : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-sky-600 focus:ring-sky-600/15'
                        }`}
                      />
                    </td>

                    <td className="block md:table-cell md:py-2.5 md:px-2">
                      <span className="block md:hidden text-xs font-medium text-slate-500 mb-1">
                        Меъёри об (м³/га)
                      </span>
                      <input
                        type="number"
                        step="10"
                        min="0"
                        aria-label={`Меъёри об (м³/га) барои ${crop.name || `зироати ${index + 1}`}`}
                        value={
                          Number.isNaN(crop.waterNormM3PerHa) ? '' : crop.waterNormM3PerHa
                        }
                        onChange={(e) =>
                          onUpdateCrop(
                            crop.id,
                            'waterNormM3PerHa',
                            e.target.value === '' ? 0 : parseFloat(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 text-right font-mono tabular-nums text-sm font-medium rounded-lg border focus:outline-none focus:bg-white focus:ring-2 ${
                          invalidWater
                            ? 'border-red-400 bg-red-50 text-red-900 focus:border-red-600 focus:ring-red-600/15'
                            : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-sky-600 focus:ring-sky-600/15'
                        }`}
                      />
                    </td>

                    <td className="block md:table-cell md:py-2.5 md:px-2">
                      <span className="block md:hidden text-xs font-medium text-slate-500 mb-1">
                        Фоида аз 1 га (сом)
                      </span>
                      <input
                        type="number"
                        step="10"
                        aria-label={`Фоида аз 1 га (сом) барои ${crop.name || `зироати ${index + 1}`}`}
                        value={Number.isNaN(crop.profitPerHa) ? '' : crop.profitPerHa}
                        onChange={(e) =>
                          onUpdateCrop(
                            crop.id,
                            'profitPerHa',
                            e.target.value === '' ? 0 : parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 text-right font-mono tabular-nums text-sm font-medium text-emerald-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
                      />
                    </td>

                    <td className="block md:table-cell md:py-2.5 md:px-2">
                      <span className="block md:hidden text-xs font-medium text-slate-500 mb-1">
                        Нархи фурӯш (сом/т)
                      </span>
                      <input
                        type="number"
                        step="10"
                        min="0"
                        aria-label={`Нархи фурӯш (сом/т) барои ${crop.name || `зироати ${index + 1}`}`}
                        value={
                          Number.isNaN(crop.sellingPricePerTon) ? '' : crop.sellingPricePerTon
                        }
                        onChange={(e) =>
                          onUpdateCrop(
                            crop.id,
                            'sellingPricePerTon',
                            e.target.value === '' ? 0 : parseFloat(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 text-right font-mono tabular-nums text-sm font-medium rounded-lg border focus:outline-none focus:bg-white focus:ring-2 ${
                          invalidPrice
                            ? 'border-red-400 bg-red-50 text-red-900 focus:border-red-600 focus:ring-red-600/15'
                            : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-sky-600 focus:ring-sky-600/15'
                        }`}
                      />
                    </td>

                    <td className="block md:table-cell md:py-2.5 md:px-2">
                      <span className="block md:hidden text-xs font-medium text-slate-500 mb-1">
                        Ҳосилноки (т/га)
                      </span>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        aria-label={`Ҳосилноки (т/га) барои ${crop.name || `зироати ${index + 1}`}`}
                        value={Number.isNaN(crop.yieldTonPerHa) ? '' : crop.yieldTonPerHa}
                        onChange={(e) =>
                          onUpdateCrop(
                            crop.id,
                            'yieldTonPerHa',
                            e.target.value === '' ? 0 : parseFloat(e.target.value)
                          )
                        }
                        className={`w-full px-3 py-2 text-right font-mono tabular-nums text-sm font-medium rounded-lg border focus:outline-none focus:bg-white focus:ring-2 ${
                          invalidYield
                            ? 'border-red-400 bg-red-50 text-red-900 focus:border-red-600 focus:ring-red-600/15'
                            : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-sky-600 focus:ring-sky-600/15'
                        }`}
                      />
                    </td>

                    <td className="col-span-2 md:col-span-1 flex justify-end md:table-cell md:py-2.5 md:pl-2 md:text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteCrop(crop.id)}
                        aria-label={`Нест кардани ${crop.name || `зироати ${index + 1}`}`}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 md:p-0 md:w-9 md:h-9 rounded-lg text-xs font-medium text-slate-500 md:text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                        <span className="md:hidden">Нест кардан</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
