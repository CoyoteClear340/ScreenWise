import { useLocation, useNavigate } from "react-router-dom";
import Disclaimer from "./Disclaimer.jsx";

const CATEGORY_STYLES = {
  Low: { text: "text-low", bg: "bg-low/10", border: "border-low/30", bar: "bg-low" },
  Moderate: { text: "text-moderate", bg: "bg-moderate/10", border: "border-moderate/30", bar: "bg-moderate" },
  High: { text: "text-high", bg: "bg-high/10", border: "border-high/30", bar: "bg-high" },
};

const INTERPRETATION = {
  Low: "Your responses show patterns associated with lower wellness scores in this dataset — notably around screen time, sleep, or stress-adjacent factors. Consider small, sustainable adjustments to your routine.",
  Moderate:
    "Your responses show a mixed pattern — some habits align with higher wellness, others with lower. There's room to fine-tune specific areas.",
  High: "Your responses show patterns associated with higher wellness scores in this dataset, such as balanced screen time and healthy sleep habits. Keep up your current routine.",
};

function formatFeatureName(name) {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ResultDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

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
  const maxImportance = Math.max(...topFactors.map((f) => f.importance), 0.0001);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-ink tracking-tight mb-8">Your Wellness Result</h1>

      <div className={`rounded-xl2 border ${style.border} ${style.bg} p-8 text-center shadow-card`}>
        <p className="text-sm font-medium text-muted uppercase tracking-wide">Predicted Category</p>
        <p className={`text-5xl font-bold mt-2 ${style.text}`}>{prediction}</p>

        <div className="mt-6 flex items-center justify-center gap-8">
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

      <div className="mt-6 rounded-xl2 bg-card border border-line p-6 shadow-card">
        <h2 className="text-base font-semibold text-ink mb-1">Interpretation</h2>
        <p className="text-sm text-muted leading-relaxed">{INTERPRETATION[prediction]}</p>
      </div>

      {topFactors.length > 0 && (
        <div className="mt-6 rounded-xl2 bg-card border border-line p-6 shadow-card">
          <h2 className="text-base font-semibold text-ink mb-1">Key Factors</h2>
          <p className="text-sm text-muted mb-5">
            The lifestyle factors that most influenced this prediction, based on the trained model.
            These reflect correlations in the training data, not proven causes.
          </p>
          <div className="space-y-3">
            {topFactors.map((f) => (
              <div key={f.feature}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-ink">{formatFeatureName(f.feature)}</span>
                  <span className="text-muted">{(f.importance * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-line overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(f.importance / maxImportance) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <Disclaimer />
      </div>

      <button
        onClick={() => navigate("/predict")}
        className="mt-8 w-full rounded-lg border border-primary text-primary px-6 py-3 font-semibold hover:bg-primary-light transition-colors"
      >
        Check Again
      </button>
    </div>
  );
}
