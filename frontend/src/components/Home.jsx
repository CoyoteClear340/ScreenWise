import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    title: "Real ML predictions",
    body: "A machine learning classifier trained and cross-validated on real screen-time and lifestyle data — no hardcoded outputs.",
  },
  {
    title: "Explainable results",
    body: "See which lifestyle factors influenced your result most, ranked by model-derived importance.",
  },
  {
    title: "Private by design",
    body: "No account, no sign-up. Your answers are sent directly to the prediction API and are not stored.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      <div className="max-w-2xl">
        <span className="inline-block text-xs font-semibold tracking-wide uppercase text-primary bg-primary-light rounded-full px-3 py-1 mb-6">
          Academic AI/ML Project
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-ink leading-tight">
          ScreenWise
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted leading-relaxed">
          Understand your digital lifestyle. Get an AI-powered wellness prediction.
        </p>
        <p className="mt-6 text-base text-ink/80 leading-relaxed">
          ScreenWise looks at your screen time, sleep, exercise, and social habits and uses a
          machine learning model trained on real lifestyle data to estimate where your wellness
          pattern falls — Low, Moderate, or High — along with the factors that mattered most.
        </p>
        <button
          onClick={() => navigate("/predict")}
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-paper font-semibold text-base hover:bg-primary-dark transition-colors shadow-card"
        >
          Check My Wellness
        </button>
      </div>

      <div className="mt-20 grid gap-6 md:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-xl2 bg-card border border-line p-6 shadow-card">
            <h3 className="font-semibold text-ink mb-2">{f.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
