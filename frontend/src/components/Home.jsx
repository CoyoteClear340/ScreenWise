import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightIcon,
  ChartIcon,
  DeviceIcon,
  HeartPulseIcon,
  LockIcon,
  SparkleIcon,
  TrendIcon,
} from "./icons.jsx";

const WellnessScene = lazy(() => import("./three/WellnessScene.jsx"));

const FEATURES = [
  {
    title: "Real ML predictions",
    body: "A machine learning classifier trained and cross-validated on real screen-time and lifestyle data — no hardcoded outputs.",
    icon: TrendIcon,
  },
  {
    title: "Explainable results",
    body: "See which lifestyle factors influenced your result most, ranked by model-derived importance.",
    icon: ChartIcon,
  },
  {
    title: "Private by design",
    body: "No account, no sign-up. Your answers are sent directly to the prediction API and are not stored.",
    icon: LockIcon,
  },
];

const STEPS = [
  {
    title: "Share your habits",
    body: "Answer a short form about your screen time, sleep, exercise, and social patterns.",
    icon: DeviceIcon,
  },
  {
    title: "Model does the work",
    body: "A trained classifier scores your inputs against real lifestyle and wellness data.",
    icon: SparkleIcon,
  },
  {
    title: "Get your result",
    body: "See your wellness category, score, and the exact factors that mattered most.",
    icon: HeartPulseIcon,
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <section className="relative max-w-5xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="hidden md:block absolute -right-6 -top-6 w-[26rem] h-[36rem] max-w-full pointer-events-none">
          <Suspense fallback={null}>
            <WellnessScene className="w-full h-full" />
          </Suspense>
        </div>

        <div className="relative max-w-2xl animate-fade-in-up">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-primary bg-primary-light rounded-full px-3 py-1 mb-6 border border-primary/10">
            <SparkleIcon className="w-3.5 h-3.5" />
            Screen Time &times; Mental Wellness
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-ink leading-[1.05]">
            <span className="gradient-text">ScreenWise</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted leading-relaxed">
            Understand your digital lifestyle. Get an AI-powered wellness prediction.
          </p>
          <p className="mt-6 text-base text-ink/80 leading-relaxed">
            ScreenWise looks at your screen time, sleep, exercise, and social habits and uses a
            machine learning model trained on real lifestyle data to estimate where your wellness
            pattern falls — Low, Moderate, or High — along with the factors that mattered most.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate("/predict")}
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-paper font-semibold text-base hover:bg-primary-dark transition-all shadow-glow hover:-translate-y-0.5"
            >
              Check My Wellness
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <span className="text-xs text-muted">Takes about a minute &middot; no sign-up</span>
          </div>
        </div>
      </section>

      <section className="relative max-w-5xl mx-auto px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`group rounded-xl2 bg-card border border-line p-6 shadow-card hover:shadow-glow hover:-translate-y-1 hover:border-primary/30 transition-all animate-fade-in-up animate-delay-${i + 1}`}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-light text-primary mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-5 h-5" />
              </span>
              <h3 className="font-semibold text-ink mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative border-t border-line bg-card/60">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-xl mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-ink tracking-tight">How it works</h2>
            <p className="mt-2 text-muted">Three steps between you and an explainable wellness read.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            <div
              className="hidden md:block absolute top-6 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-primary/40 via-line to-primary/40"
              aria-hidden="true"
            />
            {STEPS.map((step, i) => (
              <div key={step.title} className={`relative animate-fade-in-up animate-delay-${i + 1}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="relative z-10 inline-flex items-center justify-center w-12 h-12 rounded-full bg-paper border-2 border-primary text-primary font-bold shadow-card">
                    <step.icon className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-ink mb-1.5">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
