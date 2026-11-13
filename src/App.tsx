import { useMemo, useRef, useState } from 'react';
import { AlertCircle, Calculator, RotateCcw } from 'lucide-react';
import {
  CropRow,
  DEFAULT_CROPS,
  DEFAULT_GENERAL_INPUTS,
  GeneralInputs,
  calculateIrrigationMetrics,
} from './utils/irrigationMath';
import { InputsCard } from './components/InputsCard';
import { CropTableCard } from './components/CropTableCard';
import { ResultsCard } from './components/ResultsCard';

export default function App() {
  const [inputs, setInputs] = useState<GeneralInputs>(() => ({ ...DEFAULT_GENERAL_INPUTS }));
  const [crops, setCrops] = useState<CropRow[]>(() =>
    DEFAULT_CROPS.map((crop) => ({ ...crop }))
  );
  const [calculateFeedback, setCalculateFeedback] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(
    () => calculateIrrigationMetrics(inputs, crops),
    [inputs, crops]
  );

  const otherIssues = results.validationIssues.filter(
    (issue) => issue.field !== 'shareSum'
  );

  const handleInputChange = <K extends keyof GeneralInputs>(
    field: K,
    value: GeneralInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    setCalculateFeedback(null);
  };

  const handleUpdateCrop = <K extends keyof CropRow>(
    id: string,
    field: K,
    value: CropRow[K]
  ) => {
    setCrops((prev) =>
      prev.map((crop) => (crop.id === id ? { ...crop, [field]: value } : crop))
    );
    setCalculateFeedback(null);
  };

  const handleAddCrop = () => {
    const nextNum = crops.length + 1;
    const remainingShare = Math.max(0, Math.round((100 - results.shareSumPercent) * 10) / 10);
    const newCrop: CropRow = {
      id: `crop-${Date.now()}-${nextNum}`,
      name: `Зироати ${nextNum}`,
      sharePercent: remainingShare,
      waterNormM3PerHa: 5000,
      profitPerHa: 15000,
      sellingPricePerTon: 2000,
      yieldTonPerHa: 10,
    };
    setCrops((prev) => [...prev, newCrop]);
    setCalculateFeedback(null);
  };

  const handleDeleteCrop = (id: string) => {
    setCrops((prev) => prev.filter((crop) => crop.id !== id));
    setCalculateFeedback(null);
  };

  const handleReset = () => {
    setInputs({ ...DEFAULT_GENERAL_INPUTS });
    setCrops(DEFAULT_CROPS.map((crop) => ({ ...crop })));
    setCalculateFeedback('Маълумот ба арзишҳои пешфарз баргардонида шуд.');
  };

  const handleExplicitCalculate = () => {
    setCalculateFeedback('Ҳисобҳо бо муваффақият нав карда шуданд.');
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900 leading-snug">
              🌾 МИНИ-ПЛАТФОРМАИ ҲИСОБИ ЭФФЕКТИВНОКИИ ОБЁРИИ МЕХАНИКӢ (ТОҶИКИСТОН)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Таҳлили худкори гидравликӣ, хароҷоти энергетикии насосҳо ва даромаднокии сохтори кишт
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
            >
              <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Бозгашт ба пешфарз</span>
            </button>

            <button
              type="button"
              onClick={handleExplicitCalculate}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              <Calculator className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Ҳисоб кардан</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Global Input Validation Warnings (if any non-shareSum errors exist) */}
        {otherIssues.length > 0 && (
          <div
            role="alert"
            data-testid="input-validation-alert"
            className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-sm space-y-1">
              <p className="font-bold text-red-800">Хатои вориди маълумот:</p>
              <ul className="list-disc list-inside space-y-0.5 text-red-800">
                {otherIssues.map((issue) => (
                  <li key={issue.field}>{issue.message}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {calculateFeedback && (
          <div
            role="status"
            className="px-4 py-2.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-sm font-medium flex items-center justify-between gap-4"
          >
            <span>{calculateFeedback}</span>
            <button
              type="button"
              onClick={() => setCalculateFeedback(null)}
              aria-label="Пӯшидани паём"
              className="text-xs font-semibold text-sky-700 hover:text-sky-900 cursor-pointer whitespace-nowrap shrink-0"
            >
              Пӯшидан
            </button>
          </div>
        )}

        {/* 3-Part Grid: On mobile 1 -> 2 -> 3, on desktop Part 1 (left) + Part 3 (right) above fold, Part 2 full-width */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-4 order-1 flex flex-col">
            <div className="flex-1 flex flex-col [&>section]:flex-1">
              <InputsCard
                inputs={inputs}
                headMeters={results.headMeters}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div
            ref={resultsRef}
            className="lg:col-span-8 order-3 lg:order-2 flex flex-col"
          >
            <div className="flex-1 flex flex-col [&>section]:flex-1">
              <ResultsCard
                region={inputs.region}
                totalAreaHa={inputs.totalAreaHa}
                efficiencyEta={inputs.efficiencyEta}
                electricityTariff={inputs.electricityTariff}
                waterTariff={inputs.waterTariff}
                results={results}
              />
            </div>
          </div>

          <div className="lg:col-span-12 order-2 lg:order-3">
            <CropTableCard
              crops={crops}
              shareSumPercent={results.shareSumPercent}
              isShareSumValid={results.isShareSumValid}
              onUpdateCrop={handleUpdateCrop}
              onAddCrop={handleAddCrop}
              onDeleteCrop={handleDeleteCrop}
            />
          </div>
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
          <span>
            Ҳисоби энергияи об: E = (H × 9.81) / (η × 3600) кВт·ч/м³
          </span>
          <span>
            Арзиши 1 м³ об = (E × Тарифи барқ) + Тарифи об
          </span>
        </div>
      </footer>
    </div>
  );
}
