import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { predictWellness, ApiError } from "../services/api.js";
import { AlertIcon, DeviceIcon, HeartPulseIcon, UserIcon } from "./icons.jsx";

const GENDER_OPTIONS = ["Female", "Male", "Non-binary/Other"];
const OCCUPATION_OPTIONS = ["Employed", "Self-employed", "Student", "Unemployed", "Retired"];
const WORK_MODE_OPTIONS = ["Remote", "Hybrid", "In-person"];

const initialForm = {
  age: 25,
  gender: "Female",
  occupation: "Student",
  work_mode: "Remote",
  screen_time_hours: 8,
  work_screen_hours: 2,
  leisure_screen_hours: 6,
  sleep_hours: 7,
  exercise_minutes_per_week: 100,
  social_hours_per_week: 8,
};

function NumberField({ label, name, value, onChange, min, max, step = 1, unit }) {
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="text-xs font-semibold text-primary bg-primary-light rounded-full px-2.5 py-0.5 tabular-nums">
          {value}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="flex-1"
          style={{
            background: `linear-gradient(to right, #2f5f66 ${percent}%, #e2ded2 ${percent}%)`,
          }}
        />
        <input
          type="number"
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="w-16 shrink-0 rounded-md border border-line bg-paper px-2 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </label>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function Section({ title, description, icon: Icon, step, children }) {
  return (
    <section className="rounded-xl2 bg-card border border-line p-6 shadow-card hover:border-primary/25 transition-colors">
      <div className="flex items-start gap-3 mb-1">
        <span className="inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-lg bg-primary-light text-primary">
          <Icon className="w-5 h-5" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-muted">STEP {step}</span>
          </div>
          <h2 className="text-base font-semibold text-ink">{title}</h2>
        </div>
      </div>
      {description && <p className="text-sm text-muted mt-1 mb-5 ml-12">{description}</p>}
      <div className={`grid gap-5 sm:grid-cols-2 ${description ? "" : "mt-5"}`}>{children}</div>
    </section>
  );
}

export function validateForm(form) {
  const errors = {};
  if (!form.age || form.age < 10 || form.age > 100) errors.age = "Age must be between 10 and 100.";
  if (form.screen_time_hours < 0 || form.screen_time_hours > 24)
    errors.screen_time_hours = "Total screen time must be between 0 and 24 hours.";
  if (form.work_screen_hours < 0 || form.work_screen_hours > 24)
    errors.work_screen_hours = "Work screen time must be between 0 and 24 hours.";
  if (form.leisure_screen_hours < 0 || form.leisure_screen_hours > 24)
    errors.leisure_screen_hours = "Leisure screen time must be between 0 and 24 hours.";
  if (form.sleep_hours < 0 || form.sleep_hours > 24)
    errors.sleep_hours = "Sleep hours must be between 0 and 24.";
  if (form.exercise_minutes_per_week < 0 || form.exercise_minutes_per_week > 1000)
    errors.exercise_minutes_per_week = "Exercise minutes must be between 0 and 1000.";
  if (form.social_hours_per_week < 0 || form.social_hours_per_week > 168)
    errors.social_hours_per_week = "Social hours must be between 0 and 168.";
  if (
    Number(form.work_screen_hours) + Number(form.leisure_screen_hours) >
    Number(form.screen_time_hours) + 0.01
  ) {
    errors.screen_time_hours = "Total screen time should be at least work + leisure screen time.";
  }
  return errors;
}

export default function PredictionForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" || type === "range" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setApiError(null);
    setLoading(true);
    try {
      const result = await predictWellness(form);
      navigate("/result", { state: { result, form } });
    } catch (err) {
      if (err instanceof ApiError) {
        setApiError(err.message);
      } else {
        setApiError("Could not reach the ScreenWise API. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold text-ink tracking-tight">Tell us about your day</h1>
        <p className="text-muted mt-2 mb-8">
          A few quick questions about your screen time and lifestyle. All fields are required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="animate-fade-in-up animate-delay-1">
          <Section title="Personal Information" icon={UserIcon} step={1}>
            <NumberField label="Age" name="age" value={form.age} onChange={handleChange} min={10} max={100} />
            <SelectField label="Gender" name="gender" value={form.gender} onChange={handleChange} options={GENDER_OPTIONS} />
            <SelectField
              label="Occupation"
              name="occupation"
              value={form.occupation}
              onChange={handleChange}
              options={OCCUPATION_OPTIONS}
            />
            <SelectField
              label="Work Mode"
              name="work_mode"
              value={form.work_mode}
              onChange={handleChange}
              options={WORK_MODE_OPTIONS}
            />
          </Section>
        </div>

        <div className="animate-fade-in-up animate-delay-2">
          <Section title="Screen Time" description="Roughly how many hours per day?" icon={DeviceIcon} step={2}>
            <NumberField
              label="Total screen time"
              name="screen_time_hours"
              value={form.screen_time_hours}
              onChange={handleChange}
              min={0}
              max={24}
              step={0.1}
              unit="hrs"
            />
            <NumberField
              label="Work screen time"
              name="work_screen_hours"
              value={form.work_screen_hours}
              onChange={handleChange}
              min={0}
              max={24}
              step={0.1}
              unit="hrs"
            />
            <NumberField
              label="Leisure screen time"
              name="leisure_screen_hours"
              value={form.leisure_screen_hours}
              onChange={handleChange}
              min={0}
              max={24}
              step={0.1}
              unit="hrs"
            />
          </Section>
        </div>

        <div className="animate-fade-in-up animate-delay-3">
          <Section title="Lifestyle" description="Your typical weekly habits." icon={HeartPulseIcon} step={3}>
            <NumberField
              label="Average sleep"
              name="sleep_hours"
              value={form.sleep_hours}
              onChange={handleChange}
              min={0}
              max={16}
              step={0.1}
              unit="hrs/night"
            />
            <NumberField
              label="Exercise"
              name="exercise_minutes_per_week"
              value={form.exercise_minutes_per_week}
              onChange={handleChange}
              min={0}
              max={400}
              step={5}
              unit="min/wk"
            />
            <NumberField
              label="Social time"
              name="social_hours_per_week"
              value={form.social_hours_per_week}
              onChange={handleChange}
              min={0}
              max={40}
              step={0.5}
              unit="hrs/wk"
            />
          </Section>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="flex gap-3 rounded-lg border border-low/30 bg-low/10 px-4 py-3 text-sm text-low animate-fade-in-up">
            <AlertIcon className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Please fix the following:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {Object.values(errors).map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {apiError && (
          <div className="flex gap-3 rounded-lg border border-low/30 bg-low/10 px-4 py-3 text-sm text-low animate-fade-in-up">
            <AlertIcon className="w-5 h-5 shrink-0 mt-0.5" />
            {apiError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-6 py-3.5 text-paper font-semibold text-base hover:bg-primary-dark hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 shadow-glow"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-paper/40 border-t-paper animate-spin" />
              Analyzing your lifestyle pattern...
            </span>
          ) : (
            "Predict My Wellness"
          )}
        </button>
      </form>
    </div>
  );
}
