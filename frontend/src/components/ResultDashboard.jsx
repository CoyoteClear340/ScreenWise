import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Disclaimer from "./Disclaimer.jsx";
import { AlertIcon, ChartIcon, CheckCircleIcon, DownloadIcon } from "./icons.jsx";
import { getFactorTip } from "../utils/factorTips.js";
import { buildShareCardCanvas, downloadCanvas } from "../utils/shareCard.js";

const CATEGORY_STYLES = {
  Low: { text: "text-low", bg: "bg-low/10", border: "border-low/30", bar: "bg-low", hex: "#b0503b" },
  Moderate: {
    text: "text-moderate",
    bg: "bg-moderate/10",
    border: "border-moderate/30",
    bar: "bg-moderate",
    hex: "#b8873a",
  },
  High: { text: "text-high", bg: "bg-high/10", border: "border-high/30", bar: "bg-high", hex: "#3f7a56" },
};

const CATEGORY_ICON = { Low: AlertIcon, Moderate: ChartIcon, High: CheckCircleIcon };

const INTERPRETATION = {
  Low: "Your responses show patterns associated with lower wellness scores in this dataset — notably around screen time, sleep, or stress-adjacent factors. Consider small, sustainable adjustments to your routine.",
  Moderate:
    "Your responses show a mixed pattern — some habits align with higher wellness, others with lower. There's room to fine-tune specific areas.",
  High: "Your responses show patterns associated with higher wellness scores in this dataset, such as balanced screen time and healthy sleep habits. Keep up your current routine.",
};

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatFeatureName(name) {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ResultDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const form = location.state?.form;
  const [revealed, setRevealed] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!result) return undefined;
    const t = setTimeout(() => setRevealed(true), 60);
    return () => clearTimeout(t);
  }, [result]);

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-ink">No result to show</h1>
        <p className="text-muted mt-2">
          Please fill out the form first to get a wellness prediction.
        </p>
        <button
          onClick={() => navigate("/predict")}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-paper font-semibold hover:bg-primary-dark transition-colors"
        >
          Go to form
        </button>
      </div>
    );
  }

  const { prediction, score, confidence, top_factors: topFactors = [] } = result;
  const style = CATEGORY_STYLES[prediction] || CATEGORY_STYLES.Moderate;
  const CategoryIcon = CATEGORY_ICON[prediction] || ChartIcon;
  const maxImportance = Math.max(...topFactors.map((f) => f.importance), 0.0001);
  const clampedScore = Math.max(0, Math.min(100, Number(score) || 0));
  const dashOffset = CIRCUMFERENCE * (1 - (revealed ? clampedScore : 0) / 100);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const canvas = buildShareCardCanvas(result, form);
      await downloadCanvas(canvas, `screenwise-${prediction.toLowerCase()}-result.png`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-ink tracking-tight mb-8 animate-fade-in-up">
        Your Wellness Result
      </h1>

      <div
        className={`relative overflow-hidden rounded-xl2 border ${style.border} ${style.bg} p-8 shadow-card animate-fade-in-up`}
      >
        <div
          className="pointer-events-none absolute -right-14 -top-14 w-52 h-52 rounded-full blur-3xl opacity-25 animate-pulse-glow"
          style={{ background: style.hex }}
          aria-hidden="true"
        />

        <div className="relative flex flex-col sm:flex-row items-center gap-8">
          <div className="relative w-36 h-36 shrink-0">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r={RADIUS} className="text-line" stroke="currentColor" strokeWidth="10" fill="none" />
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                className={style.text}
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <CategoryIcon className={`w-6 h-6 ${style.text} mb-1`} />
              <span className={`text-2xl font-bold tabular-nums ${style.text}`}>
                {Math.round(clampedScore)}
              </span>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-muted uppercase tracking-wide">Predicted Category</p>
            <p className={`text-4xl md:text-5xl font-bold mt-1 ${style.text}`}>{prediction}</p>

            <div className="mt-5 flex items-center justify-center sm:justify-start gap-8">
              <div>
                <p className="text-3xl font-semibold text-ink">{score}/100</p>
                <p className="text-xs text-muted mt-1">Wellness Score</p>
              </div>
              {confidence != null && (
                <div>
                  <p className="text-3xl font-semibold text-ink">{Math.round(confidence * 100)}%</p>
                  <p className="text-xs text-muted mt-1">Model Confidence</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl2 bg-card border border-line p-6 shadow-card animate-fade-in-up animate-delay-1">
        <h2 className="text-base font-semibold text-ink mb-1">Interpretation</h2>
        <p className="text-sm text-muted leading-relaxed">{INTERPRETATION[prediction]}</p>
      </div>

      {topFactors.length > 0 && (
        <div className="mt-6 rounded-xl2 bg-card border border-line p-6 shadow-card animate-fade-in-up animate-delay-2">
          <h2 className="text-base font-semibold text-ink mb-1">Key Factors</h2>
          <p className="text-sm text-muted mb-5">
            The lifestyle factors that most influenced this prediction, based on the trained model.
            These reflect correlations in the training data, not proven causes.
          </p>
          <div className="space-y-4">
            {topFactors.map((f, i) => (
              <div key={f.feature} className="flex items-center gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary-light text-primary text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink">{formatFeatureName(f.feature)}</span>
                    <span className="text-muted tabular-nums">{(f.importance * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-line overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-high rounded-full"
                      style={{
                        width: revealed ? `${(f.importance / maxImportance) * 100}%` : "0%",
                        transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
                        transitionDelay: `${i * 90}ms`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted mt-1.5 leading-relaxed">
                    {getFactorTip(f.feature, form?.[f.feature])}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 animate-fade-in-up animate-delay-3">
        <Disclaimer />
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-paper font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-glow"
        >
          {downloading ? (
            <span className="w-4 h-4 rounded-full border-2 border-paper/40 border-t-paper animate-spin" />
          ) : (
            <DownloadIcon className="w-4 h-4" />
          )}
          Download Result Card
        </button>
        <button
          onClick={() => navigate("/predict")}
          className="flex-1 rounded-lg border border-primary text-primary px-6 py-3 font-semibold hover:bg-primary-light transition-colors"
        >
          Check Again
        </button>
      </div>
    </div>
  );
}
